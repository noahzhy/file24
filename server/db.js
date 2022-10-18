const fs = require('fs');
const sqlite3 = require('sqlite3');
const dbPath = "../db/files.db";
const filesRootPath = "../files/";

var DB = DB || {};

DB.initDB = function () {
    DB.db = new sqlite3.Database(dbPath, function (err) {
        if (err) {
            console.log(err);
        }
        DB.db.run('CREATE TABLE IF NOT EXISTS files (userName TEXT, filePath TEXT PRIMARY KEY, uploadTime DATETIME)');
    });
}

DB.initDB.prototype.insertFile = function insertFile(userName, filePath) {
    // insert record into db on conflict replace
    DB.db.prepare("insert or replace into files values (?, ?, datetime('now'))").run(userName, filePath);
}

DB.initDB.prototype.deleteAll = function deleteAll() {
    DB.db.prepare("delete from files").run();
}

DB.initDB.prototype.deleteWhereUserName = function deleteWhereUserName(userName) {
    DB.db.prepare("delete from files where userName = ?").run(userName);
}

DB.initDB.prototype.queryViaUserName = function queryViaUserName(userName, callback) {
    DB.db.prepare("select filePath, uploadTime from files where userName = ? ORDER BY uploadTime DESC").all(userName,
        function (err, rows) {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < rows.length; i++) {
                rows[i].filePath = divideUserNameAndFileName(rows[i].filePath)[1];
                rows[i].timeLeft = timeLeftOfFile(rows[i].uploadTime);
            }
            // to json format
            callback(rows);
        }
    );
}

DB.initDB.prototype.resetUploadTime = function resetUploadTime(filePath) {
    DB.db.prepare("update files set uploadTime = datetime('now') where filePath = ?").run(filePath);
}

DB.initDB.prototype.cleanUpViaUserName = function cleanUpViaUserName(userName) {
    // if username has no record, delete all files of this user
    DB.db.prepare("select count(*) from files where userName = ?").get(userName,
        function (err, row) {
            if (err) {
                console.log(err);
            }
            if (row['count(*)'] === 0) {
                DB.initDB.prototype.deleteWhereUserName(userName);
                // delete the folder of this user
                fs.rmdir(filesRootPath + userName, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    );
}

DB.initDB.prototype.deleteOlderThanOneDay = function deleteOlderThanOneDay(callback) {
    DB.db.prepare("select * from files where uploadTime < datetime('now', '-1 day')").all(
        function (err, rows) {
            if (err) {
                console.log(err);
            }
            // select filePaths and delete them
            rows.forEach(function (row) {
                // delete record in db
                console.log("Delete file: " + row.filePath);
                DB.db.prepare("delete from files where filePath = ?").run(row.filePath);
                let realFilePath = filesRootPath + row.filePath;
                fs.unlink(realFilePath, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            callback();
        }
    );
}


function timeLeftOfFile(uploadTime) {
    var timeOffset = new Date().getTimezoneOffset() * 60 * 1000;
    var uploadTime = new Date(uploadTime);
    var timeLeft = 24 * 60 * 60 * 1000 - (new Date().getTime() + timeOffset - uploadTime.getTime());
    // ms to hours,mins,secs
    var hours = Math.floor(timeLeft / 3600000);
    var mins = Math.floor((timeLeft % 3600000) / 60000);
    // return string format as "hh:mm:ss"
    return hours + "h" + mins + "min";
}

function divideUserNameAndFileName(filePath) {
    var index = filePath.lastIndexOf('/');
    return [filePath.substring(0, index), filePath.substring(index + 1)];
}


// export the db object
exports.DB = DB.initDB;

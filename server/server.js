const fs = require('fs');
const http = require('http');
const path = require('path');
const multer = require('multer');
const template = require('art-template');
const schedule = require('node-schedule');

const DB = require('./db.js').DB;

const db = new DB();
const server = http.createServer();
const filesRootPath = '../files';

// execute each minute
let rule = new schedule.RecurrenceRule();
rule.second = 0;
schedule.scheduleJob(rule, function () {
    db.deleteOlderThanOneDay();
    deleteEmptyDir(filesRootPath);
    console.log('clean up >> ' + new Date().toLocaleString());
});


// delete empty dir under given dir except root dir
function deleteEmptyDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function (file) {
        let filePath = path.join(dir, file);
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            deleteEmptyDir(filePath);
            if (fs.readdirSync(filePath).length === 0) {
                fs.rmdirSync(filePath);
            }
        }
    });
}

// mkdir
function mkdir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

// is file
function isFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile()
}

// is dir
function isDir(path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

// download file
function downloadFile(res, path) {
    let data = fs.readFileSync(path)
    res.setHeader('Content-Type', 'application/octet-stream')
    let filename = path.split('\/').pop()
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
    res.end(data)
}

// to specify page
function toPage(res, page, data) {
    let html = template(path.join(__dirname, 'www', page), data)
    res.end(html)
}

// to user page
function toUserPage(res, username) {
    // to user page
    db.queryViaUserName(username, function (rows) {
        let data = {
            username: username,
            files: rows,
        }
        toPage(res, 'user.html', data)
    })
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            mkdir('../files/' + req.body.userName)
            cb(null, '../files/' + req.body.userName)
        },
        filename: function (req, file, cb) {
            const { fieldname, originalname, encoding, mimetype } = file
            cb(null, originalname);

            console.log('File save path: ' + req.body.userName + '/' + originalname)
            console.log('File upload time: ' + req.body.uploadTime)

            db.insertFile(req.body.userName, req.body.userName + '/' + originalname)
        }
    })
})


server.on('request', (req, res) => {
    const url = req.url

    if (url === '/upload') {
        // upload file
        upload.array('file')(req, res, function (err) {
            if (err) {
                console.log(err)
                return
            }
        })

    } else if (url === '/' || url === '/index.html') {
        // to index.html
        toPage(res, 'index.html', {})

    } else if (url === '/test.html') {
        // to test.html
        toPage(res, 'test.html', {})

    } else {
        const filePath = '../files' + url

        if (isFile(filePath)) {
            // download file
            downloadFile(res, filePath)

        } else if (isDir(filePath)) {
            // todo: check username in db or not
            toUserPage(res, url.split('\/').pop())

        } else {
            toPage(res, '404.html', {})

        }
    }
})

server.listen(3000, () => {
    console.log('running...')
})

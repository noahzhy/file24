const fs = require('fs');
const http = require('http');
const path = require('path');
const multer = require('multer');
const template = require('art-template');
const schedule = require('node-schedule');

const DB = require('./db.js').DB;

const db = new DB();
const server = http.createServer();
const filesRootPath = '../files/';

// execute each minute
let rule = new schedule.RecurrenceRule();
rule.second = 30;
schedule.scheduleJob(rule, function () {
    db.deleteOlderThanOneDay(function () {
        deleteEmptyDir(filesRootPath);
    });
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
    let filename = path.split('\/').pop()
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename))
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
    limits: {
        // 100MB
        fileSize: 100 * 1024 * 1024
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            mkdir(filesRootPath + req.body.userName)
            cb(null, filesRootPath + req.body.userName)
        },
        filename: function (req, file, cb) {
            const { fieldname, originalname, encoding, mimetype } = file
            const utf8Name = Buffer.from(originalname, "latin1").toString("utf8")
            cb(null, utf8Name);

            console.log('File save path: ' + req.body.userName + '/' + utf8Name)
            console.log('File upload time: ' + req.body.uploadTime)

            db.insertFile(req.body.userName, req.body.userName + '/' + utf8Name)
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
                return res.end('Upload failed')
            }
        })
        res.end('upload success')

    } else if (url === '/' || url === '/index.html') {
        // to index.html
        toPage(res, 'index.html', {})

    } else if (url === '/test.html') {
        // to test.html
        db.deleteAll()
        toPage(res, 'test.html', {})

    } else {
        // to utf8 file name
        let path = decodeURI(url)
        // replace %20 to space
        const filePath = '../files' + path.replace(/%20/g, ' ')
        console.log('File download path: ' + filePath)

        if (isFile(filePath)) {
            // download file
            downloadFile(res, filePath)

        } else if (isDir(filePath)) {
            // todo: check username in db or not
            toUserPage(res, filePath.split('\/').pop())

        } else {
            toPage(res, '404.html', {})

        }
    }
})

server.listen(3000, () => {
    console.log('running...')
})

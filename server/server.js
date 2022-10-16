const fs = require('fs');
const http = require('http');
const path = require('path');
const multer = require('multer');
const template = require('art-template');

const server = http.createServer();


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

// add upload time to the file in files and return dict
function addUploadTime(files) {
    let dict = {}
    for (let file of files) {
        let subDict = {}
        subDict['name'] = file
        subDict['uploadTime'] = new Date().toLocaleString()
        dict[file] = subDict
    }
    return dict
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
    const filePath = '../files/' + username
    // to user page
    const files = fs.readdirSync(filePath)
    const data = {
        username: username,
        files: addUploadTime(files),
    }
    toPage(res, 'user.html', data)
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            mkdir('../files/' + req.body.userName)
            cb(null, '../files/' + req.body.userName)
        },
        filename: function (req, file, cb) {
            console.log('file name: ' + file.originalname)
            console.log('file save path: ' + req.body.userName + '/' + file.originalname)
            console.log('file upload time: ' + req.body.uploadTime)
            const { fieldname, originalname, encoding, mimetype } = file
            cb(null, originalname);
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

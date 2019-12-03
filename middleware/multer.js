'use strict'

const path = require('path');
const multer = require('multer');

const url = path.join(process.cwd(), 'process', 'files');

function rename(name) {
    let extension = path.extname(name);
    let date = Date.now();
    let nameNew = name.replace(extension,'').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-')
    return nameNew+date+extension;
}

const storage = multer.diskStorage(
    {
        destination: (req,file,cb)=>{
            cb(null,url);
        },
        filename: (req,file,cb)=>{
            cb(null,rename(file.originalname));
        }
    }
);

const upload = multer({storage: storage});

module.exports ={
    upload
}
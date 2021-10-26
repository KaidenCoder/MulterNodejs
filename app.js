const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

// set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

// Init Upload
 const upload = multer({
     storage: storage,
     limits: {fileSize: 1000000},
     fileFilter: function(req, file, cb){
         checkFileType(file, cb)
     }
 }).single('myImage')

 // Check file type
 function checkFileType(file, cb){
     // Allowed ext
     const fileTypes = /jpeg|jpg|png|gif/;
     // Check ext
     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
     // Check mime
     const mimetype = fileTypes.test(file.mimetype)

     if(mimetype && extname){
        return cb(null, true) 
     }else{
         cb('Error: images only')
     }

 }

// Init app
const app = express()
const port = 3000

// middleware
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('index', {msg: '', file:''})
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {msg: err, file:''})
        }
        else{
            if(req.file == undefined){
                res.render('index', {msg: 'No file selected', file: 
            ''})
            }else{
                console.log(`uploads/${req.file.fieldname}`)
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
const multer = require('multer');
const path =require('path')
const rootfileName=path.dirname(process.mainModule.filename)

// Create multer object
module.exports = {
  VideoUpload: multer({
    dest: rootfileName+'/assets/speakupVideos',
  }),
  
  pdfUserUpload:multer({
    dest: rootfileName+'/assets/public/upload/userPdf'
  })
}
const multer = require('multer')

const upload = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + '-' + file.originalname)
  }
})
const uploads = multer({ storage: upload })
const firebaseUpload = multer({ storage: multer.memoryStorage() })
module.exports = { uploads, firebaseUpload }
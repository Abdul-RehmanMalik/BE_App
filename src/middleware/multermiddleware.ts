import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '')
  },
})
export const upload = multer({ storage: storage })

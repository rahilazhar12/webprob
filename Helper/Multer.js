const multer = require('multer')

const storage = multer.diskStorage({
  destination: "uploads",

  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/svg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false)

  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // for 2MB
  },
});


module.exports = upload;


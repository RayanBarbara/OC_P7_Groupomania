const multer = require("multer");

// MIME types map which resolve files extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif"
};

// Filter out file which doesn't conform to the asked format
const fileFilter = (req, file, callback) => {
  if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    callback(null, true);
  } else {
    return callback(new Error("Invalid file format!"), false);
  }
};

// Indicate where to store files and how to name them to avoid duplicates
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  }
});

module.exports = multer({ storage, fileFilter }).single("image");
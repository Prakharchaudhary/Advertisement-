const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let destinationFolder = "";
    
        if (file.mimetype.startsWith("image/")) {
          destinationFolder = path.join(__dirname, "../public/image");
        } else if (file.mimetype.startsWith("audio/")) {
          destinationFolder = path.join(__dirname, "../public/audio");
        } else {
          return cb(new Error("Unsupported file type"));
        }
    
        cb(null, destinationFolder);
      },
      filename: function (req, file, cb) {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname).toLowerCase();
        const newFilename = `${timestamp}${extension}`;
        cb(null, newFilename);
      },
    });
    
    const upload = multer({ storage: storage });
    module.exports = upload
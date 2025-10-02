// backend/src/middleware/uploadMiddleware.js
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import storageConfig from "../config/storage.js";

// --- File Filter ---
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

let upload;

if (process.env.STORAGE_PROVIDER === "cloudinary") {
  // For Cloudinary, we don't use multer for storage, but for parsing the form.
  // The controller will handle the upload stream to Cloudinary.
  const storage = multer.memoryStorage();
  upload = multer({ storage, fileFilter: checkFileType });
} else if (process.env.STORAGE_PROVIDER === "s3" && storageConfig.s3) {
  upload = multer({
    storage: multerS3({
      s3: storageConfig.s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(
          null,
          `uploads/posts/${Date.now()}_${path.basename(file.originalname)}`
        );
      },
    }),
    fileFilter: checkFileType,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
} else {
  // Fallback to local storage for development if no provider is set
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  upload = multer({ storage });
  console.log("Warning: No cloud storage configured. Using local uploads.");
}

export default upload;

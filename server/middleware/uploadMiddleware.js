import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  const error = new Error(
    "Only JPG, PNG and WebP image files are allowed"
  );

  error.statusCode = 400;

  cb(error, false);
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter,
});

export default upload;
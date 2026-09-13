const errorMiddleware = (err, req, res, next) => {
  console.error("Server error:", err);

  // Multer errors
  if (err.name === "MulterError") {
  let message = err.message;

  if (err.code === "LIMIT_FILE_SIZE") {
    message = "Book cover image must be 5 MB or smaller";
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    message = "Only one book cover image is allowed";
  }

  return res.status(400).json({
    success: false,
    message,
  });
}
  // Custom upload/file validation errors
 if (
  err.message ===
  "Only JPG, PNG and WebP image files are allowed"
) {
  return res.status(400).json({
    success: false,
    message: err.message,
  });
}

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed",
      errors: messages,
    });
  }

  // Invalid MongoDB ObjectId / CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID",
    });
  }

  // Cloudinary errors
if (
  err.http_code &&
  err.name &&
  err.name.toLowerCase().includes("cloudinary")
) {
  return res.status(400).json({
    success: false,
    message: "Book cover image upload failed",
  });
}
  // Default server error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
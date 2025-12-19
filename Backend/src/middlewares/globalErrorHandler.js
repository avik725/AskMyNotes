import multer from "multer";

export default function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500; // Default to 500 if no statusCode
  let message = err.message || "Internal Server Error"; // Default message if none

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        statusCode = 413;
        message = "File Too Large ! Upload a smaller file";
        break;
      case "LIMIT_FILE_SIZE":
        statusCode = 413;
        message = "Too many files uploaded !!";
        break;
    }
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    data: null,
    message: message, // Error message
    ...(err.errors &&
      process.env.NODE_ENV === "development" && { errors: err.errors }), // Any additional errors
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack trace in development only
  });
}

import multer from "multer";

// =====================================
// FILE FILTER
// =====================================

const fileFilter = (req, file, cb) => {

  // Video
  if (file.fieldname === "video") {

    const allowedVideoTypes = [
      "video/mp4",
      "audio/mpeg",
    ];

    if (allowedVideoTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only video files are allowed"),
      false
    );
  }


  // Cover image
  if (file.fieldname === "coverImage") {

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }


  cb(new Error("Invalid file field"), false);
};


// =====================================
// MULTER INSTANCE
// =====================================

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,

  limits: {
    files: 2,
    fileSize: 80 * 1024 * 1024, // 80 MB
  },
});


export default upload;
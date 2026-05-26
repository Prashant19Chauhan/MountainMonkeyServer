import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ===============================
// Cloudinary Config
// ===============================

import { cloudinaryConfig } from "../utility/cloudinary.utils.js";
cloudinaryConfig()

// ===============================
// Cloudinary Storage Config
// ===============================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    return {
      folder: "mountain-monkey",

      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],

      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

// ===============================
// File Validation
// ===============================
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;

  const mimeTypeMatch = allowedExtensions.test(file.mimetype);

  const extNameMatch = allowedExtensions.test(
    file.originalname.split(".").pop().toLowerCase()
  );

  if (mimeTypeMatch && extNameMatch) {
    return cb(null, true);
  }

  cb(
    new Error("Format rejected. Only image files are allowed!"),
    false
  );
};

// ===============================
// Multer Middleware
// ===============================
export const uploadMiddleware = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
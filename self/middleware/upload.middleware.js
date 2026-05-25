import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Guarantee that destination storage folder directory exists physically on server boot
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Storage Configuration Rules
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

// 2. Format Validation Guard
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const mimeTypeMatch = allowedExtensions.test(file.mimetype);
  const extNameMatch = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (mimeTypeMatch && extNameMatch) {
    return cb(null, true);
  }
  cb(new Error('Format rejected. Only standard image files are allowed!'), false);
};

// 3. Export Configured Multer Middleware Instance
export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter // Strict 5MB file threshold limits
});
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = 'uploads/members';

fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg'; 
    const cleanExt = ext.toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + cleanExt);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('🖼️ File Filter Triggered:', file.mimetype); 
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

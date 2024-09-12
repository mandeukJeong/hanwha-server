const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
};

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const storage = multerS3({
  s3,
  bucket: 'hanwhams',
  key: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const sanitizedFileName = sanitizeFileName(originalName);

    const fileName = `${Date.now()}_${sanitizedFileName}${ext}`;
    cb(null, `gallery/${fileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('허용되지 않는 파일 형식입니다.'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10000000, // 파일 크기 제한 10MB
  },
});

module.exports = upload;

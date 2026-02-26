const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('File type not allowed. Use JPEG, PNG, GIF or PDF.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadSingle = (field) => upload.single(field);
const uploadMultiple = (field, max = 5) => upload.array(field, max);

module.exports = { upload, uploadSingle, uploadMultiple };

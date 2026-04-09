const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/', 'uploads/audio/', 'uploads/images/', 'uploads/documents/'];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ===== GENERAL FILE STORAGE =====
const generalStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

// ===== AUDIO FILE STORAGE =====
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/audio/'),
  filename: (req, file, cb) => cb(null, `audio-${uuidv4()}${path.extname(file.originalname)}`),
});

// ===== IMAGE FILE STORAGE =====
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/'),
  filename: (req, file, cb) => cb(null, `image-${uuidv4()}${path.extname(file.originalname)}`),
});

// ===== FILE FILTERS =====

// General file filter (images, PDF, documents)
const generalFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('File type not allowed. Use JPEG, PNG, GIF or PDF.'), false);
};

// Audio file filter
const audioFileFilter = (req, file, cb) => {
  const allowed = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/ogg', 'audio/mp3'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported audio format. Use MP3, WAV, M4A, FLAC or OGG.'), false);
};

// Image file filter (for medicine image analysis)
const imageFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported image format. Use JPEG, PNG, GIF or WebP.'), false);
};

// ===== MULTER INSTANCES =====

// General upload
const generalUpload = multer({ 
  storage: generalStorage, 
  fileFilter: generalFileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Audio upload (max 50MB for longer recordings)
const audioUpload = multer({ 
  storage: audioStorage, 
  fileFilter: audioFileFilter, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Image upload (max 10MB)
const imageUpload = multer({ 
  storage: imageStorage, 
  fileFilter: imageFileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ===== HELPER FUNCTIONS =====

// Upload single general file
const uploadSingle = (field) => generalUpload.single(field);

// Upload multiple general files
const uploadMultiple = (field, max = 5) => generalUpload.array(field, max);

// Upload single audio file (for speech-to-text)
const uploadAudio = audioUpload;

// Upload single image file (for image analysis)
const uploadImage = imageUpload;

// Upload multiple images
const uploadMultipleImages = (max = 5) => imageUpload.array('images', max);

module.exports = { 
  upload: generalUpload,
  uploadSingle, 
  uploadMultiple,
  uploadAudio,
  uploadImage,
  uploadMultipleImages,
};


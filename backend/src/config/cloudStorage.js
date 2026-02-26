// Cloud storage configuration (AWS S3 or Google Cloud Storage)
module.exports = {
  bucket: process.env.CLOUD_STORAGE_BUCKET,
  projectId: process.env.CLOUD_STORAGE_PROJECT_ID,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
};

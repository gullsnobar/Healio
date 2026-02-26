const router = require('express').Router();
const { getProfile, updateProfile, updatePassword, deleteAccount, uploadProfileImage } = require('../controllers/user/userController');
const { authenticate } = require('../middleware/authentication');
const { uploadSingle } = require('../middleware/fileUpload');

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);
router.post('/profile-image', uploadSingle('profileImage'), uploadProfileImage);

module.exports = router;

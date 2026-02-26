const router = require('express').Router();
const { getDashboard, getUsers, getUserDetail, deactivateUser, getSystemStats } = require('../controllers/admin/adminController');
const { authenticate } = require('../middleware/authentication');
const { adminAuth } = require('../middleware/authorization');

router.use(authenticate, adminAuth);
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.patch('/users/:id/deactivate', deactivateUser);
router.get('/stats', getSystemStats);

module.exports = router;

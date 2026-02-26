const router = require('express').Router();
const { getContacts, addContact, updateContact, removeContact, verifyContact } = require('../controllers/trustedContact/trustedContactController');
const { shareReport } = require('../controllers/trustedContact/sharingController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.route('/').get(getContacts).post(addContact);
router.route('/:id').put(updateContact).delete(removeContact);
router.post('/:id/share', shareReport);
router.get('/verify/:token', verifyContact);

module.exports = router;

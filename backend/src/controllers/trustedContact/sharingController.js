const TrustedContact = require('../../models/TrustedContact');
const { sendShareNotification } = require('../../services/email/emailService');

exports.shareReport = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOne({ _id: req.params.id, user: req.userId, isVerified: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found or not verified' });
    await sendShareNotification(contact.email, req.body);
    res.json({ success: true, message: 'Report shared successfully' });
  } catch (error) { next(error); }
};

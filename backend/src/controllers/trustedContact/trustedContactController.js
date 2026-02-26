const TrustedContact = require('../../models/TrustedContact');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../../services/email/emailService');

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await TrustedContact.find({ user: req.userId, isActive: true });
    res.json({ success: true, data: contacts });
  } catch (error) { next(error); }
};

exports.addContact = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const contact = await TrustedContact.create({ ...req.body, user: req.userId, verificationToken: token });
    await sendVerificationEmail(contact.email, token, req.user.name);
    res.status(201).json({ success: true, data: contact });
  } catch (error) { next(error); }
};

exports.updateContact = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) { next(error); }
};

exports.removeContact = async (req, res, next) => {
  try {
    await TrustedContact.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isActive: false });
    res.json({ success: true, message: 'Contact removed' });
  } catch (error) { next(error); }
};

exports.verifyContact = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOneAndUpdate({ verificationToken: req.params.token }, { isVerified: true, verificationToken: undefined }, { new: true });
    if (!contact) return res.status(400).json({ success: false, message: 'Invalid token' });
    res.json({ success: true, message: 'Contact verified' });
  } catch (error) { next(error); }
};

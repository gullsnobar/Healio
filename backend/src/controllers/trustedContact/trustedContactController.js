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
    try {
      const baseUrl = process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      const verifyLink = `${baseUrl}/api/trusted-contacts/verify/${token}`;
      await sendVerificationEmail(contact.email, verifyLink, req.user.name);
    } catch (emailErr) {
      return res.status(201).json({ success: true, data: contact, emailSent: false });
    }
    res.status(201).json({ success: true, data: contact, emailSent: true });
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
    const acceptsHtml = typeof req.headers?.accept === 'string' && req.headers.accept.includes('text/html');
    if (!contact) {
      if (acceptsHtml) {
        return res.status(400).type('html').send(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>MR & FT - Verification</title>
            </head>
            <body style="margin:0;font-family:Arial,sans-serif;background:#0b1220;color:#e2e8f0;">
              <div style="max-width:560px;margin:0 auto;padding:48px 18px;">
                <div style="background:#111b2e;border:1px solid #22304d;border-radius:16px;padding:22px;">
                  <div style="font-size:18px;font-weight:800;color:#14B8A6;margin:0 0 10px;">MR &amp; FT</div>
                  <div style="font-size:18px;font-weight:800;margin:0 0 8px;">Verification link invalid</div>
                  <div style="font-size:14px;line-height:1.6;color:#94A3B8;">
                    This verification link is invalid or has already been used. If you believe this is a mistake, ask the user to resend the invitation.
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);
      }
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }
    if (acceptsHtml) {
      return res.type('html').send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>MR & FT - Verified</title>
          </head>
          <body style="margin:0;font-family:Arial,sans-serif;background:#0b1220;color:#e2e8f0;">
            <div style="max-width:560px;margin:0 auto;padding:48px 18px;">
              <div style="background:#111b2e;border:1px solid #22304d;border-radius:16px;padding:22px;">
                <div style="font-size:18px;font-weight:800;color:#14B8A6;margin:0 0 10px;">MR &amp; FT</div>
                <div style="font-size:22px;font-weight:900;margin:0 0 10px;">You’re verified</div>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;">
                  Your email has been verified successfully. You are now added as a trusted contact.
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }
    res.json({ success: true, message: 'Contact verified' });
  } catch (error) { next(error); }
};

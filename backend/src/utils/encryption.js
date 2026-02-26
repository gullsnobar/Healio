const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex').slice(0, 32);
exports.encrypt = (text) => { const iv = crypto.randomBytes(16); const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv); let encrypted = cipher.update(text, 'utf8', 'hex'); encrypted += cipher.final('hex'); return iv.toString('hex') + ':' + encrypted; };
exports.decrypt = (text) => { const [ivHex, encrypted] = text.split(':'); const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex')); let decrypted = decipher.update(encrypted, 'hex', 'utf8'); decrypted += decipher.final('utf8'); return decrypted; };

exports.isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
exports.isValidPhone = (phone) => /^\+?[\d\s-]{10,15}$/.test(phone);
exports.isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
exports.sanitizeInput = (str) => str?.replace(/[<>\"'&]/g, '') || '';

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^(\+92|0)?3[0-9]{9}$/.test(phone);
export const isValidPassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
export const isRequired = (value) => value !== null && value !== undefined && value.toString().trim() !== '';
export const isValidOTP = (otp) => /^[0-9]{4,6}$/.test(otp);

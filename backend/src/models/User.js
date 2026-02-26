const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
  phone: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  profileImage: { type: String, default: '' },
  emergencyContact: { name: String, phone: String, relationship: String },
  healthConditions: [{ type: String }],
  allergies: [{ type: String }],
  googleFitConnected: { type: Boolean, default: false },
  googleFitTokens: { accessToken: String, refreshToken: String, expiresAt: Date },
  fcmToken: { type: String },
  preferredLanguage: { type: String, enum: ['en', 'ur'], default: 'en' },
  notificationPreferences: {
    medication: { type: Boolean, default: true },
    appointment: { type: Boolean, default: true },
    fitness: { type: Boolean, default: true },
    general: { type: Boolean, default: true },
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otpCode: String,
  otpExpiry: Date,
  refreshToken: String,
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otpCode;
  delete obj.refreshToken;
  delete obj.googleFitTokens;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

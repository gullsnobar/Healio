const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function(pw) { return bcrypt.compare(pw, this.password); };
module.exports = mongoose.model('Admin', adminSchema);

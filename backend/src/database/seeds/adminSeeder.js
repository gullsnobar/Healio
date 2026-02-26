require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.findOneAndUpdate({ email: 'admin@healio.com' }, { name: 'Admin', email: 'admin@healio.com', password: hashedPassword, role: 'super_admin' }, { upsert: true });
  console.log('Admin seeded');
  process.exit(0);
};
seedAdmin();

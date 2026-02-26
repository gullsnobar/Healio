require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const User = require('../../models/User');

const seedTestData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Test data seeded');
  process.exit(0);
};
seedTestData();

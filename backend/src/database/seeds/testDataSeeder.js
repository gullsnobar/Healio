require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

// Fix DNS resolution for Node.js 24+ (SRV records for MongoDB Atlas)
const dns = require('dns');
try {
  const servers = dns.getServers();
  if (!servers.length || servers.every(s => s === '127.0.0.1' || s === '::1')) {
    dns.setServers(['8.8.8.8', '8.8.4.4', '2001:4860:4860::8888']);
  }
} catch {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongoose = require('mongoose');
const User = require('../../models/User');

const TEST_USER = {
  name: 'Test User',
  email: 'test@healio.com',
  password: 'Test1234',
  phone: '+923001234567',
  gender: 'male',
  dateOfBirth: new Date('1995-01-15'),
  bloodGroup: 'O+',
  isActive: true,
  isVerified: true,
  preferredLanguage: 'en',
};

const seedTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing test user if any
    await User.deleteOne({ email: TEST_USER.email });

    // Create test user (password will be hashed by the pre-save hook)
    const user = await User.create(TEST_USER);
    console.log('Test user created successfully:');
    console.log('  Email:    test@healio.com');
    console.log('  Password: Test1234');
    console.log('  ID:       ' + user._id);
    console.log('\nYou can now log in with these credentials.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedTestData();

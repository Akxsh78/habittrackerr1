require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/habittracker'; // Use default or env

const usersToSeed = [
  { name: 'Sudharshan', username: 'Sudharshan', passwordRaw: '459CS23016', role: 'user' },
  { name: 'Akashraj', username: 'Akashraj', passwordRaw: '459CS23046', role: 'admin' },
  { name: 'Vinay', username: 'Vinay', passwordRaw: '459CS23051', role: 'user' },
  { name: 'Ashok', username: 'Ashok', passwordRaw: '459CS23008', role: 'user' },
  { name: 'Manikanta', username: 'Manikanta', passwordRaw: '459CS23011', role: 'user' },
  { name: 'Sadap', username: 'Sadap', passwordRaw: '459CS23089', role: 'user' },
  { name: 'C Vijay', username: 'C Vijay', passwordRaw: '459CS23024', role: 'user' },
  { name: 'Sudeep', username: 'Sudeep', passwordRaw: '459CS23119', role: 'user' }
];

const initialBadges = [
  { name: 'Getting Started', description: 'Complete 10 habit entries', icon: '⭐' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Drop the unique email index if it exists
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
      console.log('🗑️  Dropped email index');
    } catch (e) {
      console.log('ℹ️  Email index not found or already dropped');
    }

    const usersWithHashes = [];

    for (let u of usersToSeed) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.passwordRaw, salt);

      usersWithHashes.push({
        name: u.name,
        username: u.username,
        password: hashedPassword,
        role: u.role,
        status: 'offline',
        totalPoints: 0,
        badges: initialBadges
      });
    }

    await User.insertMany(usersWithHashes);
    console.log('✅ Successfully seeded predefined users');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();

// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop the old single-field unique index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('Old unique email index dropped successfully');
    } catch (err) {
      // Index might not exist, which is fine
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDB;
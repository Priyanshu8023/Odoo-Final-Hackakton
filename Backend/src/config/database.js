const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'Shiv_account'}`;
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 MongoDB URI: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME || 'Shiv_account'}`);
    console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('💡 Please ensure MongoDB is running on localhost:27017');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
  console.log('🎉 Ready to accept database operations!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

 
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down MongoDB connection...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = { connectDB, mongoose };

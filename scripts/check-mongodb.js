const { connectDB, mongoose } = require('../Backend/src/config/database');

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB Connection...');
  console.log('=====================================');
  
  try {
    console.log('📍 Connecting to: mongodb://localhost:27017/Shiv_account');
    
    await connectDB();
    
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Database: Shiv_account`);
    console.log(`📋 Collections: ${collections.length}`);
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    console.log('🎉 MongoDB is ready for use!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Please ensure MongoDB is running on localhost:27017');
    console.error('   Start MongoDB: net start MongoDB (Windows)');
    console.error('   Or: brew services start mongodb-community (macOS)');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

checkMongoDB();

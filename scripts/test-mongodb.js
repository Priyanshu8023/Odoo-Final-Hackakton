const { connectDB, mongoose } = require('../Backend/src/config/database');

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Connection...');
  console.log('=====================================');
  
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Test database operations
    console.log('🔍 Testing database operations...');
    
    // Get database stats
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log('📊 Database Statistics:');
    console.log(`   Database Name: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections in database:');
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    console.log('\n✅ MongoDB connection test successful!');
    console.log('🎉 Database is ready for use!');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    console.error('💡 Please ensure MongoDB is running on localhost:27017');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed.');
  }
}

testMongoDB();

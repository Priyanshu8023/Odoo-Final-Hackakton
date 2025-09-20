const { connectDB, mongoose } = require('../config/database');
const Product = require('../models/Product');
const Organization = require('../models/Organization');

async function seedProducts() {
  try {
    console.log('🌱 Seeding Products...');
    console.log('=====================================');

    // Connect to MongoDB
    await connectDB();

    // Get the default organization
    const organization = await Organization.findOne();
    if (!organization) {
      console.error('❌ No organization found. Please run migration first.');
      return;
    }

    // Sample products data
    const sampleProducts = [
      {
        organizationId: organization._id,
        name: "Steel Rods 12mm",
        type: "goods",
        salesPrice: 450.00,
        purchasePrice: 400.00,
        hsnCode: "72142010",
        category: "Construction Materials",
        quantityOnHand: 100
      },
      {
        organizationId: organization._id,
        name: "Cement Bags 50kg",
        type: "goods",
        salesPrice: 350.00,
        purchasePrice: 320.00,
        hsnCode: "25232910",
        category: "Construction Materials",
        quantityOnHand: 50
      },
      {
        organizationId: organization._id,
        name: "Electrical Wiring Service",
        type: "service",
        salesPrice: 150.00,
        purchasePrice: 100.00,
        hsnCode: "998713",
        category: "Services",
        quantityOnHand: 0
      },
      {
        organizationId: organization._id,
        name: "Aluminum Sheets 2mm",
        type: "goods",
        salesPrice: 280.00,
        purchasePrice: 250.00,
        hsnCode: "76061110",
        category: "Metal Sheets",
        quantityOnHand: 25
      },
      {
        organizationId: organization._id,
        name: "Consultation Service",
        type: "service",
        salesPrice: 500.00,
        purchasePrice: 300.00,
        hsnCode: "998312",
        category: "Services",
        quantityOnHand: 0
      }
    ];

    // Clear existing products
    await Product.deleteMany({ organizationId: organization._id });
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} sample products`);

    console.log('=====================================');
    console.log('🎉 Product seeding completed successfully!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Product seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts };

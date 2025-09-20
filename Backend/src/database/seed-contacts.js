const { connectDB, mongoose } = require('../config/database');
const Contact = require('../models/Contact');
const Organization = require('../models/Organization');

async function seedContacts() {
  try {
    console.log('🌱 Seeding Contacts...');
    console.log('=====================================');

    // Connect to MongoDB
    await connectDB();

    // Get the default organization
    const organization = await Organization.findOne();
    if (!organization) {
      console.error('❌ No organization found. Please run migration first.');
      return;
    }

    // Sample contacts data
    const sampleContacts = [
      {
        organizationId: organization._id,
        name: "Nimesh Pathak",
        type: ["customer"],
        email: "nimesh.pathak@example.com",
        mobile: "+91-9876543210",
        address: {
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001"
        },
        profileImageURL: ""
      },
      {
        organizationId: organization._id,
        name: "Azure Furniture",
        type: ["vendor"],
        email: "orders@azurefurniture.com",
        mobile: "+91-9876543211",
        address: {
          city: "Delhi",
          state: "Delhi",
          pincode: "110001"
        },
        profileImageURL: ""
      },
      {
        organizationId: organization._id,
        name: "Rajesh Kumar",
        type: ["customer", "vendor"],
        email: "rajesh.kumar@example.com",
        mobile: "+91-9876543212",
        address: {
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001"
        },
        profileImageURL: ""
      },
      {
        organizationId: organization._id,
        name: "Steel Works Ltd",
        type: ["vendor"],
        email: "sales@steelworks.com",
        mobile: "+91-9876543213",
        address: {
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001"
        },
        profileImageURL: ""
      },
      {
        organizationId: organization._id,
        name: "Priya Sharma",
        type: ["customer"],
        email: "priya.sharma@example.com",
        mobile: "+91-9876543214",
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001"
        },
        profileImageURL: ""
      }
    ];

    // Clear existing contacts
    await Contact.deleteMany({ organizationId: organization._id });
    console.log('🗑️  Cleared existing contacts');

    // Insert sample contacts
    const contacts = await Contact.insertMany(sampleContacts);
    console.log(`✅ Created ${contacts.length} sample contacts`);

    console.log('=====================================');
    console.log('🎉 Contact seeding completed successfully!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Contact seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedContacts();
}

module.exports = { seedContacts };

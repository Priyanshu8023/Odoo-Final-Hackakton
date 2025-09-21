const mongoose = require('mongoose');
const Contact = require('./src/models/Contact');
require('dotenv').config();

async function fixVendorOrg() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicing_system');
    console.log('Connected to MongoDB');
    
    const correctOrgId = '68ce8a3cc61c753c8a03080d'; // The organization ID from the JWT token
    
    // Update all vendors to be in the correct organization
    const result = await Contact.updateMany(
      { type: { $in: ['vendor'] } },
      { organizationId: correctOrgId }
    );
    
    console.log(`Updated ${result.modifiedCount} vendors to organization ${correctOrgId}`);
    
    // Verify the update
    const vendors = await Contact.find({ 
      type: { $in: ['vendor'] },
      organizationId: correctOrgId
    });
    
    console.log(`Vendors in correct organization: ${vendors.length}`);
    vendors.forEach(vendor => {
      console.log(`- ${vendor.name}: ${vendor.vendorRefNo || 'NO REF'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixVendorOrg();

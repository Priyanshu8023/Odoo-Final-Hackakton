const mongoose = require('mongoose');
const Contact = require('./src/models/Contact');
require('dotenv').config();

async function debugVendors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicing_system');
    console.log('Connected to MongoDB');
    
    // Check all vendors
    const allVendors = await Contact.find({ type: { $in: ['vendor'] } });
    console.log('All vendors:', allVendors.length);
    allVendors.forEach(vendor => {
      console.log(`- ${vendor.name} (org: ${vendor.organizationId}): ${vendor.vendorRefNo || 'NO REF'}`);
    });
    
    // Check with specific organization ID
    const orgId = '68ce8a3cc61c753c8a03080d'; // The organization ID from the JWT token
    const orgVendors = await Contact.find({ 
      type: { $in: ['vendor'] },
      organizationId: orgId
    });
    console.log(`\nVendors for org ${orgId}:`, orgVendors.length);
    orgVendors.forEach(vendor => {
      console.log(`- ${vendor.name}: ${vendor.vendorRefNo || 'NO REF'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugVendors();

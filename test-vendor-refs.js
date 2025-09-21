const mongoose = require('mongoose');
const Contact = require('./Backend/src/models/Contact');
require('dotenv').config();

async function checkVendorRefs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicing_system');
    console.log('Connected to MongoDB');
    
    const vendors = await Contact.find({ type: { $in: ['vendor'] } });
    console.log('Total vendors:', vendors.length);
    
    vendors.forEach(vendor => {
      console.log(`- ${vendor.name}: ${vendor.vendorRefNo || 'NO REF'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkVendorRefs();

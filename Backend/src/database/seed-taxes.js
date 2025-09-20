const mongoose = require('mongoose');
const Tax = require('../models/Tax');
const Organization = require('../models/Organization');
const { connectDB } = require('../config/database');

const seedTaxes = async () => {
  await connectDB();
  console.log('🌱 Seeding Taxes...');

  try {
    const organization = await Organization.findOne();
    if (!organization) {
      console.error('No organization found. Please create an organization first.');
      return;
    }

    await Tax.deleteMany({ organizationId: organization._id });
    console.log('🗑️  Cleared existing taxes');

    const taxesData = [
      {
        organizationId: organization._id,
        tax_name: 'GST 5%',
        rate: new mongoose.Types.Decimal128('5.00'),
        computation_method: 'percentage',
        applicable_on: 'both'
      },
      {
        organizationId: organization._id,
        tax_name: 'GST 12%',
        rate: new mongoose.Types.Decimal128('12.00'),
        computation_method: 'percentage',
        applicable_on: 'both'
      },
      {
        organizationId: organization._id,
        tax_name: 'GST 18%',
        rate: new mongoose.Types.Decimal128('18.00'),
        computation_method: 'percentage',
        applicable_on: 'both'
      },
      {
        organizationId: organization._id,
        tax_name: 'GST 28%',
        rate: new mongoose.Types.Decimal128('28.00'),
        computation_method: 'percentage',
        applicable_on: 'both'
      },
      {
        organizationId: organization._id,
        tax_name: 'Service Tax',
        rate: new mongoose.Types.Decimal128('15.00'),
        computation_method: 'percentage',
        applicable_on: 'sales'
      },
      {
        organizationId: organization._id,
        tax_name: 'Fixed Tax',
        rate: new mongoose.Types.Decimal128('50.00'),
        computation_method: 'fixed',
        applicable_on: 'both'
      }
    ];

    const createdTaxes = await Tax.insertMany(taxesData);
    console.log(`✅ Created ${createdTaxes.length} sample taxes`);
    console.log('=====================================');
    console.log('🎉 Tax seeding completed successfully!');
    console.log('=====================================');
  } catch (error) {
    console.error('Error seeding taxes:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedTaxes();

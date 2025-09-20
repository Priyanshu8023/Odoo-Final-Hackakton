const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Invoicing User', 'Contact').default('Invoicing User'),
  contact_id: Joi.number().integer().positive().allow(null)
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Contact validation schemas
const contactCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid('Customer', 'Vendor', 'Both').required(),
  email: Joi.string().email().allow('', null),
  mobile: Joi.string().max(20).allow('', null),
  city: Joi.string().max(100).allow('', null),
  state: Joi.string().max(100).allow('', null),
  pincode: Joi.string().max(10).allow('', null),
  profile_image_url: Joi.string().uri().allow('', null)
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  type: Joi.string().valid('Customer', 'Vendor', 'Both'),
  email: Joi.string().email().allow('', null),
  mobile: Joi.string().max(20).allow('', null),
  city: Joi.string().max(100).allow('', null),
  state: Joi.string().max(100).allow('', null),
  pincode: Joi.string().max(10).allow('', null),
  profile_image_url: Joi.string().uri().allow('', null)
});

// Product validation schemas
const productCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid('Goods', 'Service').required(),
  sales_price: Joi.number().positive().precision(2).required(),
  purchase_price: Joi.number().positive().precision(2).required(),
  hsn_code: Joi.string().max(50).allow('', null),
  category_id: Joi.number().integer().positive().allow(null),
  sale_tax_id: Joi.number().integer().positive().allow(null),
  purchase_tax_id: Joi.number().integer().positive().allow(null)
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  type: Joi.string().valid('Goods', 'Service'),
  sales_price: Joi.number().positive().precision(2),
  purchase_price: Joi.number().positive().precision(2),
  hsn_code: Joi.string().max(50).allow('', null),
  category_id: Joi.number().integer().positive().allow(null),
  sale_tax_id: Joi.number().integer().positive().allow(null),
  purchase_tax_id: Joi.number().integer().positive().allow(null)
});

// Invoice validation schemas
const invoiceCreateSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  sales_order_id: Joi.number().integer().positive().allow(null),
  invoice_date: Joi.date().required(),
  due_date: Joi.date().min(Joi.ref('invoice_date')).required(),
  status: Joi.string().valid('Draft', 'Posted', 'Paid', 'Cancelled').default('Draft'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().positive().precision(2).required(),
      unit_price: Joi.number().positive().precision(2).required(),
      tax_id: Joi.number().integer().positive().allow(null)
    })
  ).min(1).required()
});

const invoiceUpdateSchema = Joi.object({
  customer_id: Joi.number().integer().positive(),
  sales_order_id: Joi.number().integer().positive().allow(null),
  invoice_date: Joi.date(),
  due_date: Joi.date().min(Joi.ref('invoice_date')),
  status: Joi.string().valid('Draft', 'Posted', 'Paid', 'Cancelled'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().positive().precision(2).required(),
      unit_price: Joi.number().positive().precision(2).required(),
      tax_id: Joi.number().integer().positive().allow(null)
    })
  ).min(1)
});

// Tax validation schemas
const taxCreateSchema = Joi.object({
  tax_name: Joi.string().min(1).max(100).required(),
  computation_method: Joi.string().valid('Percentage', 'Fixed').required(),
  rate: Joi.number().min(0).precision(2).required(),
  applicable_on: Joi.string().valid('Sales', 'Purchase', 'Both').required()
});

const taxUpdateSchema = Joi.object({
  tax_name: Joi.string().min(1).max(100),
  computation_method: Joi.string().valid('Percentage', 'Fixed'),
  rate: Joi.number().min(0).precision(2),
  applicable_on: Joi.string().valid('Sales', 'Purchase', 'Both')
});

// Product Category validation schemas
const productCategoryCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required()
});

const productCategoryUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255)
});

// Chart of Account validation schemas
const chartOfAccountCreateSchema = Joi.object({
  account_name: Joi.string().min(1).max(255).required(),
  account_type: Joi.string().valid('Asset', 'Liability', 'Income', 'Expense', 'Equity').required(),
  description: Joi.string().allow('', null)
});

const chartOfAccountUpdateSchema = Joi.object({
  account_name: Joi.string().min(1).max(255),
  account_type: Joi.string().valid('Asset', 'Liability', 'Income', 'Expense', 'Equity'),
  description: Joi.string().allow('', null)
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    req.body = value;
    next();
  };
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  contactCreateSchema,
  contactUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  invoiceCreateSchema,
  invoiceUpdateSchema,
  taxCreateSchema,
  taxUpdateSchema,
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
  chartOfAccountCreateSchema,
  chartOfAccountUpdateSchema,
  validate
};


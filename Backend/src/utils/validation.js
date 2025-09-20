const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'invoicing_user', 'contact_user').default('invoicing_user'),
  name: Joi.string().min(1).max(255).required()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Contact validation schemas
const contactCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.array().items(Joi.string().valid('customer', 'vendor')).min(1).required(),
  email: Joi.string().email().allow('', null),
  mobile: Joi.string().max(20).allow('', null),
  address: Joi.object({
    city: Joi.string().max(100).allow('', null),
    state: Joi.string().max(100).allow('', null),
    pincode: Joi.string().max(10).allow('', null)
  }).optional(),
  profileImageURL: Joi.string().uri().allow('', null)
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  type: Joi.array().items(Joi.string().valid('customer', 'vendor')).min(1),
  email: Joi.string().email().allow('', null),
  mobile: Joi.string().max(20).allow('', null),
  address: Joi.object({
    city: Joi.string().max(100).allow('', null),
    state: Joi.string().max(100).allow('', null),
    pincode: Joi.string().max(10).allow('', null)
  }).optional(),
  profileImageURL: Joi.string().uri().allow('', null)
});

// Product validation schemas
const productCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid('goods', 'service').required(),
  salesPrice: Joi.number().positive().precision(2).required(),
  purchasePrice: Joi.number().positive().precision(2).required(),
  hsnCode: Joi.string().max(50).allow('', null),
  category: Joi.string().max(255).allow('', null),
  saleTaxId: Joi.string().allow(null),
  purchaseTaxId: Joi.string().allow(null)
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  type: Joi.string().valid('goods', 'service'),
  salesPrice: Joi.number().positive().precision(2),
  purchasePrice: Joi.number().positive().precision(2),
  hsnCode: Joi.string().max(50).allow('', null),
  category: Joi.string().max(255).allow('', null),
  saleTaxId: Joi.string().allow(null),
  purchaseTaxId: Joi.string().allow(null)
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
  computation_method: Joi.string().valid('percentage', 'fixed').required(),
  rate: Joi.number().min(0).precision(2).required(),
  applicable_on: Joi.string().valid('sales', 'purchase', 'both').required()
});

const taxUpdateSchema = Joi.object({
  tax_name: Joi.string().min(1).max(100),
  computation_method: Joi.string().valid('percentage', 'fixed'),
  rate: Joi.number().min(0).precision(2),
  applicable_on: Joi.string().valid('sales', 'purchase', 'both')
});

// Chart of Accounts validation schemas
const chartOfAccountCreateSchema = Joi.object({
  account_name: Joi.string().min(1).max(255).required(),
  account_type: Joi.string().valid('asset', 'liability', 'income', 'expense', 'equity').required(),
  description: Joi.string().max(500).optional()
});

const chartOfAccountUpdateSchema = Joi.object({
  account_name: Joi.string().min(1).max(255),
  account_type: Joi.string().valid('asset', 'liability', 'income', 'expense', 'equity'),
  description: Joi.string().max(500).optional()
});

// Product Category validation schemas
const productCategoryCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required()
});

const productCategoryUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255)
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


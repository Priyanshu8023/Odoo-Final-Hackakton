const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'invoicing_user').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Customer validation schemas
const customerSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  contact_email: Joi.string().email().optional().allow(''),
  address: Joi.string().optional().allow('')
});

const customerUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  contact_email: Joi.string().email().optional().allow(''),
  address: Joi.string().optional().allow('')
});

// Product validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().optional().allow(''),
  price: Joi.number().positive().precision(2).required()
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().optional().allow(''),
  price: Joi.number().positive().precision(2).optional()
});

// Invoice validation schemas
const invoiceItemSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
  unit_price: Joi.number().positive().precision(2).required()
});

const invoiceSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  issue_date: Joi.date().required(),
  due_date: Joi.date().min(Joi.ref('issue_date')).required(),
  status: Joi.string().valid('draft', 'sent', 'paid').optional(),
  items: Joi.array().items(invoiceItemSchema).min(1).required()
});

const invoiceUpdateSchema = Joi.object({
  customer_id: Joi.number().integer().positive().optional(),
  issue_date: Joi.date().optional(),
  due_date: Joi.date().optional(),
  status: Joi.string().valid('draft', 'sent', 'paid').optional()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  customerSchema,
  customerUpdateSchema,
  productSchema,
  productUpdateSchema,
  invoiceSchema,
  invoiceUpdateSchema
};

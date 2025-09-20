const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'invoicing_user').default('invoicing_user')
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Customer validation schemas
const customerCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  contact_email: Joi.string().email().allow('', null),
  address: Joi.string().allow('', null)
});

const customerUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  contact_email: Joi.string().email().allow('', null),
  address: Joi.string().allow('', null)
});

// Product validation schemas
const productCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().precision(2).required()
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().precision(2)
});

// Invoice validation schemas
const invoiceCreateSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  issue_date: Joi.date().required(),
  due_date: Joi.date().min(Joi.ref('issue_date')).required(),
  status: Joi.string().valid('draft', 'sent', 'paid').default('draft'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      unit_price: Joi.number().positive().precision(2).required()
    })
  ).min(1).required()
});

const invoiceUpdateSchema = Joi.object({
  customer_id: Joi.number().integer().positive(),
  issue_date: Joi.date(),
  due_date: Joi.date().min(Joi.ref('issue_date')),
  status: Joi.string().valid('draft', 'sent', 'paid'),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      unit_price: Joi.number().positive().precision(2).required()
    })
  ).min(1)
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
  customerCreateSchema,
  customerUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
  invoiceCreateSchema,
  invoiceUpdateSchema,
  validate
};



const { authenticateToken } = require('./auth');

// Middleware to check if user has admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Middleware to check if user has admin or invoicing_user role
const requireInvoicingUser = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'invoicing_user') {
    return res.status(403).json({
      success: false,
      message: 'Invoicing user access required'
    });
  }
  next();
};

// Combined middleware for admin-only endpoints
const adminOnly = [authenticateToken, requireAdmin];

// Combined middleware for invoicing user and admin endpoints
const invoicingUserOrAdmin = [authenticateToken, requireInvoicingUser];

module.exports = {
  requireAdmin,
  requireInvoicingUser,
  adminOnly,
  invoicingUserOrAdmin
};

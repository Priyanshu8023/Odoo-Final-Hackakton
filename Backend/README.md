# Comprehensive Accounting Backend API

A complete backend API for a comprehensive accounting and invoicing application built with Node.js, Express.js, and MongoDB. This system implements double-entry bookkeeping, inventory management, and advanced business logic.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Roles**: Admin, Invoicing User, and Contact with different permissions
- **Master Data Management**: Contacts (Customers/Vendors), Products, Taxes, Categories, Chart of Accounts
- **Transaction Management**: Sales Orders, Purchase Orders, Customer Invoices, Vendor Bills
- **Double-Entry Bookkeeping**: Journal entries and ledger postings
- **Inventory Management**: Stock movements and tracking
- **Tax Management**: Flexible tax computation (Percentage/Fixed) for sales and purchases
- **Reporting**: Comprehensive sales summaries, financial reports, and analytics
- **Security**: Helmet, CORS, rate limiting, input validation

## User Roles & Permissions

### Admin (Business Owner)
- ✅ Full access to all master data (Contacts, Products, Taxes, Categories, Chart of Accounts)
- ✅ Create, Read, Update, Delete all transactions (Invoices, Bills, Orders)
- ✅ Manage user accounts and roles
- ✅ View all reports and analytics
- ✅ Configure system settings

### Invoicing User (Accountant)
- ✅ Create, Read Contacts (Customers/Vendors)
- ✅ Create, Read Products
- ✅ Create, Read, Update, Delete Invoices and Bills
- ✅ View all reports and analytics
- ❌ Cannot modify master data or user accounts

### Contact (Customer/Vendor)
- ✅ View own invoices and bills
- ✅ Limited access to own account information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Contacts (Customers/Vendors)
- `POST /api/customers` - Create contact (Admin, Invoicing User)
- `GET /api/customers` - Get all customers (Admin, Invoicing User)
- `GET /api/customers/:id` - Get contact by ID (Admin, Invoicing User)
- `PUT /api/customers/:id` - Update contact (Admin only)
- `DELETE /api/customers/:id` - Delete contact (Admin only)

### Products
- `POST /api/products` - Create product (Admin, Invoicing User)
- `GET /api/products` - Get all products (Admin, Invoicing User)
- `GET /api/products/:id` - Get product by ID (Admin, Invoicing User)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Invoices
- `POST /api/invoices` - Create invoice (Admin, Invoicing User)
- `GET /api/invoices` - Get all invoices (Admin, Invoicing User)
- `GET /api/invoices/:id` - Get invoice by ID (Admin, Invoicing User)
- `PUT /api/invoices/:id` - Update invoice (Admin, Invoicing User)
- `PATCH /api/invoices/:id/status` - Update invoice status (Admin, Invoicing User)
- `DELETE /api/invoices/:id` - Delete invoice (Admin, Invoicing User)
- `GET /api/invoices/customer/:customer_id` - Get invoices by customer (Admin, Invoicing User)

### Taxes
- `POST /api/taxes` - Create tax (Admin only)
- `GET /api/taxes` - Get all taxes (Admin, Invoicing User)
- `GET /api/taxes/:id` - Get tax by ID (Admin, Invoicing User)
- `PUT /api/taxes/:id` - Update tax (Admin only)
- `DELETE /api/taxes/:id` - Delete tax (Admin only)
- `GET /api/taxes/sales/list` - Get sales taxes (Admin, Invoicing User)
- `GET /api/taxes/purchase/list` - Get purchase taxes (Admin, Invoicing User)

### Product Categories
- `POST /api/product-categories` - Create category (Admin only)
- `GET /api/product-categories` - Get all categories (Admin, Invoicing User)
- `GET /api/product-categories/:id` - Get category by ID (Admin, Invoicing User)
- `PUT /api/product-categories/:id` - Update category (Admin only)
- `DELETE /api/product-categories/:id` - Delete category (Admin only)
- `GET /api/product-categories/with-count` - Get categories with product count (Admin, Invoicing User)

### Reports
- `GET /api/reports/sales-summary` - Get sales summary (Admin, Invoicing User)
- `GET /api/reports/invoice-status` - Get invoice status report (Admin, Invoicing User)
- `GET /api/reports/customers` - Get customer report (Admin, Invoicing User)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   Update the `.env` file with your database credentials and JWT secret.

3. **Set up MongoDB database**:
   - Install and start MongoDB on your system
   - Update the database connection details in `.env`

4. **Run database migration**:
   ```bash
   npm run migrate
   ```

5. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Schema

The application uses MongoDB with Mongoose ODM for data modeling. The schema includes the following main collections:

### Master Data Collections
- `users` - User accounts with roles and contact links
- `contacts` - Customers and vendors (unified contact management)
- `products` - Products and services with tax and category links
- `taxes` - Tax rates and computation methods
- `productcategories` - Product categorization
- `chartofaccounts` - Financial accounts for double-entry bookkeeping

### Transaction Collections
- `customerinvoices` - Customer invoices with line items
- `vendorbills` - Vendor bills with line items
- `salesorders` - Sales orders (optional workflow)
- `purchaseorders` - Purchase orders (optional workflow)

### System Collections
- `journalentries` - Double-entry bookkeeping headers
- `ledgerpostings` - Debit/credit postings for each transaction
- `payments` - Payment records linked to invoices/bills
- `inventorymovements` - Inventory tracking and movements

## Default Admin User

After running the migration, a default admin user is created:
- **Email**: admin@invoicing.com
- **Password**: admin123

## API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... } // Optional, only for successful responses
}
```

## Error Handling

The API includes comprehensive error handling:
- Input validation using Joi
- Authentication and authorization checks
- Database error handling
- Global error handler

## Security Features

- JWT-based authentication
- Role-based authorization
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Development

- **Port**: 3000 (configurable via PORT env variable)
- **Health Check**: `GET /health`
- **Logs**: Stored in `logs/` directory
- **Environment**: Set NODE_ENV=development for debug logs


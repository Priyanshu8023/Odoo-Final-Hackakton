# Invoicing Backend API

A complete backend API for a simple invoicing application built with Node.js, Express.js, and PostgreSQL.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Roles**: Admin and Invoicing User with different permissions
- **Master Data Management**: Customers and Products with CRUD operations
- **Invoice Management**: Complete invoice lifecycle with line items
- **Reporting**: Sales summaries and analytics
- **Security**: Helmet, CORS, rate limiting, input validation

## User Roles & Permissions

### Admin (Business Owner)
- ✅ Create, Read, Update, Archive/Delete Customers
- ✅ Create, Read, Update, Archive/Delete Products  
- ✅ Create, Read, Update, Delete Invoices
- ✅ View All Reports

### Invoicing User (Accountant)
- ✅ Create, Read Customers
- ✅ Create, Read Products
- ✅ Create, Read, Update, Delete Invoices
- ✅ View All Reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Customers
- `POST /api/customers` - Create customer (Admin, Invoicing User)
- `GET /api/customers` - Get all customers (Admin, Invoicing User)
- `GET /api/customers/:id` - Get customer by ID (Admin, Invoicing User)
- `PUT /api/customers/:id` - Update customer (Admin only)
- `PATCH /api/customers/:id/archive` - Archive customer (Admin only)
- `PATCH /api/customers/:id/unarchive` - Unarchive customer (Admin only)

### Products
- `POST /api/products` - Create product (Admin, Invoicing User)
- `GET /api/products` - Get all products (Admin, Invoicing User)
- `GET /api/products/:id` - Get product by ID (Admin, Invoicing User)
- `PUT /api/products/:id` - Update product (Admin only)
- `PATCH /api/products/:id/archive` - Archive product (Admin only)
- `PATCH /api/products/:id/unarchive` - Unarchive product (Admin only)

### Invoices
- `POST /api/invoices` - Create invoice (Admin, Invoicing User)
- `GET /api/invoices` - Get all invoices (Admin, Invoicing User)
- `GET /api/invoices/:id` - Get invoice by ID (Admin, Invoicing User)
- `PUT /api/invoices/:id` - Update invoice (Admin, Invoicing User)
- `PATCH /api/invoices/:id/status` - Update invoice status (Admin, Invoicing User)
- `DELETE /api/invoices/:id` - Delete invoice (Admin, Invoicing User)
- `GET /api/invoices/customer/:customer_id` - Get invoices by customer (Admin, Invoicing User)

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

3. **Set up PostgreSQL database**:
   - Create a PostgreSQL database
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

The application uses the following main tables:
- `users` - User accounts with roles
- `customers` - Customer master data
- `products` - Product master data
- `invoices` - Invoice transactions
- `invoice_items` - Invoice line items

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


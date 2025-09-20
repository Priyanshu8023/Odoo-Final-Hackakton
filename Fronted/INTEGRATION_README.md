# Frontend-Backend Integration

This document explains how the frontend has been integrated with the backend API.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `Backend` directory
2. Install dependencies: `npm install`
3. Set up environment variables (copy `env.example` to `.env`)
4. Start the backend server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `Fronted` directory
2. Install dependencies: `npm install`
3. Set up environment variables (copy `env.example` to `.env`)
4. Start the frontend development server: `npm run dev`

## Integration Features

### Authentication
- **Login/Register**: Users can create accounts and log in using email/password
- **JWT Tokens**: Authentication tokens are stored in localStorage
- **Protected Routes**: All main pages require authentication
- **Role-based Access**: Different user roles (Admin, Invoicing User, Contact)

### API Integration
- **API Client**: Centralized API service (`src/lib/api.ts`)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading indicators for better UX
- **Toast Notifications**: Success/error feedback using toast notifications

### Data Management
- **Contacts**: Full CRUD operations for customer/vendor management
- **Products**: Product catalog with pricing and tax information
- **Taxes**: Tax rate management
- **Chart of Accounts**: Financial account management

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Contacts
- `GET /api/customers` - Get all contacts
- `POST /api/customers` - Create new contact
- `PUT /api/customers/:id` - Update contact
- `DELETE /api/customers/:id` - Delete contact

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Taxes
- `GET /api/taxes` - Get all tax rates
- `POST /api/taxes` - Create new tax rate

### Chart of Accounts
- `GET /api/chart-of-accounts` - Get all accounts
- `POST /api/chart-of-accounts` - Create new account

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accounting_system
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Testing the Integration

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173` (or your frontend port)
3. Register a new account or use the default admin credentials:
   - Email: `admin@invoicing.com`
   - Password: `admin123`
4. Test the various features:
   - Create contacts
   - Add products
   - Set up tax rates
   - Manage chart of accounts

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure the backend is running and CORS is properly configured
2. **Authentication Issues**: Check if JWT tokens are being stored correctly
3. **API Connection**: Verify the `REACT_APP_API_URL` environment variable
4. **Database Connection**: Ensure MongoDB is running and accessible

### Debug Tips
- Check browser console for errors
- Use browser dev tools to inspect network requests
- Verify backend logs for API call details
- Check if all required environment variables are set

# Accounting System - Full Stack Application

A comprehensive accounting and invoicing application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### One-Command Setup & Run
```bash
# Complete setup and start both servers
npm run setup-and-run
```

### Manual Setup
```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd Backend
npm install

# 3. Install frontend dependencies
cd ../Fronted
npm install

# 4. Setup environment files
cd ..
npm run setup:env

# 5. Start MongoDB service
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# 6. Run database migration
cd Backend
npm run migrate

# 7. Start both servers
cd ..
npm run dev
```

## 📁 Project Structure

```
accounting-system/
├── Backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── database/        # Schema & migrations
│   │   └── utils/           # Helper functions
│   ├── package.json
│   └── .env                 # Backend environment
├── Fronted/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/             # API client & utilities
│   │   └── hooks/           # Custom hooks
│   ├── package.json
│   └── .env                 # Frontend environment
├── scripts/                 # Setup scripts
├── package.json             # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run setup` - Install all dependencies and setup environment
- `npm run setup-and-run` - Complete setup and start both servers
- `npm run test:mongodb` - Test MongoDB connection
- `npm run install:all` - Install dependencies for all projects
- `npm run build` - Build both frontend and backend
- `npm run start` - Start production servers

### Backend Only
```bash
cd Backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run migrate      # Run database migrations
```

### Frontend Only
```bash
cd Fronted
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Health Check**: http://localhost:3000/api/health

## 🔐 Default Login Credentials

- **Email**: admin@invoicing.com
- **Password**: admin123
- **Role**: Admin

## 🗄️ Database Schema

The application uses a comprehensive MongoDB schema with:

### Master Data Collections
- `organizations` - Business entities
- `users` - System users and authentication
- `contacts` - Customers and vendors
- `products` - Product catalog
- `taxes` - Tax rates and rules
- `chartOfAccounts` - Financial accounts

### Transaction Collections
- `invoices` - Customer invoices
- `vendorBills` - Vendor bills
- `payments` - Payment records

### System Collections
- `journalEntries` - Double-entry accounting
- `inventoryMovements` - Inventory tracking

## 🎯 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Invoicing User, Contact)
- Protected routes
- User registration and login

### Master Data Management
- **Contacts**: Customer and vendor management
- **Products**: Product catalog with pricing
- **Taxes**: Tax rate configuration
- **Chart of Accounts**: Financial account structure

### Transaction Management
- Customer invoice creation and management
- Vendor bill processing
- Payment tracking
- Double-entry accounting

### User Interface
- Modern React with TypeScript
- Responsive design with Tailwind CSS
- Component library with shadcn/ui
- Real-time data updates
- Form validation and error handling

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/Shiv_account
DB_HOST=localhost
DB_PORT=27017
DB_NAME=Shiv_account
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check MongoDB connection string in `.env`
   - Verify MongoDB service is started

2. **Port Already in Use**
   - Backend (3000): Change `PORT` in Backend/.env
   - Frontend (5173): Vite will automatically use next available port

3. **CORS Errors**
   - Ensure backend is running on port 3000
   - Check `CORS_ORIGIN` in Backend/.env matches frontend URL

4. **Module Not Found Errors**
   - Run `npm run install:all` to install all dependencies
   - Clear node_modules and reinstall if needed

### Development Tips

- Use browser dev tools to inspect API calls
- Check backend logs for detailed error information
- Use MongoDB client to verify data persistence
- Test API endpoints with tools like Postman or curl

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Master Data Endpoints
- `GET /api/customers` - Get all contacts
- `POST /api/customers` - Create contact
- `PUT /api/customers/:id` - Update contact
- `DELETE /api/customers/:id` - Delete contact

- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

- `GET /api/taxes` - Get all tax rates
- `POST /api/taxes` - Create tax rate

- `GET /api/chart-of-accounts` - Get all accounts
- `POST /api/chart-of-accounts` - Create account

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Create an issue in the repository

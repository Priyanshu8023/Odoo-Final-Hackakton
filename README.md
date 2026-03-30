# Accounting & Invoicing System

# Demo Video
https://drive.google.com/drive/folders/1K_IhJbgcrs9WAT5Q8N0wEBg2RpVxEhz2?usp=sharing

## 🚀 Overview
The Accounting & Invoicing System is a comprehensive full-stack web application designed to simplify financial management and billing processes for small to medium-sized businesses. It streamlines the creation of professional invoices, tracks payments, and provides real-time financial insights. By automating manual accounting tasks, this platform helps business owners save time, reduce human errors, and get paid faster.

### Problem it solves
Traditional invoicing and accounting methods are often manual, prone to error, and disconnected from modern payment gateways. This project bridges that gap by offering an integrated solution where invoices can be securely generated, distributed, and paid online seamlessly.

### Use cases
- **Freelancers & Agencies:** Create and send customized invoices to clients and effortlessly track payment statuses.
- **Small Businesses:** Manage customer data, view financial dashboards, and handle basic day-to-day accounting.
- **E-commerce & Service Providers:** Integrate natively with payment gateways to receive secure, trackable transactions.

## 🧠 Features
- **Secure Authentication:** User registration and secured login flow using JWT and bcrypt password hashing.
- **Dynamic Invoice Generation:** Create customized, professional PDF invoices on the fly using Puppeteer and PDFKit.
- **Payment Integration:** Seamless, real-time payment processing heavily integrated with Razorpay.
- **Financial Dashboard:** Intuitive and interactive charts representing cash flow and revenue metrics.
- **Customer Management:** Keep track of client profiles and their transaction histories in one place.
- **Responsive & Accessible UI:** A modern, mobile-friendly interface built with Radix UI, Shadcn, and Tailwind CSS.
- **Robust Security:** Integrated Helmet and Express rate limiting to prevent abuse and ensure API security.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React 18 (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI, Shadcn UI Components
- **State Management & Data Fetching:** TanStack React Query
- **Routing:** React Router DOM
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualization:** Recharts

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Validation:** Joi
- **Document Generation:** PDFKit, Puppeteer
- **File Handling:** Multer

### DevOps & External Services
- **Payment Gateway:** Razorpay
- **Process Management:** Concurrently, Nodemon
- **Linting & Formatting:** ESLint

## 📂 Project Structure
```text
📦 Odoo-Final-Hackakton
 ┣ 📂 Backend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers    # Business logic for API endpoints
 ┃ ┃ ┣ 📂 database       # Database seeding and migration scripts
 ┃ ┃ ┣ 📂 middlewares    # Auth, validation, and error handling
 ┃ ┃ ┣ 📂 models         # Mongoose schemas (User, Invoice, etc.)
 ┃ ┃ ┣ 📂 routes         # Express REST API route definitions
 ┃ ┃ ┣ 📂 utils          # Helper functions (exporting, PDF generation)
 ┃ ┃ ┗ 📜 server.js      # Main backend entry point
 ┃ ┗ 📜 package.json
 ┣ 📂 Fronted
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components     # Reusable UI components (Shadcn, Radix)
 ┃ ┃ ┣ 📂 pages          # Main application screens and views
 ┃ ┃ ┣ 📂 hooks          # Custom reusable React hooks
 ┃ ┃ ┣ 📂 lib            # API clients, utilities, and helpers
 ┃ ┃ ┣ 📜 App.tsx        # Main application root component
 ┃ ┃ ┗ 📜 main.tsx       # React DOM rendering entry
 ┃ ┣ 📜 tailwind.config.ts
 ┃ ┣ 📜 vite.config.ts
 ┃ ┗ 📜 package.json
 ┣ 📂 scripts            # Utility setup, env validation, and execution scripts
 ┗ 📜 package.json       # Root orchestrator for concurrent execution
```

## 🧩 System Architecture
The application follows a decoupled Client-Server architecture. 
1. The **Frontend (React)** handles user interaction, form validation (using Zod), and local state management. It communicates asynchronously with the backend via RESTful APIs, with TanStack React Query managing server state, caching, and loading/error handling.
2. The **Backend (Express)** serves as the central API gateway. It validates incoming payloads using Joi, authenticates requests via JWT, processes core business logic, and generates documents.
3. The **Database (MongoDB)** stores sensitive records such as user profiles, invoice data, and transaction logs.
4. An **External Gateway (Razorpay)** handles secure, PCI-compliant payment initiations and verifications.

## 🖼️ Architecture Diagram

```mermaid
flowchart TB
    classDef user fill:#2d3748,stroke:#cbd5e0,stroke-width:2px,color:#fff,rx:20px,ry:20px
    classDef react fill:#61dafb,stroke:#005fcc,stroke-width:2px,color:#000,rx:5px,ry:5px
    classDef node fill:#68a063,stroke:#3b7337,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef db fill:#47A248,stroke:#2d692e,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef gateway fill:#003B73,stroke:#1e40af,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef container fill:#f7fafc,stroke:#e2e8f0,stroke-width:2px,stroke-dasharray: 5 5,rx:10px,ry:10px

    User((👤 Client / User)):::user

    subgraph Frontend [🌍 Frontend Application - Vite]
        direction TB
        UI[🧩 UI Components & Views\n(React, Radix, Tailwind)]:::react
        State[⚡ State Management\n(TanStack React Query)]:::react
        Router[🔀 Routing & Forms\n(React Router, Zod)]:::react
        
        UI <--> State
        UI <--> Router
    end
    class Frontend container

    subgraph Backend [⚙️ Backend Server - Express.js]
        direction TB
        Gateway[🚪 API Gateway / Router]:::node
        Auth[🛡️ Auth & Security\n(JWT, Helmet, bcrypt)]:::node
        Logic[🧠 Business Controllers\n(Invoices, Users)]:::node
        Services[📄 Document Generation\n(PDFKit, Puppeteer)]:::node
        
        Gateway --> Auth
        Auth --> Logic
        Logic --> Services
    end
    class Backend container

    Database[(💾 MongoDB Data Store)]:::db
    PaymentGateway{{💳 Razorpay Service}}:::gateway

    %% Relationships
    User <==>|HTTPS| UI
    State <==>|REST API Calls| Gateway
    Router -.-> State
    Logic <==>|Mongoose Object Models| Database
    Logic <==>|Secure API Keys| PaymentGateway
```

## 📡 API Endpoints (Assumed Core Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Register a new user account |
| **POST** | `/api/auth/login` | Authenticate user credentials and return a JWT |
| **GET**  | `/api/invoices` | Retrieve a list of invoices for the authenticated user |
| **POST** | `/api/invoices` | Create a new invoice record |
| **GET**  | `/api/invoices/:id/pdf` | Generate and retrieve a PDF version of a specific invoice |
| **POST** | `/api/payments/create-order` | Initialize a new Razorpay payment order |
| **POST** | `/api/payments/verify` | Verify the signature of a successful Razorpay transaction |

> *Note: Endpoints dealing with invoices and payments are strictly protected and require a valid `Bearer` token in the Authorization header.*

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster URI)
- A [Razorpay](https://razorpay.com/) Developer Account for API keys

### Step-by-Step Guide

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Odoo-Final-Hackakton
   ```

2. **Install all dependencies**
   The project is configured to install root, backend, and frontend dependencies easily:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `Backend` directory and optionally in the `Fronted` directory. Populate them using the template below.

4. **Run the Initialization Scripts**
   Validate your environment and start the application. The root package configuration simplifies this:
   ```bash
   npm run setup-and-run
   # OR run manually via concurrently:
   npm run dev
   ```
   - The frontend development server will typically be accessible at `http://localhost:5173`
   - The backend API will typically run on `http://localhost:5000`

## 🔐 Environment Variables

Ensure the following environment variables are properly configured in your `Backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/accounting_db

# Authentication Keys
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

# Razorpay Integration Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

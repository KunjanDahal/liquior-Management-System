# RMH POS System - User Guide

## Overview

A complete, enterprise-level Point of Sale (POS) system built with React, TypeScript, Node.js, and designed to work with the RMH SQL Server database. The system is fully functional with mock data when the database is not available.

## Features

### ✅ Implemented Features

#### Authentication
- **Secure Login**: JWT-based authentication with role-based access
- **Default Credentials**:
  - Username: `admin` / Password: `admin123` (Admin)
  - Username: `cashier` / Password: `cashier123` (Cashier)
  - Username: `manager` / Password: `manager123` (Manager)

#### Point of Sale
- **Professional 2-Column Layout**: Product search (60%) and shopping cart (40%)
- **Product Search**:
  - Real-time search by name, SKU, or barcode
  - Category filtering (8 categories: Electronics, Clothing, Food & Beverage, etc.)
  - Stock level indicators (In Stock, Low Stock, Out of Stock)
  - 40+ sample products with realistic data
  - Color-coded stock status badges
  
- **Shopping Cart**:
  - Add/remove items
  - Quantity adjustment with +/- buttons
  - Real-time price calculations
  - Subtotal, tax (8%), and total display
  - Clear cart functionality
  - Line-by-line price display

- **Customer Management**:
  - Optional customer selection
  - Guest (walk-in) transactions
  - Customer search by name, phone, or email
  - 15+ sample customers
  - Display customer account info and credit limits

- **Payment Processing**:
  - Multiple tender types (Cash, Credit Card, Debit Card, Gift Card, Check, Store Credit)
  - Split payment support
  - Quick amount buttons for cash payments
  - Change calculation
  - Real-time balance tracking
  - Transaction receipt generation

- **Barcode Scanner Support**:
  - Detects rapid keyboard input (barcode scanners)
  - Auto-adds products to cart
  - Visual feedback via notifications

- **Keyboard Shortcuts**:
  - `F2`: New Transaction (Clear Cart)
  - `F3`: Customer Search
  - `F8`: Checkout
  - `Enter`: Confirm actions
  - `Esc`: Cancel/Close modals

- **Notifications**:
  - Success, error, warning, and info toasts
  - Auto-dismissing with smooth animations
  - Product add/remove feedback
  - Transaction completion alerts

#### Backend API
- **Authentication Endpoints**: `/api/auth/login`
- **POS Endpoints**:
  - `GET /api/pos/items` - Search products
  - `GET /api/pos/items/:id` - Get product by ID
  - `GET /api/pos/items/barcode/:code` - Get product by barcode
  - `GET /api/pos/customers` - Search customers
  - `GET /api/pos/tenders` - Get payment methods
  - `POST /api/pos/transactions` - Create transaction
  - `GET /api/pos/transactions/:id` - Get transaction details

#### Database Integration
- **Mock Data Layer**: Comprehensive mock data matching RMH database schema
- **Database-Ready**: All structures match the 121-table RMH database
- **Seamless Switch**: Can connect to real SQL Server when available
- **Schema Documentation**: Detailed mapping of all tables

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) SQL Server 2019+ with RMH database

### Installation

1. **Install Backend Dependencies**:
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**:
```bash
cd frontend
npm install
```

3. **Configure Environment** (Optional - for database):
```bash
cd backend
cp .env.example .env
# Edit .env with your SQL Server credentials
```

### Running the Application

1. **Start Backend Server**:
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

2. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

3. **Start Electron Desktop App** (optional):
```bash
cd frontend
npm run electron:dev
```

### First Login
1. Navigate to `http://localhost:5173`
2. Login with: `admin` / `admin123`
3. You'll be redirected to the POS screen automatically

## Using the POS System

### Processing a Sale

1. **Search for Products**:
   - Type in the search bar or click category tabs
   - Click on a product to add it to cart
   - Or use barcode scanner

2. **Manage Cart**:
   - Adjust quantities with +/- buttons
   - Remove items with trash icon
   - View running totals

3. **Select Customer** (Optional):
   - Click "Select Customer" button
   - Search by name, phone, or email
   - Or choose "Guest" for walk-in

4. **Checkout**:
   - Click "Checkout" button (or press F8)
   - Select payment method
   - Enter amount (use quick buttons for cash)
   - Click "Apply" to add payment
   - Add multiple payments for split transactions
   - Click "Complete Sale" when fully paid

5. **Receipt**:
   - Transaction number displayed
   - Cart automatically clears
   - Ready for next customer

### Keyboard Shortcuts

- **F2**: Start new transaction (clears cart with confirmation)
- **F3**: Open customer search
- **F4**: Focus product search (auto-focus on load)
- **F8**: Open checkout/payment modal
- **Esc**: Close modals
- **Enter**: Confirm actions
- **Barcode Scanner**: Automatically detects and adds products

### Stock Management

Products display real-time stock levels:
- **Green Badge** (In Stock): More than reorder point
- **Yellow Badge** (Low Stock): At or below reorder point
- **Red Badge** (Out of Stock): Zero quantity

Stock automatically decreases when transactions complete.

## Database Schema

### Key Tables Used

| Table | Purpose | Fields |
|-------|---------|--------|
| `Cashier` | User authentication | CashierID, Login, Password, FirstName, LastName |
| `Item` | Products/Inventory | ItemID, ItemLookupCode, Description, Price, Quantity, Taxable |
| `ItemClass` | Product categories | ItemClassID, ClassName |
| `Customer` | Customer information | CustomerID, Name, Phone, Email, CreditLimit |
| `Tender` | Payment methods | TenderID, Description, TenderType, AllowOverTender |
| `Tax` | Tax rates | TaxID, TaxPercentage |
| `Transaction` | Sales transactions | TransactionID, Total, Subtotal, Tax, CustomerID |
| `TransactionEntry` | Line items | TransactionEntryID, ItemID, Quantity, Price |
| `TenderEntry` | Payments applied | TenderEntryID, TenderID, Amount |

### Mock Data Summary

- **40+ Products** across 8 categories
- **15+ Customers** with realistic data
- **6 Payment Methods** (Cash, Credit, Debit, Gift Card, Check, Store Credit)
- **3 Tax Rates** (Sales Tax 8%, Food Tax 2%, Alcohol Tax 10%)
- **2 Stores** with 4 registers

## Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **Axios** for API calls
- **React Router** for navigation
- **Lucide React** for icons

### Backend Stack
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **bcryptjs** for password hashing
- **mssql** for SQL Server connection
- **Winston** for logging

### Project Structure

```
rmh-pos-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, environment config
│   │   ├── controllers/    # Request handlers
│   │   ├── data/           # Mock database
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # TypeScript types
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── stores/         # Zustand stores
│   ├── electron/           # Electron main process
│   └── package.json
└── database/               # SQL scripts and docs
```

## API Documentation

### Authentication

#### POST `/api/auth/login`
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "cashierID": 1,
    "username": "admin",
    "firstName": "John",
    "lastName": "Admin"
  }
}
```

### POS Operations

All POS endpoints require authentication (JWT token in Authorization header).

#### GET `/api/pos/items`
Search products with optional filters.

**Query Parameters:**
- `q` (string): Search query
- `category` (number): Category ID
- `limit` (number): Max results (default: 50)

#### POST `/api/pos/transactions`
Create a new transaction.

**Request:**
```json
{
  "storeID": 1,
  "registerID": "POS1",
  "cashierID": 1,
  "customerID": 5,
  "items": [
    {
      "itemID": 1,
      "quantity": 2,
      "price": 79.99
    }
  ],
  "tenders": [
    {
      "tenderID": 1,
      "amount": 175.18
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "transactionID": 1,
  "transactionNumber": 1,
  "receiptNumber": "1-20241224-1",
  "total": 172.78,
  "subtotal": 159.98,
  "tax": 12.80,
  "timestamp": "2024-12-24T10:30:00Z"
}
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js version (18+)
- Run `npm install` in backend folder

### Frontend won't start
- Check if port 5173 is available
- Verify Node.js version (18+)
- Run `npm install` in frontend folder
- Clear cache: `rm -rf node_modules .vite && npm install`

### Login fails
- Ensure backend is running
- Check backend console for errors
- Verify API URL in frontend (.env or default)
- Try default credentials: `admin` / `admin123`

### Products not loading
- Check browser console for errors
- Verify JWT token is being sent
- Check backend /api/pos/items endpoint
- Ensure mock data is loaded

### Database connection errors
- Database is optional - system works with mock data
- To use real database, configure .env properly
- See DATABASE_SETUP_GUIDE.md for SQL Server setup

## Future Enhancements

- [ ] Reports and analytics
- [ ] Return/refund processing
- [ ] Employee time tracking
- [ ] Inventory management screens
- [ ] Price override with authorization
- [ ] Discount and promotion support
- [ ] Receipt printing
- [ ] End-of-day reconciliation
- [ ] Multi-store support
- [ ] Real-time sync with database

## Support

For issues or questions:
1. Check this guide first
2. Review console logs (both backend and frontend)
3. Check DATABASE_SETUP_GUIDE.md for database issues
4. Review the plan file for implementation details

## License

Proprietary - RMH POS System


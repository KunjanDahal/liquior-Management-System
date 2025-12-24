# RMH POS System - Complete Retail Management Solution

A comprehensive Point of Sale and retail management system built with modern technologies.

## 🏗️ Architecture

```
rmh-pos-system/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React + Electron + TypeScript UI
├── database/         # SQL Server database scripts and backup
└── README.md         # This file
```

## 📦 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- SQL Server (mssql)
- JWT Authentication
- RESTful API

### Frontend
- React 18
- TypeScript
- Electron (Desktop App)
- React Query (Data Fetching)
- React Router (Navigation)
- Zustand (State Management)
- Tailwind CSS (Styling)
- Vite (Build Tool)

### Database
- Microsoft SQL Server 2016+
- 121 tables covering all retail operations
- Views for optimized queries
- Indexes for performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- SQL Server 2016+ (or SQL Server Express)
- npm or yarn

### 1. Database Setup

```bash
cd database
# Restore database using SQL Server Management Studio
# Or run: sqlcmd -S localhost\SQLEXPRESS -E -i restore-database.sql

# Create views and indexes
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-views.sql
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-indexes.sql
```

See `database/README.md` for detailed instructions.

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev

# Or run with Electron
npm run dev:electron
```

Frontend will run on `http://localhost:5173`

## 📋 Implementation Status

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Backend API setup (Node.js + Express + TypeScript)
- [x] Database restoration scripts and views
- [x] Frontend setup (React + Electron + React Query)
- [x] Authentication framework
- [x] API client with interceptors
- [x] Basic layout and navigation

### 🔄 Phase 2: Core POS Module (PENDING)
- [ ] Transaction backend services
- [ ] Product search and barcode scanning
- [ ] Shopping cart functionality
- [ ] Payment processing
- [ ] Receipt generation
- [ ] POS user interface

### 🔄 Phase 3-8: Additional Modules (PENDING)
- [ ] Inventory Management
- [ ] Purchase Orders
- [ ] Customer & AR Management
- [ ] Employee Management
- [ ] Reporting & Analytics
- [ ] Settings & Configuration

## 🗄️ Database Modules

The system includes 121 tables organized into:

1. **POS & Transactions** (15 tables)
   - Transaction processing
   - Receipt management
   - Tender/payment handling
   - Batch operations

2. **Inventory & Products** (20 tables)
   - Product catalog
   - Matrix items (size/color variants)
   - Kit/bundle management
   - Serial number tracking
   - Stock management

3. **Purchase Orders** (22 tables)
   - PO creation and approval
   - Receiving
   - Invoice matching
   - Supplier pricing

4. **Customers & AR** (18 tables)
   - Customer management
   - Loyalty programs
   - Accounts receivable
   - Payment terms
   - Aging reports

5. **Suppliers** (4 tables)
   - Supplier management
   - Contacts
   - Shipping information

6. **Employees & Time** (6 tables)
   - Cashier management
   - Time clock
   - Scheduling
   - Commission tracking

7. **Store & Configuration** (15 tables)
   - Multi-store support
   - Tax configuration
   - Register setup
   - Custom buttons/taskpads

8. **Additional Modules**
   - Shipping integration
   - Accounting
   - Reporting
   - System configuration

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server status

### Authentication (Coming Soon)
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Products (Coming Soon)
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

More endpoints will be added as modules are implemented.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend (Web)
```bash
cd frontend
npm run build
```

### Frontend (Electron)
```bash
cd frontend
npm run build:all
# Use electron-builder for packaging
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection

## 📚 Documentation

- `backend/README.md` - Backend API documentation
- `frontend/README.md` - Frontend application guide
- `database/README.md` - Database setup and maintenance

## 🤝 Contributing

This is a comprehensive retail POS system. Each phase builds upon the previous one.

Current focus: **Phase 2 - Core POS Module**

## 📝 License

MIT

## 🆘 Support

For issues or questions:
1. Check the README files in each subdirectory
2. Review the database exploration scripts
3. Check API endpoint documentation

---

**Status**: Phase 1 Complete ✅ | Phase 2 Ready to Start 🚀

**Last Updated**: December 24, 2025


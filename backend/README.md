# RMH POS Backend API

Backend API for Retail Management Hub Point of Sale System

## Tech Stack

- Node.js + Express
- TypeScript
- SQL Server (mssql)
- JWT Authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Ensure SQL Server is running and rmhsample database is restored

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Coming soon)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Products (Coming soon)
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions (Coming soon)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction
- `POST /api/transactions/:id/void` - Void transaction

More endpoints will be added as modules are implemented.


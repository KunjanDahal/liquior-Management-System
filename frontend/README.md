# RMH POS Frontend

Frontend application for Retail Management Hub Point of Sale System

## Tech Stack

- React 18
- TypeScript
- Vite
- Electron
- React Query (TanStack Query)
- React Router
- Zustand (State Management)
- Tailwind CSS
- Lucide React (Icons)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Run development server (web only):
```bash
npm run dev
```

4. Run with Electron:
```bash
npm run dev:electron
```

5. Build for production:
```bash
npm run build:all
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── stores/         # Zustand stores
├── types/          # TypeScript types
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Features

### Phase 1 (Complete)
- ✅ Project setup with Vite + React + TypeScript
- ✅ Electron integration
- ✅ React Query setup
- ✅ React Router setup
- ✅ Authentication context
- ✅ API client with interceptors
- ✅ Basic layout and navigation
- ✅ Login page
- ✅ Dashboard page

### Phase 2-8 (Pending)
- POS transaction interface
- Inventory management
- Purchase orders
- Customer management
- Accounts receivable
- Employee management
- Reporting
- Settings

## Development

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run dev:electron` - Start with Electron
- `npm run build` - Build React app
- `npm run build:electron` - Build Electron main process
- `npm run build:all` - Build everything
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Integration

The frontend is configured to connect to the backend API at `http://localhost:5000`.

All API calls go through the `apiClient` service which handles:
- Authentication tokens
- Request/response interceptors
- Error handling
- Request logging

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/layouts/MainLayout.tsx`

### Adding New API Endpoints

1. Create service file in `src/services/`
2. Use `apiClient` for HTTP requests
3. Create custom hooks in `src/hooks/` for React Query integration

## Building for Production

### Web Build
```bash
npm run build
```

### Electron Build
```bash
npm run build:all
# Then use electron-builder for packaging
```

## Notes

- Phase 1 (Foundation) is complete
- Backend API needs to be running for full functionality
- Database must be restored and connected
- Authentication is currently in demo mode


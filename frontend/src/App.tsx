import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { PointOfSale } from './pages/POS/PointOfSale';
import { InventoryDashboard } from './pages/Inventory/InventoryDashboard';
import { ProductList } from './pages/Inventory/ProductList';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Customers from './pages/Customers';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {isAuthenticated ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/pos" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pos" element={<PointOfSale />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="inventory/products" element={<ProductList />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;


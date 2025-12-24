import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Store,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/pos', icon: ShoppingCart, label: 'Point of Sale', color: 'text-green-500' },
    { path: '/inventory', icon: Package, label: 'Inventory', color: 'text-purple-500' },
    { path: '/customers', icon: Users, label: 'Customers', color: 'text-cyan-500' },
    { path: '/reports', icon: FileText, label: 'Reports', color: 'text-orange-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                RMH POS System
              </h1>
              <p className="text-xs text-gray-400">Enterprise Edition</p>
            </div>
          </div>
          
          {/* User Info Card */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${active 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : item.color}`} />
                <span className="flex-1 font-medium">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, customers, transactions..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


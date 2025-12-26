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
      {/* Modern Professional Sidebar */}
      <aside className="w-72 bg-[#1a1d29] text-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none"></div>
        
        {/* Brand Header */}
        <div className="relative p-6 border-b border-white/5">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#1a1d29]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white tracking-tight">
                RMH POS System
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Enterprise Edition</p>
            </div>
          </div>
          
          {/* User Info Card - Enhanced */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3.5 border border-white/5 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow-md">
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1d29]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2 mt-1">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-colors duration-200 group
                  ${active 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                
                <div className={`relative ${active ? 'text-white' : item.color}`}>
                  <IconComponent className="w-5 h-5 transition-all duration-200 group-hover:scale-105" strokeWidth={active ? 2.5 : 2} />
                </div>
                
                <span className={`flex-1 font-medium text-sm ${active ? 'text-white' : 'text-gray-300'}`}>
                  {item.label}
                </span>
                
                {active && (
                  <ChevronRight className="w-4 h-4 text-white/80 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions - Enhanced */}
        <div className="relative p-4 border-t border-white/5 space-y-2 bg-white/[0.02]">
          <button className="w-full flex items-center gap-3 px-3.5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors duration-200 group">
            <div className="relative">
              <Bell className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            </div>
            <span className="flex-1 font-medium text-left">Notifications</span>
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-red-500/30">
              3
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors duration-200 group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            <span className="flex-1 font-medium text-left">Logout</span>
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


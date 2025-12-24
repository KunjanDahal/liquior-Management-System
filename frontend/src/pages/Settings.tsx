import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Users,
  Bell,
  Shield,
  CreditCard,
  Printer,
  Database,
  Globe,
  Palette,
  Mail,
  Key,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';

type SettingsTab = 'general' | 'pos' | 'users' | 'notifications' | 'security' | 'payment' | 'printer' | 'database';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: SettingsIcon, color: 'indigo' },
    { id: 'pos' as SettingsTab, label: 'POS Settings', icon: Store, color: 'green' },
    { id: 'users' as SettingsTab, label: 'Users & Roles', icon: Users, color: 'purple' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell, color: 'yellow' },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield, color: 'red' },
    { id: 'payment' as SettingsTab, label: 'Payment Methods', icon: CreditCard, color: 'blue' },
    { id: 'printer' as SettingsTab, label: 'Printer Setup', icon: Printer, color: 'gray' },
    { id: 'database' as SettingsTab, label: 'Database', icon: Database, color: 'cyan' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-indigo-600" />
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input type="text" className="input" defaultValue="RMH Store" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store ID</label>
            <input type="text" className="input" defaultValue="STORE-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input type="email" className="input" defaultValue="store@rmh.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" className="input" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" className="input" defaultValue="123 Main Street, City, State 12345" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="input">
              <option>UTC-05:00 (Eastern Time)</option>
              <option>UTC-06:00 (Central Time)</option>
              <option>UTC-07:00 (Mountain Time)</option>
              <option>UTC-08:00 (Pacific Time)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="input">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>CAD (C$)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="input">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="input">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">Light</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">Dark</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">Auto</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPOSSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">POS Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
            <input type="number" className="input" defaultValue="8.0" step="0.1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Footer Text</label>
            <textarea className="input" rows={3} defaultValue="Thank you for shopping with us!" />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
              <span className="text-sm font-medium text-gray-700">Enable Barcode Scanner Support</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
              <span className="text-sm font-medium text-gray-700">Auto-print Receipts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
              <span className="text-sm font-medium text-gray-700">Require Customer Selection</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Enable Quick Cash Amounts</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-3">
          {[
            { key: 'F2', action: 'New Transaction' },
            { key: 'F3', action: 'Customer Search' },
            { key: 'F4', action: 'Product Search' },
            { key: 'F8', action: 'Checkout' },
            { key: 'F9', action: 'Cancel Transaction' },
          ].map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{shortcut.action}</span>
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-mono font-semibold">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">User Management</h3>
          <button className="btn btn-primary">
            <Users className="w-4 h-4" />
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Admin User', email: 'admin@rmh.com', role: 'Administrator', status: 'active', lastLogin: '2 hours ago' },
                { name: 'John Cashier', email: 'john@rmh.com', role: 'Cashier', status: 'active', lastLogin: '5 hours ago' },
                { name: 'Sarah Manager', email: 'sarah@rmh.com', role: 'Manager', status: 'active', lastLogin: '1 day ago' },
              ].map((user) => (
                <tr key={user.email}>
                  <td className="font-semibold">{user.name}</td>
                  <td className="text-gray-600">{user.email}</td>
                  <td>
                    <span className="badge badge-primary">{user.role}</span>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td className="text-gray-500">{user.lastLogin}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary mr-2">Edit</button>
                    <button className="btn btn-sm btn-danger">Disable</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Roles & Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: 'Administrator', permissions: ['All Access'], color: 'red' },
            { role: 'Manager', permissions: ['View Reports', 'Manage Inventory', 'Manage Users'], color: 'blue' },
            { role: 'Cashier', permissions: ['POS Access', 'View Products'], color: 'green' },
          ].map((role) => (
            <div key={role.role} className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-all">
              <h4 className="font-bold text-gray-900 mb-2">{role.role}</h4>
              <ul className="space-y-1">
                {role.permissions.map((perm) => (
                  <li key={perm} className="text-sm text-gray-600 flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-600" />
                    {perm}
                  </li>
                ))}
              </ul>
              <button className="btn btn-sm btn-secondary w-full mt-3">Edit Permissions</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Daily Sales Summary', description: 'Receive daily summary of sales and transactions' },
            { label: 'Low Stock Alerts', description: 'Get notified when products are running low' },
            { label: 'New Customer Registration', description: 'Alert when new customers register' },
            { label: 'System Updates', description: 'Notifications about system updates and maintenance' },
          ].map((item) => (
            <div key={item.label} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
            <input type="number" className="input" defaultValue="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Critical Stock Level</label>
            <input type="number" className="input" defaultValue="5" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-600" />
          Password & Authentication
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
                <span className="text-sm text-gray-700">Require minimum 8 characters</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
                <span className="text-sm text-gray-700">Require uppercase and lowercase letters</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
                <span className="text-sm text-gray-700">Require at least one number</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input type="number" className="input" defaultValue="30" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Security Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
            <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
            <span className="text-sm font-medium text-gray-700">Log All System Activities</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Require Manager Approval for Refunds</span>
          </label>
        </div>
      </div>

      <div className="card bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Security Alert</h4>
            <p className="text-sm text-red-700 mt-1">
              Last successful login: Today at 10:45 AM from 192.168.1.100
            </p>
            <button className="btn btn-sm btn-secondary mt-3">View Activity Log</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Accepted Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { method: 'Cash', icon: '💵', enabled: true },
            { method: 'Credit Card', icon: '💳', enabled: true },
            { method: 'Debit Card', icon: '💳', enabled: true },
            { method: 'Mobile Payment', icon: '📱', enabled: false },
            { method: 'Gift Card', icon: '🎁', enabled: true },
            { method: 'Store Credit', icon: '💰', enabled: false },
          ].map((payment) => (
            <div key={payment.method} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{payment.icon}</span>
                <span className="font-medium text-gray-900">{payment.method}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={payment.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Gateway</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Processor</label>
            <select className="input">
              <option>Stripe</option>
              <option>Square</option>
              <option>PayPal</option>
              <option>Authorize.net</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input type="password" className="input" placeholder="••••••••••••••••" />
          </div>
          <button className="btn btn-secondary">Test Connection</button>
        </div>
      </div>
    </div>
  );

  const renderPrinterSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Receipt Printer Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Printer Type</label>
            <select className="input">
              <option>Thermal Printer (80mm)</option>
              <option>Thermal Printer (58mm)</option>
              <option>Standard Printer</option>
              <option>Network Printer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connection</label>
            <select className="input">
              <option>USB</option>
              <option>Network (IP Address)</option>
              <option>Bluetooth</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <Printer className="w-4 h-4" />
            Test Print
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Receipt Format</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
            <span className="text-sm font-medium text-gray-700">Print Store Logo</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
            <span className="text-sm font-medium text-gray-700">Show Item Details</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
            <span className="text-sm font-medium text-gray-700">Include Barcode</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Print Customer Copy</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Database Connected</h4>
            <p className="text-sm text-blue-700 mt-1">
              SQL Server 2022 - RMH Database • Last backup: 2 hours ago
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Connection Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Server</label>
            <input type="text" className="input" defaultValue="localhost" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
            <input type="text" className="input" defaultValue="RMH" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connection Status</label>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Database Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Optimize Database
          </button>
          <button className="btn btn-secondary">
            <Database className="w-4 h-4" />
            Backup Now
          </button>
          <button className="btn btn-secondary">
            Test Connection
          </button>
          <button className="btn btn-secondary">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your system preferences and configuration</p>
        </div>
        
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <Check className="w-5 h-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Tabs */}
      <div className="card card-compact">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                ${activeTab === tab.id
                  ? `bg-${tab.color}-600 text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'pos' && renderPOSSettings()}
      {activeTab === 'users' && renderUserSettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}
      {activeTab === 'security' && renderSecuritySettings()}
      {activeTab === 'payment' && renderPaymentSettings()}
      {activeTab === 'printer' && renderPrinterSettings()}
      {activeTab === 'database' && renderDatabaseSettings()}

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-8">
        <button className="btn btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </button>
        <button onClick={handleSave} className="btn btn-primary btn-lg shadow-xl">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;


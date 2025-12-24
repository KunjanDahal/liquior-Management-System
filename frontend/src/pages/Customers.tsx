import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  UserPlus,
  Star,
  Gift,
} from 'lucide-react';

type CustomerFilter = 'all' | 'vip' | 'regular' | 'new';

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, ST 12345',
      totalPurchases: 45,
      totalSpent: 4250.00,
      lastPurchase: '2024-12-20',
      joinDate: '2023-06-15',
      tier: 'VIP',
      loyaltyPoints: 425,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, City, ST 12345',
      totalPurchases: 38,
      totalSpent: 3890.00,
      lastPurchase: '2024-12-19',
      joinDate: '2023-08-22',
      tier: 'VIP',
      loyaltyPoints: 389,
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.d@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, City, ST 12345',
      totalPurchases: 32,
      totalSpent: 3420.00,
      lastPurchase: '2024-12-17',
      joinDate: '2023-09-10',
      tier: 'Regular',
      loyaltyPoints: 342,
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.b@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, City, ST 12345',
      totalPurchases: 28,
      totalSpent: 2980.00,
      lastPurchase: '2024-12-21',
      joinDate: '2024-01-15',
      tier: 'Regular',
      loyaltyPoints: 298,
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'd.wilson@email.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, City, ST 12345',
      totalPurchases: 8,
      totalSpent: 650.00,
      lastPurchase: '2024-12-18',
      joinDate: '2024-11-01',
      tier: 'New',
      loyaltyPoints: 65,
    },
  ];

  const stats = [
    {
      label: 'Total Customers',
      value: '1,284',
      change: '+12.5%',
      icon: Users,
      color: 'indigo',
    },
    {
      label: 'VIP Customers',
      value: '48',
      change: '+8.2%',
      icon: Star,
      color: 'purple',
    },
    {
      label: 'New This Month',
      value: '156',
      change: '+15.3%',
      icon: UserPlus,
      color: 'green',
    },
    {
      label: 'Avg Customer Value',
      value: '$842.50',
      change: '+4.3%',
      icon: DollarSign,
      color: 'orange',
    },
  ];

  const getTierBadge = (tier: string) => {
    const styles = {
      VIP: 'badge-primary',
      Regular: 'badge-info',
      New: 'badge-success',
    };
    return styles[tier as keyof typeof styles] || 'badge-gray';
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`p-3 bg-${stat.color}-50 rounded-xl mb-3 inline-block`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="stat-value my-2">{stat.value}</p>
            <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'vip', 'regular', 'new'] as CustomerFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-2 rounded-lg font-medium capitalize transition-all
                  ${filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Customer Directory</h2>
          <span className="text-sm text-gray-600">{customers.length} customers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Tier</th>
                <th>Purchases</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Last Purchase</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getTierBadge(customer.tier)}`}>
                      {customer.tier === 'VIP' && <Star className="w-3 h-3 mr-1" />}
                      {customer.tier}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{customer.totalPurchases}</span>
                    </div>
                  </td>
                  <td className="font-bold text-green-600">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">{customer.loyaltyPoints} pts</span>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Recently Added
          </h3>
          <div className="space-y-3">
            {customers.slice(0, 3).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(customer.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="btn btn-sm btn-secondary">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Spenders */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top Spenders
          </h3>
          <div className="space-y-3">
            {customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.totalPurchases} purchases</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{customer.loyaltyPoints} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="input" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="input" placeholder="Smith" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="input" placeholder="john.smith@email.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="input" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea className="input" rows={2} placeholder="123 Main St, City, ST 12345"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Tier</label>
                  <select className="input">
                    <option>Regular</option>
                    <option>VIP</option>
                    <option>New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Loyalty Points</label>
                  <input type="number" className="input" placeholder="0" defaultValue="0" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  <Plus className="w-4 h-4" />
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;


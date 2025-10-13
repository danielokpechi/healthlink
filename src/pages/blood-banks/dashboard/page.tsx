
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';

export default function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bloodInventory, setBloodInventory] = useState([
    { type: 'A+', quantity: 15, price: 15000, available: true },
    { type: 'A-', quantity: 8, price: 18000, available: true },
    { type: 'B+', quantity: 12, price: 16000, available: true },
    { type: 'B-', quantity: 3, price: 20000, available: true },
    { type: 'AB+', quantity: 6, price: 22000, available: true },
    { type: 'AB-', quantity: 2, price: 25000, available: true },
    { type: 'O+', quantity: 20, price: 14000, available: true },
    { type: 'O-', quantity: 4, price: 24000, available: true }
  ]);

  const [requests] = useState([
    {
      id: 1,
      patientName: 'Adebayo Johnson',
      bloodType: 'O+',
      quantity: 2,
      urgency: 'emergency',
      contactPhone: '+234 803 123 4567',
      contactEmail: 'adebayo.johnson@email.com',
      requestTime: '2 hours ago',
      status: 'pending',
      totalCost: 28000,
      notes: 'Urgent surgery required'
    },
    {
      id: 2,
      patientName: 'Fatima Ibrahim',
      bloodType: 'A-',
      quantity: 1,
      urgency: 'urgent',
      contactPhone: '+234 809 987 6543',
      contactEmail: 'fatima.ibrahim@email.com',
      requestTime: '4 hours ago',
      status: 'pending',
      totalCost: 18000,
      notes: 'Regular treatment'
    },
    {
      id: 3,
      patientName: 'Chukwu Okoro',
      bloodType: 'B+',
      quantity: 3,
      urgency: 'routine',
      contactPhone: '+234 805 456 7890',
      contactEmail: 'chukwu.okoro@email.com',
      requestTime: '1 day ago',
      status: 'completed',
      totalCost: 48000,
      notes: 'Scheduled procedure'
    }
  ]);

  const [revenueData] = useState({
    totalRevenue: 5750000,
    monthlyRevenue: 1234000,
    weeklyRevenue: 325000,
    completedTransactions: 89,
    pendingPayments: 2
  });

  const [recentTransactions] = useState([
    { id: 1, patient: 'Adebayo Johnson', amount: 28000, bloodType: 'O+', date: '2024-01-15', status: 'completed' },
    { id: 2, patient: 'Fatima Ibrahim', amount: 18000, bloodType: 'A-', date: '2024-01-14', status: 'pending' },
    { id: 3, patient: 'Chukwu Okoro', amount: 48000, bloodType: 'B+', date: '2024-01-13', status: 'completed' },
    { id: 4, patient: 'Amina Yusuf', amount: 44000, bloodType: 'AB+', date: '2024-01-12', status: 'completed' }
  ]);

  useEffect(() => {
    if (!user) {
      // If auth context isn't populated yet, wait briefly
      setTimeout(() => {
        const current = window.localStorage.getItem('bloodlink_user');
        if (!current) navigate('/auth');
      }, 50);
      return;
    }
    if ((user.type || user.userType || '').toString().toLowerCase() !== 'bloodbank') {
      navigate('/');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const updateQuantity = (type: string, newQuantity: number) => {
    setBloodInventory(prev => 
      prev.map(item => 
        item.type === type ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const updatePrice = (type: string, newPrice: number) => {
    setBloodInventory(prev => 
      prev.map(item => 
        item.type === type ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  const toggleAvailability = (type: string) => {
    setBloodInventory(prev => 
      prev.map(item => 
        item.type === type ? { ...item, available: !item.available } : item
      )
    );
  };

  const getStockLevel = (
    quantity: number
  ): { level: 'out' | 'critical' | 'low' | 'good'; color: 'danger' | 'warning' | 'success' | 'default' | 'pink' } => {
    if (quantity === 0) return { level: 'out', color: 'danger' };
    if (quantity < 5) return { level: 'critical', color: 'danger' };
    if (quantity < 10) return { level: 'low', color: 'warning' };
    return { level: 'good', color: 'success' };
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return { variant: 'danger' as const, text: 'EMERGENCY' };
      case 'urgent': return { variant: 'warning' as const, text: 'URGENT' };
      case 'routine': return { variant: 'success' as const, text: 'ROUTINE' };
      default: return { variant: 'default' as const, text: urgency.toUpperCase() };
    }
  };

  const totalUnits = bloodInventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = bloodInventory.filter(item => item.quantity < 5).length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="ri-heart-pulse-fill text-white text-2xl"></i>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
      <Header />
      
      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Blood Bank Dashboard
              </h1>
              <p className="text-pink-100 text-lg">
                Welcome back, {user.organizationName || user.firstName}! Manage your inventory, requests, and revenue.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white text-pink-600 hover:bg-gray-50">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </Button>
              <Button className="bg-white/20 border border-white/30 text-white hover:bg-white/30">
                <i className="ri-add-line mr-2"></i>
                Add Stock
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
              { id: 'inventory', label: 'Inventory', icon: 'ri-drop-line' },
              { id: 'requests', label: 'Requests', icon: 'ri-file-list-line' },
              { id: 'payments', label: 'Payments', icon: 'ri-money-dollar-circle-line' },
              { id: 'account', label: 'Account', icon: 'ri-settings-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <i className="ri-drop-line text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-pink-100 text-sm">Total Units</p>
                      <p className="text-2xl font-bold">{totalUnits}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <i className="ri-alert-line text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-yellow-100 text-sm">Low Stock Items</p>
                      <p className="text-2xl font-bold">{lowStockItems}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <i className="ri-file-list-line text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Pending Requests</p>
                      <p className="text-2xl font-bold">{pendingRequests}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-green-100 text-sm">Monthly Revenue</p>
                      <p className="text-2xl font-bold">₦{revenueData.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Blood Requests</h3>
                  <div className="space-y-4">
                    {requests.slice(0, 3).map((request) => {
                      const urgencyBadge = getUrgencyBadge(request.urgency);
                      return (
                        <div key={request.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{request.patientName}</h4>
                              <Badge variant={urgencyBadge.variant}>
                                {urgencyBadge.text}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {request.bloodType} • {request.quantity} pints • ₦{request.totalCost.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{request.requestTime}</p>
                            {request.status === 'pending' && (
                              <Button size="sm" className="mt-2">
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('requests')}
                      className="w-full"
                    >
                      View All Requests
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold">₦{revenueData.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-green-700">Total Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold">{revenueData.completedTransactions}</p>
                        <p className="text-sm text-blue-700">Completed Orders</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-semibold text-gray-900">₦{revenueData.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="font-semibold text-gray-900">₦{revenueData.weeklyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Payments</span>
                        <Badge variant="warning">{revenueData.pendingPayments}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('payments')}
                      className="w-full"
                    >
                      View Payment Details
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Blood Inventory Management
                </h2>
                <Button size="sm">
                  <i className="ri-refresh-line mr-2"></i>
                  Refresh
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Blood Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Quantity</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Price per Pint</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Stock Level</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Availability</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodInventory.map((item) => {
                      const stockLevel = getStockLevel(item.quantity);
                      return (
                        <tr key={item.type} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                                <i className="ri-drop-line text-pink-500"></i>
                              </div>
                              <span className="font-semibold text-gray-900">{item.type}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.type, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                              >
                                <i className="ri-subtract-line text-sm"></i>
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.type, item.quantity + 1)}
                                className="w-8 h-8 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                              >
                                <i className="ri-add-line text-sm"></i>
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="mr-2">₦</span>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updatePrice(item.type, Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                min="0"
                                step="1000"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={stockLevel.color}>
                              {stockLevel.level === 'out' ? 'Out of Stock' :
                               stockLevel.level === 'critical' ? 'Critical' :
                               stockLevel.level === 'low' ? 'Low Stock' : 'Good Stock'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => toggleAvailability(item.type)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                item.available ? 'bg-pink-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.available ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <i className="ri-edit-line"></i>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <i className="ri-more-line"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'requests' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Blood Requests Management
                </h2>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <i className="ri-filter-line mr-2"></i>
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <i className="ri-sort-asc mr-2"></i>
                    Sort
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {requests.map((request) => {
                  const urgencyBadge = getUrgencyBadge(request.urgency);
                  return (
                    <Card key={request.id} className="border-l-4 border-l-pink-500">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{request.patientName}</h3>
                            <Badge variant={urgencyBadge.variant}>
                              {urgencyBadge.text}
                            </Badge>
                            <Badge variant={request.status === 'pending' ? 'warning' : request.status === 'completed' ? 'success' : 'default'}>
                              {request.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Blood Type:</span>
                              <span className="ml-1 font-semibold text-pink-600">{request.bloodType}</span>
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>
                              <span className="ml-1">{request.quantity} pints</span>
                            </div>
                            <div>
                              <span className="font-medium">Total Cost:</span>
                              <span className="ml-1 font-semibold text-green-600">₦{request.totalCost.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span>
                              <span className="ml-1">{request.requestTime}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Phone:</span>
                              <span className="ml-1">{request.contactPhone}</span>
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>
                              <span className="ml-1">{request.contactEmail}</span>
                            </div>
                          </div>

                          {request.notes && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span>
                              <span className="ml-1">{request.notes}</span>
                            </div>
                          )}
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline">
                              <i className="ri-close-line mr-2"></i>
                              Reject
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              <i className="ri-check-line mr-2"></i>
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              {/* Revenue Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <div className="text-center">
                    <p className="text-green-100 text-sm mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold">₦{revenueData.totalRevenue.toLocaleString()}</p>
                    <p className="text-green-100 text-xs mt-1">All time</p>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <div className="text-center">
                    <p className="text-blue-100 text-sm mb-2">Monthly Revenue</p>
                    <p className="text-3xl font-bold">₦{revenueData.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-blue-100 text-xs mt-1">This month</p>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <div className="text-center">
                    <p className="text-purple-100 text-sm mb-2">Weekly Revenue</p>
                    <p className="text-3xl font-bold">₦{revenueData.weeklyRevenue.toLocaleString()}</p>
                    <p className="text-purple-100 text-xs mt-1">This week</p>
                  </div>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
                  <Button size="sm" variant="outline">
                    <i className="ri-download-line mr-2"></i>
                    Export
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Blood Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{transaction.patient}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                              {transaction.bloodType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-green-600">₦{transaction.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'}>
                              {transaction.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="outline">
                              <i className="ri-eye-line mr-2"></i>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-8">
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Blood Bank Profile</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Bank Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Lagos University Teaching Hospital Blood Bank"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        defaultValue="NAFDAC-2024-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Idi-Araba, Surulere, Lagos State, Nigeria"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="bloodbank@luth.edu.ng"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+234 803 123 4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                      Update Password
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

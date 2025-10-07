
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import Badge from '../../../components/base/Badge';

interface InventoryItem {
  id: string;
  name: string;
  type: 'blood' | 'plasma' | 'platelets' | 'oxygen' | 'medicine' | 'ppe' | 'lab';
  quantity: number;
  unit: string;
  price: number;
  status: 'available' | 'low' | 'out';
  expiryDate?: string;
}

interface Request {
  id: string;
  patientName: string;
  resourceType: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requestDate: string;
  contactInfo: string;
}

export default function FacilityDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'analytics'>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'A+ Blood',
      type: 'blood',
      quantity: 25,
      unit: 'units',
      price: 150,
      status: 'available',
      expiryDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'O- Blood',
      type: 'blood',
      quantity: 8,
      unit: 'units',
      price: 180,
      status: 'low',
      expiryDate: '2024-02-10'
    },
    {
      id: '3',
      name: 'Oxygen Cylinder',
      type: 'oxygen',
      quantity: 45,
      unit: 'cylinders',
      price: 75,
      status: 'available'
    },
    {
      id: '4',
      name: 'N95 Masks',
      type: 'ppe',
      quantity: 0,
      unit: 'boxes',
      price: 25,
      status: 'out'
    },
    {
      id: '5',
      name: 'Paracetamol',
      type: 'medicine',
      quantity: 120,
      unit: 'strips',
      price: 5,
      status: 'available',
      expiryDate: '2025-06-30'
    }
  ]);

  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      patientName: 'John Smith',
      resourceType: 'A+ Blood',
      quantity: 2,
      urgency: 'critical',
      status: 'pending',
      requestDate: '2024-01-15',
      contactInfo: '+1-555-0123'
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      resourceType: 'Oxygen Cylinder',
      quantity: 1,
      urgency: 'high',
      status: 'approved',
      requestDate: '2024-01-14',
      contactInfo: '+1-555-0456'
    },
    {
      id: '3',
      patientName: 'Mike Davis',
      resourceType: 'Platelets',
      quantity: 3,
      urgency: 'medium',
      status: 'completed',
      requestDate: '2024-01-13',
      contactInfo: '+1-555-0789'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'blood': return 'ri-drop-line';
      case 'plasma': return 'ri-test-tube-line';
      case 'platelets': return 'ri-heart-pulse-line';
      case 'oxygen': return 'ri-lungs-line';
      case 'medicine': return 'ri-capsule-line';
      case 'ppe': return 'ri-shield-line';
      case 'lab': return 'ri-microscope-line';
      default: return 'ri-medical-mask-line';
    }
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
        : req
    ));
  };

  const updateInventory = (itemId: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity: newQuantity,
            status: newQuantity === 0 ? 'out' : newQuantity < 10 ? 'low' : 'available'
          }
        : item
    ));
  };

  return (
    <div className="min-h-screen page-transition">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full floating-element"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-200/20 rounded-full floating-element"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-black gradient-text mb-4">
              Facility Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your healthcare resources and respond to requests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Resources</p>
                  <p className="text-3xl font-bold text-gray-900">198</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <i className="ri-medical-mask-line text-2xl text-pink-600"></i>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="ri-time-line text-2xl text-blue-600"></i>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="ri-alert-line text-2xl text-orange-600"></i>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-green-600">$24,580</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                </div>
              </div>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/20 w-fit">
              {[
                { id: 'inventory', label: 'Inventory', icon: 'ri-archive-line' },
                { id: 'requests', label: 'Requests', icon: 'ri-file-list-line' },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Resource Inventory</h2>
                <Button className="btn-hover">
                  <i className="ri-add-line mr-2"></i>
                  Add Resource
                </Button>
              </div>

              <div className="grid gap-6">
                {inventory.map((item) => (
                  <Card key={item.id} className="glass p-6 card-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                          <i className={`${getResourceIcon(item.type)} text-2xl text-pink-600`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 capitalize">{item.type}</p>
                          {item.expiryDate && (
                            <p className="text-sm text-gray-500">Expires: {item.expiryDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
                          <p className="text-sm text-gray-600">{item.unit}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">${item.price}</p>
                          <p className="text-sm text-gray-600">per unit</p>
                        </div>

                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateInventory(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <i className="ri-subtract-line"></i>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateInventory(item.id, item.quantity + 1)}
                          >
                            <i className="ri-add-line"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Resource Requests</h2>

              <div className="grid gap-6">
                {requests.map((request) => (
                  <Card key={request.id} className="glass p-6 card-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                          <Badge className={getStatusColor(request.urgency)}>
                            {request.urgency} priority
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Resource</p>
                            <p className="font-medium">{request.resourceType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{request.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Request Date</p>
                            <p className="font-medium">{request.requestDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Contact</p>
                            <p className="font-medium">{request.contactInfo}</p>
                          </div>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex space-x-3 ml-6">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <i className="ri-close-line mr-1"></i>
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <i className="ri-check-line mr-1"></i>
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Blood Products', percentage: 35, color: 'bg-red-500' },
                      { type: 'Oxygen Equipment', percentage: 25, color: 'bg-blue-500' },
                      { type: 'Medicines', percentage: 20, color: 'bg-green-500' },
                      { type: 'PPE & Safety', percentage: 15, color: 'bg-yellow-500' },
                      { type: 'Lab Supplies', percentage: 5, color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Requests Fulfilled</span>
                      <span className="text-2xl font-bold text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Response Time</span>
                      <span className="text-2xl font-bold text-blue-600">2.3h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="text-2xl font-bold text-purple-600">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Growth</span>
                      <span className="text-2xl font-bold text-pink-600">+12%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

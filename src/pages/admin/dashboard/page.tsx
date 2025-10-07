
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const globalStats = {
    totalBloodBanks: 156,
    activeDonors: 8392,
    totalRequests: 2847,
    completedDonations: 12847,
    totalRevenue: 2847392,
    monthlyRevenue: 284739,
    pendingApprovals: 12
  };

  const bloodBankApplications = [
    {
      id: 1,
      name: 'Metro General Hospital',
      location: 'Downtown Medical District',
      licenseNumber: 'MED-2024-001',
      submittedDate: '2024-01-15',
      status: 'pending',
      contactEmail: 'admin@metrogeneral.com'
    },
    {
      id: 2,
      name: 'Regional Blood Center',
      location: 'Westside Health Campus',
      licenseNumber: 'MED-2024-002',
      submittedDate: '2024-01-14',
      status: 'under_review',
      contactEmail: 'contact@regionalblood.org'
    }
  ];

  const recentActivity = [
    { type: 'donation', user: 'John Smith', bloodType: 'O+', time: '2 hours ago', location: 'City General' },
    { type: 'request', user: 'Sarah Johnson', bloodType: 'A-', time: '3 hours ago', location: 'Regional Medical' },
    { type: 'approval', user: 'Metro Hospital', action: 'Blood bank approved', time: '5 hours ago' },
    { type: 'donation', user: 'Mike Brown', bloodType: 'B+', time: '6 hours ago', location: 'Community Center' }
  ];

  const topBloodBanks = [
    { name: 'City General Blood Bank', donations: 1247, revenue: 156750, rating: 4.9 },
    { name: 'Regional Medical Center', donations: 1089, revenue: 136125, rating: 4.8 },
    { name: 'Metro Hospital', donations: 892, revenue: 111500, rating: 4.7 },
    { name: 'Community Blood Services', donations: 756, revenue: 94500, rating: 4.6 }
  ];

  const inventoryOverview = [
    { type: 'A+', total: 1247, critical: 23, percentage: 15.2 },
    { type: 'A-', total: 892, critical: 18, percentage: 10.9 },
    { type: 'B+', total: 1089, critical: 12, percentage: 13.3 },
    { type: 'B-', total: 567, critical: 8, percentage: 6.9 },
    { type: 'AB+', total: 423, critical: 15, percentage: 5.2 },
    { type: 'AB-', total: 234, critical: 22, percentage: 2.9 },
    { type: 'O+', total: 1876, critical: 5, percentage: 22.9 },
    { type: 'O-', total: 892, critical: 31, percentage: 10.9 }
  ];

  const handleApproveBloodBank = (id: number) => {
    console.log('Approving blood bank:', id);
  };

  const handleRejectBloodBank = (id: number) => {
    console.log('Rejecting blood bank:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Super Admin Dashboard
              </h1>
              <p className="text-pink-100 text-lg">
                Global platform management and analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 pr-8"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button className="bg-white text-pink-600 hover:bg-gray-50">
                <i className="ri-download-line mr-2"></i>
                Export Report
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
              { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
              { id: 'bloodbanks', label: 'Blood Banks', icon: 'ri-hospital-line' },
              { id: 'inventory', label: 'Global Inventory', icon: 'ri-drop-line' },
              { id: 'users', label: 'Users & Donors', icon: 'ri-user-line' },
              { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' }
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-sm">Total Blood Banks</p>
                      <p className="text-3xl font-bold">{globalStats.totalBloodBanks}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="ri-hospital-line text-2xl"></i>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Active Donors</p>
                      <p className="text-3xl font-bold">{globalStats.activeDonors.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="ri-user-heart-line text-2xl"></i>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold">${(globalStats.totalRevenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl"></i>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Lives Saved</p>
                      <p className="text-3xl font-bold">{globalStats.completedDonations.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="ri-heart-pulse-line text-2xl"></i>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Pending Approvals Alert */}
              {globalStats.pendingApprovals > 0 && (
                <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="ri-alert-line text-yellow-500 text-xl mr-3"></i>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pending Blood Bank Approvals</h3>
                        <p className="text-gray-600">{globalStats.pendingApprovals} blood banks awaiting approval</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('bloodbanks')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Review Now
                    </Button>
                  </div>
                </Card>
              )}

              {/* Recent Activity & Top Performers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'donation' ? 'bg-green-100' :
                          activity.type === 'request' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          <i className={`${
                            activity.type === 'donation' ? 'ri-heart-fill text-green-500' :
                            activity.type === 'request' ? 'ri-search-line text-blue-500' : 'ri-check-line text-purple-500'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600">
                            {activity.type === 'donation' ? `Donated ${activity.bloodType}` :
                             activity.type === 'request' ? `Requested ${activity.bloodType}` : activity.action}
                            {activity.location && ` at ${activity.location}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Blood Banks</h3>
                  <div className="space-y-4">
                    {topBloodBanks.map((bank, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{bank.name}</p>
                            <p className="text-sm text-gray-600">{bank.donations} donations</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${bank.revenue.toLocaleString()}</p>
                          <div className="flex items-center">
                            <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                            <span className="text-sm text-gray-600">{bank.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'bloodbanks' && (
            <div className="space-y-8">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Blood Bank Applications</h3>
                  <Badge variant="warning">{bloodBankApplications.length} Pending</Badge>
                </div>
                
                <div className="space-y-4">
                  {bloodBankApplications.map((application) => (
                    <Card key={application.id} className="border-l-4 border-l-yellow-500">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{application.name}</h4>
                            <Badge variant={application.status === 'pending' ? 'warning' : 'default'}>
                              {application.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Location:</span>
                              <span className="ml-1">{application.location}</span>
                            </div>
                            <div>
                              <span className="font-medium">License:</span>
                              <span className="ml-1">{application.licenseNumber}</span>
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span>
                              <span className="ml-1">{application.submittedDate}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <span className="font-medium text-sm text-gray-600">Contact:</span>
                            <span className="ml-1 text-sm text-gray-600">{application.contactEmail}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectBloodBank(application.id)}
                          >
                            <i className="ri-close-line mr-2"></i>
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApproveBloodBank(application.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <i className="ri-check-line mr-2"></i>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Global Blood Inventory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {inventoryOverview.map((blood) => (
                    <Card key={blood.type} className="border-2 border-gray-100">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-pink-600">{blood.type}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{blood.total}</p>
                            <p className="text-sm text-gray-600">Total Units</p>
                          </div>
                          
                          <div className={`p-2 rounded-lg ${
                            blood.critical > 20 ? 'bg-red-50 text-red-700' :
                            blood.critical > 10 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                          }`}>
                            <p className="text-sm font-medium">{blood.critical} Critical Stock</p>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-pink-500 h-2 rounded-full" 
                              style={{ width: `${blood.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{blood.percentage}% of total</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

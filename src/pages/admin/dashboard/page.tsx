import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';
import { collection, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/index';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  // const [timeRange, setTimeRange] = useState('7d');

  const [globalStats, setGlobalStats] = useState({
    totalBloodBanks: 0,
    approvedBanks: 0,
    pendingBanks: 0,
    rejectedBanks: 0,
    activeDonors: 0,
    totalRequests: 0,
    completedDonations: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });

  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topBloodBanks, setTopBloodBanks] = useState<any[]>([]);
  const [inventoryOverview, setInventoryOverview] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const confirmAction = (id: string, action: "approve" | "reject") => {
    setSelectedBankId(id);
    setSelectedAction(action);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedBankId || !selectedAction) return;
    setShowModal(false);
    if (selectedAction === "approve") await handleApproveBloodBank(selectedBankId);
    if (selectedAction === "reject") await handleRejectBloodBank(selectedBankId);

    setSelectedBankId(null);
    setSelectedAction(null);

    // window.location.reload();
  };

  const loadBloodBanks = async () => {
    setLoadingBanks(true);
    try {
      const q = collection(db, 'blood_banks');
      const snap = await getDocs(q);
      const items = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name || data.organizationName || data.title || 'Unnamed',
          contactEmail: data.contactEmail || '',
          address: data.address || data.location || '',
          licenseNumber: data.licenseNumber || null,
          approved: !!data.approved,
          status: data.status || (data.approved ? 'approved' : 'pending'),
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || data.approvedAt || null,
          raw: data
        };
      });
      setBloodBanks(items);
    } catch (e) {
      console.error('Failed to load blood banks', e);
    } finally {
      setLoadingBanks(false);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const banksSnap = await getDocs(collection(db, 'blood_banks'));
      const banks = banksSnap.docs.map(d => d.data() as any);
      const totalBloodBanks = banks.length;
      const approvedBanks = banks.filter(b => b.approved).length;
      const pendingBanks = banks.filter(b => b.status === 'pending').length;
      const rejectedBanks = banks.filter(b => b.status === 'rejected').length;
      const pendingApprovals = banks.filter(b => b.status === 'pending').length;

      const usersSnap = await getDocs(collection(db, 'users'));
      const users = usersSnap.docs.map(d => d.data() as any);
      const activeDonors = users.filter(u => (u.userType || '').toLowerCase() === 'donor').length;

      const requestsSnap = await getDocs(collection(db, 'requests'));
      const totalRequests = requestsSnap.size;

      const donationsSnap = await getDocs(collection(db, 'donations'));
      const donations = donationsSnap.docs.map(d => d.data() as any);
      const completedDonations = donations.filter(d => d.status === 'completed').length;

      const txSnap = await getDocs(collection(db, 'transactions'));
      let totalRevenue = 0;
      txSnap.forEach(doc => {
        const t = doc.data() as any;
        if (t.status === 'paid') totalRevenue += t.amount || 0;
      });

      setGlobalStats({
        totalBloodBanks,
        approvedBanks,
        pendingBanks,
        rejectedBanks,
        activeDonors,
        totalRequests,
        completedDonations,
        totalRevenue,
        pendingApprovals
      });
    } catch (e) {
      console.error('Failed to load global stats', e);
    }
  };

const loadRecentActivity = async () => {
  try {
    const reqSnap = await getDocs(collection(db, 'requests'));
    const donationSnap = await getDocs(collection(db, 'donations'));
    const bankSnap = await getDocs(collection(db, 'blood_banks'));

    // Map requests
    const reqs = reqSnap.docs.map(d => {
      const data = d.data() as any;
      return {
        type: 'request',
        timestamp: data.updatedAt || data.createdAt,
        action: `Requested ${data.bloodType || ''}`,
        ...data,
      };
    });

    // Map donations
    const dons = donationSnap.docs.map(d => {
      const data = d.data() as any;
      return {
        type: 'donation',
        timestamp: data.updatedAt || data.createdAt,
        action: `Donated ${data.bloodType || ''}`,
        ...data,
      };
    });

    // Map bank approvals & rejections
    const approvalsAndRejections = bankSnap.docs
      .map(d => {
        const data = d.data() as any;

        // Pick the latest event timestamp
        const latestTime = [data.updatedAt, data.approvedAt, data.rejectedAt]
          .filter(Boolean)
          .map(t => (t?.toDate ? t.toDate() : new Date(t)))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        if (!latestTime) return null;

        if (data.status === 'approved') {
          return {
            type: 'approval',
            timestamp: data.updatedAt || data.approvedAt,
            action: 'Blood bank approved',
            name: data.name,
            ...data,
          };
        }

        if (data.status === 'rejected') {
          return {
            type: 'rejection',
            timestamp: data.updatedAt || data.rejectedAt,
            action: 'Blood bank rejected',
            name: data.name,
            ...data,
          };
        }

        return null;
      })
      .filter(Boolean) as any[];

    // Merge all activities & sort by latest timestamp
    const combined = [...reqs, ...dons, ...approvalsAndRejections]
      .sort((a, b) => {
        const aTime = a.timestamp?.toDate
          ? a.timestamp.toDate().getTime()
          : a.timestamp instanceof Date
          ? a.timestamp.getTime()
          : 0;
        const bTime = b.timestamp?.toDate
          ? b.timestamp.toDate().getTime()
          : b.timestamp instanceof Date
          ? b.timestamp.getTime()
          : 0;
        return bTime - aTime;
      })
      .slice(0, 5);

    console.log("Recent activity combined:", combined);
    setRecentActivity(combined);
  } catch (e) {
    console.error('Failed to load recent activity', e);
  }
};

  const loadTopBloodBanks = async () => {
    try {
      const banksSnap = await getDocs(collection(db, 'blood_banks'));
      const donationsSnap = await getDocs(collection(db, 'donations'));

      const donationsByBank: Record<string, number> = {};
      donationsSnap.forEach(d => {
        const data = d.data() as any;
        if (data.facilityId) {
          donationsByBank[data.facilityId] = (donationsByBank[data.facilityId] || 0) + 1;
        }
      });

      const banks = banksSnap.docs
      .map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name || 'Unnamed',
          status: data.status || 'pending',
          donations: donationsByBank[d.id] || 0,
          revenue: data.revenue || 0,
          rating: data.rating || 4.5
        };
      })
      .filter(b => b.status !== 'rejected'); 

      const sorted = banks.sort((a, b) => b.donations - a.donations).slice(0, 5);
      setTopBloodBanks(sorted);
    } catch (e) {
      console.error('Failed to load top blood banks', e);
    }
  };

  const loadInventory = async () => {
    try {
      const banksSnap = await getDocs(collection(db, 'blood_banks'));
      const totals: Record<string, { total: number; critical: number }> = {};

      banksSnap.forEach(doc => {
        const data: any = doc.data();
        if (data.inventory) {
          for (const type in data.inventory) {
            const inv = data.inventory[type];
            if (!totals[type]) totals[type] = { total: 0, critical: 0 };
            totals[type].total += inv.quantity;
            if (inv.quantity < 20) totals[type].critical += 1;
          }
        }
      });

      const grandTotal = Object.values(totals).reduce((sum, t) => sum + t.total, 0);
      const overview = Object.keys(totals).map(type => {
        const total = totals[type].total;
        return {
          type,
          total,
          critical: totals[type].critical,
          percentage: grandTotal ? Math.round((total / grandTotal) * 100) : 0
        };
      });

      setInventoryOverview(overview);
    } catch (e) {
      console.error('Failed to load inventory', e);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const items = snap.docs.map((d) => {
        const data = d.data() as any;

        // normalize userType 
        const role = (data.userType || "user")
          .toLowerCase()
          .replace(/[\s_-]/g, "");

        return {
          id: d.id,
          name: data.name || data.fullName || "Unnamed User",
          email: data.email || "",
          userType: role,
          phone: data.phone || "",
          createdAt: data.createdAt || null,
          lastActive: data.lastActive || data.updatedAt || null,
        };
      });

      const filtered = items.filter((u) =>
        ["user", "donor", "superadmin"].includes(u.userType)
      );

      // sort by createdAt (latest first)
      const sorted = filtered.sort((a, b) => {
        const aTime = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : 0;

        const bTime = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : 0;

        return bTime - aTime; // newest first
      });

      setUsers(sorted);
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadGlobalStats();
    loadBloodBanks();
    loadRecentActivity();
    loadTopBloodBanks();
    loadInventory();
    loadUsers();
  }, []);

  useEffect(() => {
  const q = collection(db, "blood_banks");
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        name: data.name || data.organizationName || data.title || "Unnamed",
        contactEmail: data.contactEmail || "",
        address: data.address || data.location || "",
        licenseNumber: data.licenseNumber || null,
        approved: !!data.approved,
        status: data.status || (data.approved ? "approved" : "pending"),
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || data.approvedAt || null,
        raw: data,
      };
    });
    setBloodBanks(items);
  });

  return () => unsub(); // cleanup
}, []);

  const handleApproveBloodBank = async (id: string) => {
    try {
      const bankRef = doc(db, 'blood_banks', id);
      const now = Timestamp.now();
      await updateDoc(bankRef, {
        approved: true,
        approvedAt: now,
        status: 'approved',
        updatedAt: now,
        rejectedAt: null // clear old rejection
      });

      await loadGlobalStats();
      await loadRecentActivity();
      await loadTopBloodBanks();
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const handleRejectBloodBank = async (id: string) => {
    try {
      const bankRef = doc(db, 'blood_banks', id);
      const now = Timestamp.now();
      await updateDoc(bankRef, {
        approved: false,
        rejectedAt: now,
        status: 'rejected',
        updatedAt: now,
        approvedAt: null // clear old approval
      });

      await loadGlobalStats();
      await loadRecentActivity();
      await loadTopBloodBanks();
    } catch (e) {
      console.error('Reject failed', e);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
      <Header />

      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mt-20">
            <div>
              <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
              <p className="text-pink-100 text-lg">Global platform management and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 pr-8"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select> */}
              {/* <Button className="bg-white text-pink-600 hover:bg-gray-50">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
              { id: 'bloodbanks', label: 'Blood Banks', icon: 'ri-hospital-line' },
              // { id: 'inventory', label: 'Global Inventory', icon: 'ri-drop-line' },
              { id: 'users', label: 'Users & Donors', icon: 'ri-user-line' },
              // { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' }
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

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-sm">Approved Blood Banks</p>
                      <p className="text-3xl font-bold">{globalStats.approvedBanks}</p>
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

              {/* Pending */}
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
                    <Button onClick={() => setActiveTab('bloodbanks')} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      Review Now
                    </Button>
                  </div>
                </Card>
              )}

              {/* Activity & Top */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'donation' ? 'bg-green-100' :
                          activity.type === 'request' ? 'bg-blue-100' :
                          activity.type === 'approval' ? 'bg-purple-100' :
                          activity.type === 'rejection' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <i className={`${
                            activity.type === 'donation' ? 'ri-heart-fill text-green-500' :
                            activity.type === 'request' ? 'ri-search-line text-blue-500' :
                            activity.type === 'approval' ? 'ri-check-line text-purple-500' :
                            activity.type === 'rejection' ? 'ri-close-line text-red-500' : 'ri-information-line text-gray-500'
                          }`}></i>
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.user || activity.name}</p>
                          <p className="text-sm text-gray-600">
                            {activity.type === 'donation'
                              ? `Donated ${activity.bloodType}`
                              : activity.type === 'request'
                              ? `Requested ${activity.bloodType}`
                              : activity.type === 'approval'
                              ? 'Blood bank approved'
                              : activity.type === 'rejection'
                              ? 'Blood bank rejected'
                              : activity.action || 'Activity'}
                          </p>
                        </div>
                        {/* <span className="text-xs text-gray-500">
                          {activity.updatedAt?.toDate
                            ? activity.updatedAt.toDate().toLocaleString()
                            : activity.updatedAt instanceof Date
                              ? activity.updatedAt.toLocaleString()
                              : activity.time || ''}
                        </span> */}
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
                          {/* <div className="flex items-center">
                            <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                            <span className="text-sm text-gray-600">{bank.rating}</span>
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Blood Banks */}
          {activeTab === 'bloodbanks' && (
            <div className="space-y-8">
              {/* Blood Bank Status Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Total Blood Banks</p>
                        <p className="text-2xl font-bold">{globalStats.totalBloodBanks}</p>
                      </div>
                      <i className="ri-hospital-line text-2xl text-white"></i>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Approved</p>
                        <p className="text-2xl font-bold text-white">{globalStats.approvedBanks}</p>
                      </div>
                      <i className="ri-check-line text-2xl text-white"></i>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Pending</p>
                        <p className="text-2xl font-bold text-white">{globalStats.pendingBanks}</p>
                      </div>
                      <i className="ri-time-line text-2xl text-white"></i>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Rejected</p>
                        <p className="text-2xl font-bold text-white">{globalStats.rejectedBanks}</p>
                      </div>
                      <i className="ri-close-line text-2xl text-white"></i>
                    </div>
                  </Card>
                </div>

              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Blood Banks</h3>
                  <Badge variant="warning">{bloodBanks.filter(b => b.status === 'pending').length} Pending</Badge>
                </div>

                <div className="space-y-4">
                  {loadingBanks && <p className="text-gray-600">Loading blood banks...</p>}

                  {!loadingBanks && (() => {
                    const pending = bloodBanks.filter(b => b.status === 'pending');
                    const others = bloodBanks.filter(b => b.status !== 'pending')
                      .sort((a, b) => {
                        const aDate = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
                        const bDate = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;
                        return bDate - aDate;
                      });
                    const ordered = [...pending, ...others];

                    return ordered.map((application) => (
                      <Card key={application.id} className={`border-l-4 ${application.status === 'pending'
                          ? 'border-l-yellow-500'
                          : application.status === 'approved'
                            ? 'border-l-green-500'
                            : 'border-l-red-500'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{application.name}</h4>
                              <Badge variant={application.status === 'pending'
                                  ? 'warning'
                                  : application.status === 'approved'
                                    ? 'success'
                                    : 'danger'}>
                                {application.status.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div><span className="font-medium">Location:</span> {application.address}</div>
                              <div><span className="font-medium">License:</span> {application.licenseNumber || '-'}</div>
                              <div><span className="font-medium">Submitted:</span> {application.createdAt?.toDate ? application.createdAt.toDate().toLocaleString() : '-'}</div>
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Contact:</span> {application.contactEmail}
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            {application.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => confirmAction(application.id, "reject")}
                                >
                                  <i className="ri-close-line mr-2"></i>
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => confirmAction(application.id, "approve")}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <i className="ri-check-line mr-2"></i>
                                  Approve
                                </Button>
                              </>
                            )}

                            {application.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => confirmAction(application.id, "reject")}
                              >
                                <i className="ri-close-line mr-2"></i>
                                Reject
                              </Button>
                            )}

                            {application.status === "rejected" && (
                              <Button
                                size="sm"
                                onClick={() => confirmAction(application.id, "approve")}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <i className="ri-check-line mr-2"></i>
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ));
                  })()}
                </div>
              </Card>
            </div>
          )}

          {/* Inventory */}
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
                            blood.critical > 20 ? 'bg-red-50 text-red-700'
                              : blood.critical > 10 ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-green-50 text-green-700'}`}>
                            <p className="text-sm font-medium">{blood.critical} Critical Stock</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${blood.percentage}%` }}></div>
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

          {activeTab === 'users' && (
            <div className="space-y-8">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Users</h3>
                  <Badge variant="default">{users.length} Total</Badge>
                </div>

                {loadingUsers && <p className="text-gray-600">Loading users...</p>}

                {!loadingUsers && (
                  <div className="space-y-4">
                    {users.map((u) => (
                      <Card
                        key={u.id}
                        className={`border-l-4 ${
                          u.userType === "donor"
                            ? "border-l-purple-500"
                            : u.userType === "super_admin"
                            ? "border-l-purple-500"
                            : "border-l-blue-500"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{u.name}</h4>
                            <p className="text-sm text-gray-600">{u.email}</p>
                            <p className="text-sm text-gray-600">
                              {u.phone ? `${u.phone}` : "No phone"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Joined:{" "}
                              {u.createdAt?.toDate
                                ? u.createdAt.toDate().toLocaleDateString()
                                : "-"}
                            </p>
                          </div>

                          <Badge
                            variant={
                              u.userType === "donor"
                                ? "success"
                                : u.userType === "superadmin"
                                ? "default"
                                : "pink"
                            }
                          >
                            {u.userType.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

        </div>
      </section>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Confirm {selectedAction === "approve" ? "Approval" : "Rejection"}
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {selectedAction} this blood bank?
            </p>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-800">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className={
                  selectedAction === "approve"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }
              >
                {selectedAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

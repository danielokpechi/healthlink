
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';
import { db } from "../../../firebase"; 
import { collection, query, where, getDoc, setDoc, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNotification } from '../../../context/NotificationContext';
import type { Donation } from '../../../firebase/types';
import { auth } from "../../../firebase";
import { updatePassword } from "firebase/auth";
import AddStockModal from '../AddStockModal';
import { useInventory } from '../../../hooks/useInventory';
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";


export default function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedBloodBankId, setSelectedBloodBankId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = useAuth();
  // const selectedBloodBankId = user?.bloodBankId;
  const navigate = useNavigate();
  const { notify } = useNotification(); 
  const bankId = (user?.uid || user?.bloodBankId);

  const {
    items: bloodInventory, 
    updateQuantity, updatePrice, toggleAvailability, addStock
  } = useInventory(bankId);

  const [revenueData, setRevenueData] = useState<any>(null);

  const [transactions, setTransactions] = useState<any[]>([]);

   useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setSelectedBloodBankId(userData?.uid);
        console.log("Fetched user data:", userData);
      }
    };
    fetchUserData();
  }, []);

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

  useEffect(() => {
      const fetchDonations = async () => {
          try {
              if (!selectedBloodBankId) {
                  return;
              }

              const q = query(
                  collection(db, "donations"),
                  where("location", "==", selectedBloodBankId)
              );
              const querySnapshot = await getDocs(q);

              const fetchedDonations: Donation[] = querySnapshot.docs.map((doc) => {
                  const data = doc.data();
                  return {
                      id: doc.id,
                      fullName: data.fullName || "UNKNOWN",
                      bloodType: data.bloodType || "UNKNOWN",
                      phone: data.phone || "",
                      donorEmail: data.donorEmail || "",
                      requestTime: data.createdAt
                          ? data.createdAt.toDate().toLocaleString()
                          : "Unknown",
                      status: data.status || "pending",
                      preferredDate: data.preferredDate || "",
                      emergencyContact: data.emergencyContact || "",
                      lastDonation: data.lastDonation || "",
                      notes: data.medicalHistory || "",
                      preferredTime: data.preferredTime || "",
                  };
              });

              const sortedDonations = fetchedDonations.sort((a, b) => {
                  if (a.status === 'pending' && b.status !== 'pending') {
                      return -1;
                  }
                  if (a.status !== 'pending' && b.status === 'pending') {
                      return 1;
                  }
                  return 0;
              });

              setDonations(sortedDonations);
          } catch (error) {
              console.error("Error fetching donations:", error);
          }
      };

      fetchDonations();
  }, [selectedBloodBankId]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!selectedBloodBankId) return;

        const q = query(
          collection(db, "blood_requests"),
          where("location", "==", selectedBloodBankId)
        );

        const querySnapshot = await getDocs(q);

        const fetchedRequests = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          return {
            id: doc.id,
            patientName: data.patientName || '',
            bloodType: data.bloodType || '',
            quantity: Number(data.unitsNeeded) || 0,          
            urgency: data.urgency || '',
            totalCost: Number(data.totalAmount) || 0,         
            status: data.status || 'pending',
            notes: data.additionalNotes || '',
            contactPhone: data.contactNumber || '',
            requestTime: data.createdAt ? data.createdAt.toDate().toLocaleString() : ''
          }
        });

        setRequests(fetchedRequests);
      } catch(err) {
        console.log("Error fetching requests", err)
      }

    }

    fetchRequests();
  }, [selectedBloodBankId]);

  useEffect(() => {
    if(!selectedBloodBankId) return;

    const revRef = doc(db, "revenue", selectedBloodBankId);
    getDoc(revRef).then(snap => {
      if (snap.exists()) {
        setRevenueData(snap.data());
      }
    });

  }, [selectedBloodBankId, requests]);

  useEffect(()=> {
  if(!selectedBloodBankId) return;

  const q = query(
    collection(db, "transactions"),
    where("bloodBankId", "==", selectedBloodBankId)
  );

  getDocs(q).then(snapshot=>{
      const t = snapshot.docs.map(doc=> {
        const d = doc.data();
        return {
          id: doc.id,
          patient: d.patientName,
          bloodType: d.bloodType,
          amount: Number(d.amount),
          date: d.date?.toDate().toLocaleDateString(),
          status: d.status
        }
      });
      setTransactions(t);
    })
  }, [selectedBloodBankId, requests]);

  useEffect(() => {
    const fetchProfile = async () => {
      if(!selectedBloodBankId) return;

      const bankRef = doc(db, "blood_banks", selectedBloodBankId);
      const snap = await getDoc(bankRef);

      if(snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, [selectedBloodBankId]);

  const handleCompleteDonation = async (donationId: string) => {
    try {
      const donationRef = doc(db, "donations", donationId);

      await updateDoc(donationRef, {
        status: 'completed',
        completedAt: new Date() 
      });

      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === donationId ? { ...donation, status: 'completed' } : donation
        )
      );

      notify({ type: 'success', message: 'Donation request completed successfully!' });
      
    } catch (error) {
      console.error("Error completing donation:", error);
      notify({ type: 'error', message: 'Failed to complete donation request. Please try again.' });
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const reqRef = doc(db, "blood_requests", requestId);
      const reqSnap = await getDoc(reqRef);

      if(!reqSnap.exists()) return;

      const requestData = reqSnap.data();
      const amount = Number(requestData.totalAmount) || 0;

      // 1) Mark Request Completed
      await updateDoc(reqRef, {
        status: "completed",
        completedAt: new Date()
      });

      // 2) Update revenue
      const revRef = doc(db, "revenue", selectedBloodBankId!);
      const revSnap = await getDoc(revRef);

      if(revSnap.exists()) {
        const revData = revSnap.data();
        await updateDoc(revRef, {
          totalRevenue: (revData.totalRevenue || 0) + amount,
          monthlyRevenue: (revData.monthlyRevenue || 0) + amount,
          weeklyRevenue: (revData.weeklyRevenue || 0) + amount,
          completedTransactions: (revData.completedTransactions || 0) + 1
        });
      } else {
        await setDoc(revRef, {
          totalRevenue: amount,
          monthlyRevenue: amount,
          weeklyRevenue: amount,
          completedTransactions: 1,
          pendingPayments: 0
        });
      }

      await addDoc(collection(db, "transactions"), {
        bloodBankId: selectedBloodBankId,
        facilityId: selectedBloodBankId,
        amount,
        patientName: requestData.patientName,
        bloodType: requestData.bloodType,
        date: new Date(),
        status: "completed"
      });

      // Update UI state locally
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: "completed" } : req
        )
      );

      notify({ type: 'success', message: 'Blood request marked as completed & revenue updated!' });

    } catch (error) {
      console.error("Error completing request:", error);
      notify({ type: 'error', message: 'Failed to complete blood request.' });
    }
  };

  const handleSaveProfile = async () => {
    if(!selectedBloodBankId) return;

    const ref = doc(db, "blood_banks", selectedBloodBankId);

    await updateDoc(ref, {
      name: profile.name || "",
      licenseNumber: profile.licenseNumber,
      address: profile.address || "",
      contactEmail: profile.contactEmail || "",
      contactPhone: profile.contactPhone || ""
    });

    notify({ type:'success', message:'Profile updated successfully!'});
    console.log("clicked")
  };

  const handlePasswordUpdate = async () => {
    try {
      if(newPassword !== confirmPassword) {
        notify({ type:'error', message:'Passwords do not match' });
        return;
      }

      const user = auth.currentUser!;
      const cred = EmailAuthProvider.credential(user.email!, currentPassword);

      await reauthenticateWithCredential(user, cred);

      await updatePassword(user, newPassword);

      notify({ type:'success', message:'Password updated successfully!' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch(e: any) {
      console.log(e);
      notify({ type:'error', message:e.message || 'Failed to update password.' });
    }
  };

  const getStockLevel = (
    quantity: number
  ): { level: 'out' | 'critical' | 'low' | 'good'; color: 'danger' | 'warning' | 'success' | 'default' | 'pink' } => {
    if (quantity === 0) return { level: 'out', color: 'danger' };
    if (quantity < 5) return { level: 'critical', color: 'danger' };
    if (quantity < 10) return { level: 'low', color: 'warning' };
    return { level: 'good', color: 'success' };
  };

  const getUrgencyBadge = (urgency: string | undefined) => {
    if (!urgency) {
      return { variant: 'default' as const, text: 'UNKNOWN' };
    }

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
                Welcome back {user.fullName || user.firstName}! Manage your inventory, requests, and revenue.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white/20 border border-white/30 text-white hover:bg-white/30" onClick={()=>setShowAdd(true)}>
                <i className="ri-add-line mr-2"></i>
                Add Stock
              </Button>

              <AddStockModal
                open={showAdd}
                onClose={()=>setShowAdd(false)}
                onCreate={async (p)=>{ await addStock(p.type, { price: p.price, quantity: p.quantity, available: p.available }); }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:space-x-8 gap-3 text-center">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
              { id: 'inventory', label: 'Inventory', icon: 'ri-drop-line' },
              { id: 'requests', label: 'Requests', icon: 'ri-file-list-line' },
              { id: 'donations', label: 'Donations', icon: 'ri-heart-line' },
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
                      <p className="text-2xl font-bold">₦{revenueData?.monthlyRevenue?.toLocaleString?.() || 0}</p>
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
                        <p className="text-2xl font-bold">₦{revenueData?.totalRevenue?.toLocaleString?.() || 0}</p>
                        <p className="text-sm text-green-700">Total Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold">{revenueData?.completedTransactions || 0}</p>
                        <p className="text-sm text-blue-700">Completed Orders</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-semibold text-gray-900">₦{revenueData?.monthlyRevenue?.toLocaleString?.() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="font-semibold text-gray-900">₦{revenueData?.weeklyRevenue?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Payments</span>
                        <Badge variant="warning">{pendingRequests}</Badge>
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
                              onClick={() => toggleAvailability(item.type, !item.available)}
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
              </div>
              
              <div className="space-y-4">
                {requests.map((request) => {
                  const urgencyBadge = getUrgencyBadge(request.urgency);
                  return (
                    <Card key={request.id} className="border-l-4 border-l-pink-500">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
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
                            {/* <Button size="sm" variant="outline">
                              <i className="ri-close-line mr-2"></i>
                              Reject
                            </Button> */}
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleCompleteRequest(request.id)}>
                              <i className="ri-check-line mr-2"></i>
                              Complete
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

          {activeTab === 'donations' && (
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Donation Requests</h3>
              <div className="space-y-4">
                {donations.map((donation) => {
                  // const urgencyBadge = getUrgencyBadge(donation.urgency);
                  return (
                    <Card key={donation.id} className="border-l-4 border-l-pink-500">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{donation.fullName}</h3>
                            {/* <Badge variant={urgencyBadge.variant}>{urgencyBadge.text}</Badge> */}
                            <Badge variant={donation.status === 'pending' ? 'warning' : 'success'}>{donation.status.toUpperCase()}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div><span className="font-medium">Blood Type:</span> {donation.bloodType}</div>
                            <div><span className="font-medium">Emergency Contact: <br /> </span> {donation.emergencyContact} </div>
                            <div><span className="font-medium">Preferred Date: <br /> </span> {donation.preferredDate}</div>
                            <div><span className="font-medium">Requested: <br /> </span> {donation.requestTime}</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div><span className="font-medium">Phone:</span> {donation.phone}</div>
                            <div><span className="font-medium">Email:</span> {donation.donorEmail}</div>
                            <div><span className="font-medium">Last Donation:</span> {donation.lastDonation}</div>
                            <div><span className="font-medium">Preferred Time:</span> {donation.preferredTime}</div>
                          </div>

                          {donation.notes && (
                            <div className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {donation.notes}</div>
                          )}
                        </div>
                        
                        {donation.status === 'pending' && (
                          <div className="flex space-x-2 ml-4">
                            {/* <Button size="sm" variant="outline">
                              <i className="ri-close-line mr-2"></i> Reject
                            </Button> */}
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleCompleteDonation(donation.id)}>
                              <i className="ri-check-line mr-2"></i> Complete
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
                    <p className="text-3xl font-bold">₦{revenueData?.totalRevenue?.toLocaleString() || 0}</p>
                    <p className="text-green-100 text-xs mt-1">All time</p>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <div className="text-center">
                    <p className="text-blue-100 text-sm mb-2">Monthly Revenue</p>
                    <p className="text-3xl font-bold">₦{revenueData?.monthlyRevenue?.toLocaleString() || 0}</p>
                    <p className="text-blue-100 text-xs mt-1">This month</p>
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <div className="text-center">
                    <p className="text-purple-100 text-sm mb-2">Weekly Revenue</p>
                    <p className="text-3xl font-bold">₦{revenueData?.weeklyRevenue?.toLocaleString() || 0}</p>
                    <p className="text-purple-100 text-xs mt-1">This week</p>
                  </div>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
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
                        {/* <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
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
                            {/* <Button size="sm" variant="outline">
                              <i className="ri-eye-line mr-2"></i>
                              View
                            </Button> */}
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
                        value={profile?.name || ""}  
                        onChange={(e)=> setProfile({...profile, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={profile?.licenseNumber ?? ""}
                        onChange={(e)=> setProfile({...profile, licenseNumber: e.target.value})}
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
                      value={profile?.address || ""}  
                      onChange={(e)=> setProfile({...profile, address: e.target.value})}
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
                        value={profile?.contactEmail || ""}  
                        onChange={(e)=> setProfile({...profile, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={profile?.contactPhone || ""}  
                        onChange={(e)=> setProfile({...profile, contactPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    {/* <Button type="button" onClick={() => setProfile(profile)} variant="outline">
                      Cancel
                    </Button> */}
                    <Button type="button" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" onClick={handleSaveProfile}>
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
                      value={currentPassword}
                      onChange={(e)=>setCurrentPassword(e.target.value)}
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
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type='button' className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" onClick={handlePasswordUpdate}>
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; 


export default function DonorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEligibleDate, setNextEligibleDate] = useState<string>('');
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [statusColor, setStatusColor] = useState<string>('green');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  
  const { user } = useAuth();
  // const navigate = useNavigate();

  const [urgentRequests] = useState([
    {
      id: 1,
      bloodType: 'O+',
      quantity: '2 pints',
      urgency: 'emergency',
      location: 'Lagos University Teaching Hospital',
      distance: '2.5 km',
      timePosted: '30 minutes ago',
      description: 'Emergency surgery patient needs immediate blood transfusion'
    },
    {
      id: 2,
      bloodType: 'A+',
      quantity: '1 pint',
      urgency: 'urgent',
      location: 'National Hospital Abuja',
      distance: '5.2 km',
      timePosted: '2 hours ago',
      description: 'Cancer patient requires blood for treatment'
    },
    {
      id: 3,
      bloodType: 'B+',
      quantity: '3 pints',
      urgency: 'routine',
      location: 'Federal Medical Centre',
      distance: '8.1 km',
      timePosted: '1 day ago',
      description: 'Scheduled surgery preparation'
    }
  ]);

  // const [stats] = useState({
  //   totalDonations: 8,
  //   livesSaved: 24,
  //   nextEligibleDate: '2024-03-15',
  //   donorRank: 'Gold Donor',
  //   totalVolume: '8 pints'
  // });

  useEffect(() => {
    if (!user) return;
    if (donationHistory.length === 0) return;

    const lastDonationDate = new Date(donationHistory[0].preferredDate);  
    const nextEligible = new Date(lastDonationDate);
    nextEligible.setDate(nextEligible.getDate() + 90);

    setNextEligibleDate(nextEligible.toLocaleDateString());

    const today = new Date();
    const diffInTime = nextEligible.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    setDaysLeft(diffInDays);

  }, [donationHistory, user]);

  console.log("donationHistory", donationHistory);

  useEffect(() => {
  const fetchDonations = async () => {
    if (!user) return;

    const q = query(
      collection(db, "donations"),
      where("donorId", "==", user.uid),
      where("status", "==", "completed"),
      orderBy("lastDonation", "desc"),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items:any[] = [];
      querySnapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() });
      });

      setDonationHistory(items);
    }

    setIsLoading(false);
  };

  fetchDonations();
}, [user]);

console.log("current user uid:", user.uid)
// console.log("donorId in firestore", items[0].donorId)


  // Update status and color based on days left
  useEffect(() => {
    if (daysLeft <= 0) {
      setStatusColor('green');
      setStatusMessage('You can donate again now!');
    } else if (daysLeft <= 14) {
      setStatusColor('red');
      setStatusMessage(`You can donate again in ${daysLeft} days.`);
    } else if (daysLeft <= 45) {
      setStatusColor('yellow');
      setStatusMessage(`You can donate again in ${daysLeft} days.`);
    } else {
      setStatusColor('green');
      setStatusMessage(`You can donate again in ${daysLeft} days.`);
    }

    setIsLoading(false);
  }, [daysLeft]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return { variant: 'danger' as const, text: 'EMERGENCY', icon: 'ri-alarm-warning-line' };
      case 'urgent': return { variant: 'warning' as const, text: 'URGENT', icon: 'ri-time-line' };
      case 'routine': return { variant: 'success' as const, text: 'ROUTINE', icon: 'ri-calendar-line' };
      default: return { variant: 'default' as const, text: urgency.toUpperCase(), icon: 'ri-information-line' };
    }
  };

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
                 Welcome back {((user.fullName || user.firstName || user.displayName || '').toString()).replace(/\b\w/g, (c: string) => c.toUpperCase())} !
              </h1>
              <p className="text-pink-100 text-lg">
                Thank you for being a life-saving donor. Your contributions make a real difference.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/donate">
                <Button className="bg-white text-pink-600 hover:bg-gray-50">
                  <i className="ri-gift-line mr-2"></i>
                  Donate Now
                </Button>
              </Link>
              <Link to="/profile">
                <Button className="bg-white/20 border border-white/30 text-white hover:bg-white/30">
                  <i className="ri-user-line mr-2"></i>
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-gift-line text-white text-xl"></i>
                </div>
                <div>
                  <p className="text-pink-100 text-sm">Total Donations</p>
                  <p className="text-2xl font-bold">{stats.totalDonations}</p>
                </div>
              </div>
            </Card> */}
            
            {/* <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-heart-pulse-line text-white text-xl"></i>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Lives Saved</p>
                  <p className="text-2xl font-bold">{stats.livesSaved}</p>
                </div>
              </div>
            </Card> */}
            
            {/* <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-drop-line text-white text-xl"></i>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold">{stats.totalVolume}</p>
                </div>
              </div>
            </Card> */}
            
            {/* <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-award-line text-white text-xl"></i>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Donor Status</p>
                  <p className="text-lg font-bold">{stats.donorRank}</p>
                </div>
              </div>
            </Card> */}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Urgent Blood Requests */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Blood Requests </h3>
                <Link to="/request">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {urgentRequests.map((request) => {
                  const urgencyBadge = getUrgencyBadge(request.urgency);
                  return (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <i className="ri-drop-line text-pink-500"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.bloodType} Blood Needed</h4>
                            <p className="text-sm text-gray-600">{request.quantity} required</p>
                          </div>
                        </div>
                        <Badge variant={urgencyBadge.variant}>
                          <i className={`${urgencyBadge.icon} mr-1`}></i>
                          {urgencyBadge.text}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <i className="ri-map-pin-line mr-1"></i>
                          {request.location} 
                          {/* • {request.distance} */}
                        </div>
                        <div className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {request.timePosted}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {/* <Button size="sm" className="flex-1">
                          <i className="ri-heart-line mr-2"></i>
                          Respond
                        </Button> */}
                        <Button size="sm" variant="outline">
                          <i className="ri-share-line mr-2"></i>
                          Share
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Donation History & Next Eligible */}
            <div className="space-y-6">
              {/* Next Eligible Date */}
              <Card className={`bg-gradient-to-r from-${statusColor}-50 to-${statusColor}-50 text-white border-${statusColor}-200`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${statusColor}-500 rounded-full flex items-center justify-center`}>
                    <i className="ri-calendar-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Next Donation Eligible</h4>
                    <p className="text-black font-medium">{nextEligibleDate}</p>
                    <p className={`text-sm ${statusColor === 'red' ? 'text-red-100' : statusColor === 'yellow' ? 'text-black' : 'text-green-700'}`}>
                      {statusMessage}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recent Donations */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Donations</h3>
                  {donationHistory.length > 4 && (
                    <Link to="/profile">
                      <Button size="sm" variant="outline">
                        View All
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="space-y-4">
                  {donationHistory.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      You haven’t made any donations yet.
                    </p>
                  )}
                  {donationHistory.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <i className="ri-drop-line text-pink-500 text-sm"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Blood Donation</h4>
                          <p className="text-sm text-gray-600">{donation.bloodType} </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{donation.preferredDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/donate">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    <i className="ri-gift-line mr-2"></i>
                    Schedule Donation
                  </Button>
                </Link>
                <Link to="/blood-banks">
                  <Button variant="outline" className="w-full">
                    <i className="ri-hospital-line mr-2"></i>
                    Find Blood Banks
                  </Button>
                </Link>
                <Link to="/request">
                  <Button variant="outline" className="w-full">
                    <i className="ri-search-line mr-2"></i>
                    Request Blood
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
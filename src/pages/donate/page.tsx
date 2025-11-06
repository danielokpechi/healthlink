
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';
import { db, auth } from "../../firebase";
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { useNotification } from "../../context/NotificationContext";

export default function DonateBlood() {
  const { notify } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodType: '',
    age: '',
    weight: '',
    location: '',
    preferredDate: '',
    preferredTime: '',
    medicalHistory: '',
    lastDonation: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const [eligibilityCheck, setEligibilityCheck] = useState({
    age: false,
    weight: false,
    health: false,
    lastDonation: false,
    medications: false
  });
  const [showEligibility, setShowEligibility] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Get user profile from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("Fetched user details:", userData);

          setFormData((prev) => ({
            ...prev,
            fullName: userData.fullName || "",
            email: userData.email || user.email || "",
            phone: userData.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);


  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const q = query(collection(db, "blood_banks"), where("approved", "==", true));
        const snapshot = await getDocs(q);
        const banks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBloodBanks(banks);
        console.log("Fetched Blood Banks:", banks);
      } catch (error) {
        console.error("Error fetching blood banks:", error);
      }
    };

    fetchBloodBanks();
  }, []);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const nearbyDonationCenters = [
    {
      id: 1,
      name: 'Lagos University Teaching Hospital Blood Bank',
      address: 'Idi-Araba, Surulere, Lagos State',
      distance: '2.5 km',
      hours: '8:00 AM - 6:00 PM',
      phone: '+234 803 123 4567',
      rating: 4.8,
      nextAvailable: 'Today 2:00 PM',
      incentives: ['Free health screening', 'Refreshments', 'Certificate']
    },
    {
      id: 2,
      name: 'National Hospital Abuja Blood Centre',
      address: 'Central Business District, Abuja FCT',
      distance: '1.8 km',
      hours: '7:00 AM - 8:00 PM',
      phone: '+234 809 876 5432',
      rating: 4.9,
      nextAvailable: 'Tomorrow 10:00 AM',
      incentives: ['Free medical checkup', 'Donor card', 'Snacks']
    },
    {
      id: 3,
      name: 'University College Hospital Ibadan',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      distance: '3.2 km',
      hours: '9:00 AM - 5:00 PM',
      phone: '+234 805 456 7890',
      rating: 4.6,
      nextAvailable: 'Today 4:00 PM',
      incentives: ['Health screening', 'Donor recognition', 'Light meal']
    }
  ];

  const donationBenefits = [
    {
      title: 'Health Benefits',
      description: 'Regular blood donation can help reduce iron levels, lower blood pressure, and improve cardiovascular health.',
      icon: 'ri-heart-pulse-line',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Free Health Screening',
      description: 'Get a comprehensive health check including blood pressure, pulse, temperature, and hemoglobin levels.',
      icon: 'ri-stethoscope-line',
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: 'Save Lives',
      description: 'One donation can save up to three lives. Your contribution makes a direct impact on your community.',
      icon: 'ri-user-heart-line',
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'Donor Recognition',
      description: 'Receive donor certificates, priority medical care, and join our exclusive donor community.',
      icon: 'ri-award-line',
      color: 'from-blue-500 to-green-500'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEligibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEligibilityCheck(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const checkEligibility = () => {
    const eligible = Object.values(eligibilityCheck).every(check => check);
    setIsEligible(eligible);
    setShowEligibility(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        notify({ type: 'error', message: 'You must be logged in to schedule a donation.' });
        return;
      }

      const donationsRef = collection(db, "donations");
      const q2 = query(
        donationsRef,
        where("donorId", "==", user.uid),
        where("status", "==", "completed")
      );

      const completedDocs = await getDocs(q2);
        if (!completedDocs.empty) {
          const lastDonation = completedDocs.docs
            .map(d => d.data())
            .sort((a, b) => new Date(b.preferredDate).getTime() - new Date(a.preferredDate).getTime())[0];

          if (lastDonation?.preferredDate) {
            const lastPreferred = new Date(lastDonation.preferredDate);
            const nextEligible = new Date(lastPreferred);
            nextEligible.setDate(nextEligible.getDate() + 90);

            const today = new Date();

            if (today < nextEligible) {
              notify({
                type: "error",
                message: `You are not yet eligible to donate again. Next eligible date: ${nextEligible.toDateString()}`
              });
              setLoading(false);
              return;
            }
          }
        }

      await addDoc(collection(db, "donations"), {
        ...formData,
        donorId: user.uid,
        donorEmail: user.email,
        facilityId: formData.location,
        status: "pending", 
        createdAt: serverTimestamp(),
      });

      notify({
        type: "success",
        message: "Donation appointment scheduled successfully! Pending blood bank approval.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        bloodType: "",
        age: "",
        weight: "",
        location: "",
        preferredDate: "",
        preferredTime: "",
        medicalHistory: "",
        lastDonation: "",
        emergencyContact: "",
      });
    } catch (error) {
      console.error("Error scheduling donation:", error);
      notify({ type: "error", message: "Failed to schedule donation. Please try again." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50/30 to-red-50/30">
          <div className="absolute inset-0 opacity-20">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-red-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-red-400/30 to-purple-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-6 py-3 glass rounded-full text-pink-700 text-sm font-medium mb-8 animate-pulse-slow">
                <i className="ri-heart-fill mr-2"></i>
                Be a Hero - Donate Blood Today
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  Donate Blood
                </span>
                <br />
                <span className="text-gray-900">Save Lives</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Your blood donation can save up to three lives. Join thousands of Nigerian heroes 
                making a difference in their communities every day.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 shadow-2xl hover:shadow-pink-500/30">
                  <i className="ri-calendar-line mr-3"></i>
                  Schedule Donation
                </Button>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full sm:w-auto shadow-2xl"
                  onClick={() => setShowEligibility(true)}
                >
                  <i className="ri-question-line mr-3"></i>
                  Check Eligibility
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <i className="ri-time-line mr-2 text-pink-500 text-lg"></i>
                  <span className="font-medium">30 minutes process</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-shield-check-line mr-2 text-green-500 text-lg"></i>
                  <span className="font-medium">Safe &amp; sterile</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-[3rem] blur-3xl transform rotate-6 animate-pulse-slow"></div>
              <Card variant="glass" className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Happy%20Nigerian%20blood%20donor%20in%20modern%20donation%20center%2C%20smiling%20person%20donating%20blood%20with%20medical%20professional%20assistance%2C%20clean%20bright%20medical%20facility%20with%20pink%20accents%2C%20comfortable%20donation%20chair%2C%20professional%20healthcare%20setting%20in%20Nigeria%2C%20positive%20donation%20experience&width=600&height=500&seq=donate-hero-ng&orientation=portrait"
                  alt="Blood donation in Nigeria"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -right-6 glass rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                      <i className="ri-drop-fill text-white text-2xl"></i>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">3</div>
                      <div className="text-sm text-gray-500 font-medium">Lives Saved</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Checker */}
      {showEligibility && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="glass" className="shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  Donation 
                  <span className="gradient-text"> Eligibility Check</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Answer these quick questions to check if you're eligible to donate blood
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'age', label: 'I am between 18-65 years old' },
                  { key: 'weight', label: 'I weigh at least 50kg (110 lbs)' },
                  { key: 'health', label: 'I am in good general health' },
                  { key: 'lastDonation', label: 'It has been at least 8 weeks since my last blood donation' },
                  { key: 'medications', label: 'I am not taking any medications that would prevent donation' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center p-4 glass rounded-2xl">
                    <input
                      type="checkbox"
                      id={item.key}
                      name={item.key}
                      checked={eligibilityCheck[item.key as keyof typeof eligibilityCheck]}
                      onChange={handleEligibilityChange}
                      className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500 mr-4"
                    />
                    <label htmlFor={item.key} className="text-gray-700 font-medium cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button onClick={checkEligibility} className="bg-gradient-to-r from-pink-500 to-red-500 shadow-2xl hover:shadow-pink-500/30" size="lg">
                  <i className="ri-check-line mr-3"></i>
                  Check Eligibility
                </Button>
              </div>

              {showEligibility && (
                <div className={`mt-8 p-6 rounded-2xl ${isEligible ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                      <i className={`${isEligible ? 'ri-check-line' : 'ri-close-line'} text-white text-2xl`}></i>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                      {isEligible ? 'You\'re Eligible!' : 'Not Eligible'}
                    </h3>
                    <p className={`${isEligible ? 'text-green-600' : 'text-red-600'} mb-4`}>
                      {isEligible 
                        ? 'Great! You meet the basic requirements for blood donation. Please proceed to schedule your appointment.'
                        : 'Based on your responses, you may not be eligible to donate at this time. Please consult with a healthcare professional.'
                      }
                    </p>
                    {isEligible && (
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                        <i className="ri-calendar-line mr-2"></i>
                        Schedule Donation
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>
      )}

      {/* Donation Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Schedule Your 
                <span className="gradient-text"> Donation</span>
              </h2>
              <p className="text-lg text-gray-600">
                Fill out this form to schedule your blood donation appointment
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-user-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-mail-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 xxx xxx xxxx"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-phone-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Blood Type *</label>
                  <div className="relative">
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                    >
                      <option value="">Select your blood type</option>
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <i className="ri-drop-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Age *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      min="18"
                      max="65"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-calendar-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Weight (kg) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Your weight in kg"
                      min="50"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-scales-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Preferred Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium"
                    />
                    <i className="ri-calendar-2-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Preferred Time *</label>
                  <div className="relative">
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                    </select>
                    <i className="ri-time-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Location Preference *
                </label>
                <div className="relative">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                  >
                    <option value="">Select a blood bank</option>
                    {bloodBanks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name || bank.address}
                      </option>
                    ))}
                  </select>
                  <i className="ri-map-pin-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Last Blood Donation</label>
                <div className="relative">
                  <input
                    type="date"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium"
                  />
                  <i className="ri-history-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Medical History / Current Medications</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Please list any current medications or relevant medical history..."
                  rows={4}
                  className="w-full p-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Emergency Contact</label>
                <div className="relative">
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name and phone number"
                    className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                  />
                  <i className="ri-contacts-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-red-500 shadow-2xl hover:shadow-pink-500/30"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <i className="ri-loader-4-line animate-spin mr-3"></i> 
                  ) : (
                    <i className="ri-calendar-check-line mr-3"></i>
                  )}
                  {loading ? 'Scheduling...' : 'Schedule Donation Appointment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Donation Centers */}
      <section className="py-24 bg-gradient-to-r from-gray-50/50 to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Donation 
              <span className="gradient-text"> Centers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the nearest blood donation center and schedule your life-saving appointment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {nearbyDonationCenters.map((center) => (
              <Card key={center.id} variant="glass" className="hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{center.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center mb-2">
                      <i className="ri-map-pin-line mr-2 text-pink-500"></i>
                      {center.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-sm font-medium">{center.distance} away</p>
                      <div className="flex items-center glass px-3 py-1 rounded-full">
                        <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                        <span className="text-sm font-bold text-gray-700">{center.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-700">Operating Hours</h4>
                    <Badge variant="success">Open</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <i className="ri-time-line mr-2 text-pink-500"></i>
                    {center.hours}
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    <i className="ri-calendar-check-line mr-2"></i>
                    Next available: {center.nextAvailable}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Donor Benefits</h4>
                  <div className="space-y-2">
                    {center.incentives.map((incentive, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <i className="ri-check-line mr-2 text-green-500"></i>
                        {incentive}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 shadow-lg">
                    <i className="ri-calendar-line mr-2"></i>
                    Book Now
                  </Button>
                  <a href={`tel:${center.phone}`} className="flex-1">
                    <Button variant="glass" size="sm" className="w-full shadow-lg">
                      <i className="ri-phone-line mr-2"></i>
                      Call
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Benefits of 
              <span className="gradient-text"> Donating Blood</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Blood donation not only saves lives but also provides numerous benefits to donors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {donationBenefits.map((benefit, index) => (
              <Card key={index} variant="glass" className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className={`w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-glow`}>
                  <i className={`${benefit.icon} text-white text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="floating-element absolute top-20 left-20 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div className="floating-element absolute bottom-20 right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <div className="floating-element absolute top-1/2 left-1/2 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              Be a 
              <span className="bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent"> Hero Today</span>
            </h2>
            <p className="text-2xl text-pink-100 mb-16 max-w-4xl mx-auto leading-relaxed">
              Your blood donation can save up to three lives. Join thousands of Nigerian heroes 
              making a difference in their communities through the gift of life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <Button size="lg" className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-50 shadow-2xl hover:shadow-white/30 text-xl px-12 py-6">
                <i className="ri-heart-fill mr-4"></i>
                Donate Blood Now
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto text-white shadow-2xl text-xl px-12 py-6">
                <i className="ri-question-line mr-4"></i>
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-12 text-pink-100">
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-time-line mr-3 text-xl"></i>
                <span className="font-medium">30 Minutes</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-heart-pulse-line mr-3 text-xl"></i>
                <span className="font-medium">3 Lives Saved</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-shield-check-line mr-3 text-xl"></i>
                <span className="font-medium">100% Safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

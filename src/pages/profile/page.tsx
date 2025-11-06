
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
// import Badge from '../../components/base/Badge';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';

export default function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodType: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    lastDonation: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data:any = snap.data();

        let [first = '', last = ''] = (data.fullName || "").split(" ");
        first = capitalize(first);
        last = capitalize(last);

        setProfileData(prev => ({
          ...prev,
          firstName: first,
          lastName: last,
          email: data.email || "",
          phone: data.phone || "",
          bloodType: data.bloodType || "",
          dateOfBirth: data.dateOfBirth || "",
          address: data.address || "",
          emergencyContact: data.emergencyContact || "",
          emergencyPhone: data.emergencyPhone || "",
          medicalConditions: data.medicalConditions || "",
          lastDonation: data.lastDonation || ""
        }));
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
  }, [user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    const ref = doc(db, "users", user.uid);

    const formattedFirst = capitalize(profileData.firstName);
    const formattedLast = capitalize(profileData.lastName);

    const payload = {
      ...profileData,
      firstName: formattedFirst,
      lastName: formattedLast,
      fullName: `${formattedFirst} ${formattedLast}`,
      updatedAt: new Date()
    };

    await updateDoc(ref, payload);

    setProfileData(payload);

    setIsSaving(false);
    setIsEditing(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  // const calculateNextEligibleDate = () => {
  //   if (!profileData.lastDonation) return 'Unknown';
    
  //   const lastDonation = new Date(profileData.lastDonation);
  //   const nextEligible = new Date(lastDonation);
  //   nextEligible.setDate(nextEligible.getDate() + 56); // 8 weeks
    
  //   return nextEligible.toLocaleDateString();
  // };

  // const isEligibleToDonate = () => {
  //   if (!profileData.lastDonation) return true;
    
  //   const lastDonation = new Date(profileData.lastDonation);
  //   const today = new Date();
  //   const daysSinceLastDonation = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    
  //   return daysSinceLastDonation >= 56;
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-user-heart-line text-white text-3xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {capitalize(profileData.firstName)} {capitalize(profileData.lastName)}
                </h1>
                <p className="text-pink-100 text-lg">
                  Blood Type: {profileData.bloodType || 'Not specified'}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  {/* <Badge variant={isEligibleToDonate() ? 'success' : 'warning'} >
                    {isEligibleToDonate() ? 'Eligible to Donate' : 'Not Eligible Yet'}
                  </Badge> */}
                  <span className="text-pink-100 text-sm">
                    {/* Total Donations: {donationHistory.length} */}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-pink-600 hover:bg-gray-50"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setIsEditing(false)}
                    className="bg-white/20 border border-white/30 text-white hover:bg-white/30"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white text-pink-600 hover:bg-gray-50"
                  >
                    {isSaving ? (
                      <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    ) : (
                      <i className="ri-save-line mr-2"></i>
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-2"></i>
              <span className="text-green-800">Profile updated successfully!</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Personal Information
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Type
                      </label>
                      <select
                        name="bloodType"
                        value={profileData.bloodType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="Enter your full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={profileData.emergencyPhone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions / Allergies
                    </label>
                    <textarea
                      name="medicalConditions"
                      value={profileData.medicalConditions}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="List any medical conditions, allergies, or medications"
                    />
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

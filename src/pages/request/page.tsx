
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';

export default function RequestBlood() {
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: '',
    location: '',
    patientName: '',
    hospitalName: '',
    contactNumber: '',
    unitsNeeded: '',
    medicalCondition: '',
    additionalNotes: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Within 2 hours)', color: 'red' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', color: 'orange' },
    { value: 'routine', label: 'Routine (Within 7 days)', color: 'green' }
  ];

  const availableBloodBanks = [
    {
      id: 1,
      name: 'Lagos University Teaching Hospital Blood Bank',
      address: 'Idi-Araba, Surulere, Lagos State',
      distance: '2.5 km',
      availability: { 'A+': 15, 'O+': 8, 'B+': 12, 'AB+': 3 },
      price: '₦15,000',
      status: 'Available',
      phone: '+234 803 123 4567',
      rating: 4.8,
      responseTime: '30 mins'
    },
    {
      id: 2,
      name: 'National Hospital Abuja Blood Centre',
      address: 'Central Business District, Abuja FCT',
      distance: '1.8 km',
      availability: { 'A+': 22, 'O+': 18, 'B+': 6, 'AB+': 9 },
      price: '₦16,000',
      status: 'Available',
      phone: '+234 809 876 5432',
      rating: 4.9,
      responseTime: '15 mins'
    },
    {
      id: 3,
      name: 'University College Hospital Ibadan',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      distance: '3.2 km',
      availability: { 'A+': 5, 'O+': 2, 'B+': 8, 'AB+': 1 },
      price: '₦14,500',
      status: 'Limited',
      phone: '+234 805 456 7890',
      rating: 4.6,
      responseTime: '45 mins'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchResults(availableBloodBanks);
      setIsSearching(false);
    }, 1500);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Blood request submitted:', formData);
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/30">
          <div className="absolute inset-0 opacity-20">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-red-400/30 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 glass rounded-full text-red-700 text-sm font-medium mb-8 animate-pulse-slow">
              <i className="ri-heart-pulse-line mr-2"></i>
              Emergency Blood Request System
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Request Blood
              </span>
              <br />
              <span className="text-gray-900">Save a Life</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with verified blood banks across Nigeria instantly. Our emergency response system 
              ensures you get the blood you need when every second counts.
            </p>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Submit Blood 
                <span className="gradient-text"> Request</span>
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below to connect with available blood banks in your area
              </p>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Blood Type Required *</label>
                  <div className="relative">
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                    >
                      <option value="">Select blood type</option>
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <i className="ri-drop-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Urgency Level *</label>
                  <div className="relative">
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                    >
                      <option value="">Select urgency</option>
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                    <i className="ri-alarm-warning-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Location *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter city or hospital location"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-map-pin-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Units Needed *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="unitsNeeded"
                      value={formData.unitsNeeded}
                      onChange={handleInputChange}
                      placeholder="Number of units"
                      min="1"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-medicine-bottle-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Patient Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Full name of patient"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-user-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Hospital Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      placeholder="Name of hospital"
                      required
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-hospital-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Contact Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+234 xxx xxx xxxx"
                    required
                    className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                  />
                  <i className="ri-phone-line absolute left-5 top-5 text-red-500 text-xl"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Medical Condition</label>
                <div className="relative">
                  <input
                    type="text"
                    name="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={handleInputChange}
                    placeholder="Brief description of medical condition"
                    className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                  />
                  <i className="ri-stethoscope-line absolute left-5 top-5 text-red-500 text-xl"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information that might help..."
                  rows={4}
                  className="w-full p-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={!formData.bloodType || !formData.location || isSearching}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl hover:shadow-blue-500/30"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <i className="ri-loader-4-line mr-3 animate-spin"></i>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line mr-3"></i>
                      Search Blood Banks
                    </>
                  )}
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl hover:shadow-red-500/30"
                  size="lg"
                >
                  <i className="ri-send-plane-fill mr-3"></i>
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-gray-50/50 to-pink-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Available 
                <span className="gradient-text"> Blood Banks</span>
              </h2>
              <p className="text-xl text-gray-600">
                Found {searchResults.length} blood banks with your required blood type
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {searchResults.map((bank) => (
                <Card key={bank.id} variant="glass" className="hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{bank.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center mb-2">
                        <i className="ri-map-pin-line mr-2 text-red-500"></i>
                        {bank.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm font-medium">{bank.distance} away</p>
                        <div className="flex items-center glass px-3 py-1 rounded-full">
                          <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                          <span className="text-sm font-bold text-gray-700">{bank.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={bank.status === 'Available' ? 'success' : 'warning'} className="ml-3 font-bold">
                      {bank.status}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-gray-700">Blood Type Availability</h4>
                      <span className="text-lg font-black text-red-600">{bank.price}/unit</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(bank.availability).map(([type, count]) => (
                        <div key={type} className="text-center">
                          <div className={`w-full py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                            count < 5 
                              ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-lg' 
                              : count < 10 
                              ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-lg' 
                              : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-lg'
                          }`}>
                            {type}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block font-medium">{count} units</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-time-line mr-2 text-blue-500"></i>
                      <span className="font-medium">Response: {bank.responseTime}</span>
                    </div>
                    <a href={`tel:${bank.phone}`} className="text-red-500 hover:text-red-600 text-sm font-bold cursor-pointer flex items-center glass px-4 py-2 rounded-xl transition-all duration-300">
                      <i className="ri-phone-line mr-2"></i>
                      Call Now
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
                      <i className="ri-send-plane-fill mr-2"></i>
                      Request Blood
                    </Button>
                    <Link to={`/blood-banks/${bank.id}`} className="flex-1">
                      <Button variant="glass" size="sm" className="w-full shadow-lg">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Contact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="gradient" className="text-center shadow-2xl border-2 border-red-200">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-glow">
              <i className="ri-alarm-warning-fill text-white text-3xl"></i>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Emergency Situation?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If this is a life-threatening emergency, please call our 24/7 emergency hotline 
              for immediate assistance and priority blood bank connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="tel:+2341234567890">
                <Button size="lg" className="bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl hover:shadow-red-500/30 text-xl px-8 py-4">
                  <i className="ri-phone-fill mr-3"></i>
                  Emergency Hotline
                </Button>
              </a>
              <Button variant="glass" size="lg" className="shadow-2xl text-xl px-8 py-4">
                <i className="ri-whatsapp-line mr-3"></i>
                WhatsApp Support
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-r from-gray-50/50 to-red-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              How It 
              <span className="gradient-text"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures you get the blood you need as quickly as possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Submit Request',
                description: 'Fill out our secure form with patient details, blood type needed, and urgency level.',
                icon: 'ri-file-text-line',
                color: 'from-red-500 to-pink-500'
              },
              {
                step: '02',
                title: 'Instant Matching',
                description: 'Our AI system instantly matches your request with available blood banks in your area.',
                icon: 'ri-brain-line',
                color: 'from-pink-500 to-purple-500'
              },
              {
                step: '03',
                title: 'Get Connected',
                description: 'Receive immediate contact details and coordinate directly with the blood bank.',
                icon: 'ri-phone-line',
                color: 'from-purple-500 to-blue-500'
              }
            ].map((item, index) => (
              <Card key={index} variant="glass" className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-glow`}>
                    <i className={`${item.icon} text-white text-3xl`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 glass rounded-2xl flex items-center justify-center">
                    <span className="text-lg font-black text-gray-700">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  
  const resourceTypes = [
    { value: 'blood', label: 'Blood & Blood Products', icon: 'ri-drop-line' },
    { value: 'plasma', label: 'Plasma', icon: 'ri-drop-line' },
    { value: 'platelets', label: 'Platelets', icon: 'ri-drop-line' },
    { value: 'oxygen', label: 'Oxygen Cylinders', icon: 'ri-lungs-line' },
    { value: 'concentrators', label: 'Oxygen Concentrators', icon: 'ri-lungs-line' },
    { value: 'medicines', label: 'Medicines & Vaccines', icon: 'ri-capsule-line' },
    { value: 'ppe', label: 'PPE & Medical Kits', icon: 'ri-shield-cross-line' },
    { value: 'lab', label: 'Lab Consumables', icon: 'ri-test-tube-line' }
  ];
  
  const nearbyFacilities = [
    {
      id: 1,
      name: 'Lagos University Teaching Hospital Medical Center',
      address: 'Idi-Araba, Surulere, Lagos State',
      distance: '2.5 km',
      type: 'Multi-Resource Hospital',
      availability: { 
        blood: { 'A+': 15, 'O+': 8, 'B+': 12, 'AB+': 3 },
        oxygen: { cylinders: 25, concentrators: 8 },
        medicines: { vaccines: 150, antibiotics: 89 },
        ppe: { masks: 500, gloves: 1200 }
      },
      status: 'Open',
      phone: '+234 803 123 4567',
      rating: 4.8,
      verified: true,
      specialties: ['Emergency Care', 'Blood Bank', 'Pharmacy', 'Lab Services']
    },
    {
      id: 2,
      name: 'National Hospital Abuja Medical Supply Center',
      address: 'Central Business District, Abuja FCT',
      distance: '1.8 km',
      type: 'Government Medical Facility',
      availability: { 
        blood: { 'A+': 22, 'O+': 18, 'B+': 6, 'AB+': 9 },
        oxygen: { cylinders: 40, concentrators: 15 },
        medicines: { vaccines: 200, antibiotics: 120 },
        ppe: { masks: 800, gloves: 2000 }
      },
      status: 'Open',
      phone: '+234 809 876 5432',
      rating: 4.9,
      verified: true,
      specialties: ['Critical Care', 'Respiratory Support', 'Vaccination Center']
    },
    {
      id: 3,
      name: 'University College Hospital Ibadan',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      distance: '3.2 km',
      type: 'Teaching Hospital',
      availability: { 
        blood: { 'A+': 5, 'O+': 2, 'B+': 8, 'AB+': 1 },
        oxygen: { cylinders: 12, concentrators: 3 },
        medicines: { vaccines: 75, antibiotics: 45 },
        ppe: { masks: 200, gloves: 400 }
      },
      status: 'Closing Soon',
      phone: '+234 805 456 7890',
      rating: 4.6,
      verified: false,
      specialties: ['Medical Training', 'Research', 'General Medicine']
    }
  ];
  
  const stats = [
    { label: 'Lives Saved', value: '12,847', icon: 'ri-heart-fill', color: 'from-pink-500 to-rose-500' },
    { label: 'Active Donors', value: '8,392', icon: 'ri-user-heart-fill', color: 'from-purple-500 to-pink-500' },
    { label: 'Medical Facilities', value: '156', icon: 'ri-hospital-fill', color: 'from-blue-500 to-purple-500' },
    { label: 'Resources Donated', value: '45,231', icon: 'ri-gift-fill', color: 'from-red-500 to-pink-500' }
  ];

  const features = [
    {
      title: 'Real-Time Availability',
      description: 'Check availability of blood, oxygen, medicines, and medical supplies instantly across all connected facilities in Nigeria',
      icon: 'ri-time-line',
      image: 'https://readdy.ai/api/search-image?query=Modern%20Nigerian%20medical%20dashboard%20showing%20real-time%20healthcare%20inventory%20data%20with%20pink%20accents%2C%20medical%20supplies%20including%20blood%20bags%20oxygen%20cylinders%20medicines%20and%20PPE%2C%20interactive%20map%20of%20Nigeria%20showing%20medical%20facilities%2C%20healthcare%20professionals%20monitoring%20supply%20levels%20in%20Nigerian%20hospital%20setting%2C%20bright%20welcoming%20atmosphere%20with%20pink%20color%20scheme&width=600&height=400&seq=feature1-multi-ng&orientation=landscape'
    },
    {
      title: 'Smart Resource Matching',
      description: 'AI-powered matching system connects donors with urgent requests for blood, plasma, medicines, and medical equipment across Nigeria',
      icon: 'ri-brain-line',
      image: 'https://readdy.ai/api/search-image?query=Healthcare%20AI%20technology%20connecting%20Nigerian%20medical%20resource%20donors%20with%20recipients%2C%20digital%20network%20visualization%20with%20pink%20and%20blue%20connections%20showing%20blood%20oxygen%20medicines%20and%20medical%20supplies%2C%20diverse%20Nigerian%20people%20helping%20each%20other%20through%20technology%2C%20modern%20medical%20facility%20background%2C%20clean%20minimalist%20design%20with%20Nigerian%20cultural%20elements&width=600&height=400&seq=feature2-multi-ng&orientation=landscape'
    },
    {
      title: 'Emergency Response Network',
      description: '24/7 emergency medical resource request system with instant notifications for blood, oxygen, medicines, and critical supplies nationwide',
      icon: 'ri-alarm-warning-line',
      image: 'https://readdy.ai/api/search-image?query=Emergency%20medical%20response%20team%20in%20modern%20Nigerian%20hospital%2C%20urgent%20medical%20supply%20coordination%20scenario%20including%20blood%20oxygen%20and%20medicines%2C%20Nigerian%20healthcare%20workers%20coordinating%20emergency%20medical%20resource%20supply%2C%20clean%20medical%20environment%20with%20pink%20emergency%20lighting%2C%20professional%20medical%20setting%20in%20Nigeria&width=600&height=400&seq=feature3-multi-ng&orientation=landscape'
    }
  ];
  
  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30">
          <div className="absolute inset-0 opacity-30">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-pink-400/20 rounded-full blur-xl"></div>
            <div className="floating-element absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-6 py-3 glass rounded-full text-pink-700 text-sm font-medium mb-8 animate-pulse-slow">
                <i className="ri-heart-pulse-line mr-2"></i>
                Complete Healthcare Resource Network
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="gradient-text">
                  Healthcare
                </span>
                <br />
                <span className="text-gray-900">Resources</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Network
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Connect with medical facilities instantly across Nigeria. Find blood, oxygen, medicines, 
                PPE, and medical supplies in real-time to save lives in your community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <Link to="/donate">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-2xl hover:shadow-pink-500/30">
                    <i className="ri-gift-fill mr-3"></i>
                    Donate Resources
                  </Button>
                </Link>
                <Link to="/request">
                  <Button variant="glass" size="lg" className="w-full sm:w-auto shadow-2xl">
                    <i className="ri-search-line mr-3"></i>
                    Find Resources
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="flex -space-x-3 mr-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full border-3 border-white shadow-lg"></div>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-3 border-white shadow-lg"></div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-3 border-white shadow-lg"></div>
                  </div>
                  <span className="font-medium">8,392+ active donors</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-shield-check-fill text-green-500 mr-2 text-lg"></i>
                  <span className="font-medium">Verified &amp; secure</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-[3rem] blur-3xl transform rotate-6 animate-pulse-slow"></div>
              <Card variant="glass" className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20Nigerian%20healthcare%20resource%20center%20with%20diverse%20medical%20supplies%20including%20blood%20bags%20oxygen%20cylinders%20medicines%20and%20PPE%2C%20clean%20white%20medical%20facility%20with%20pink%20accent%20colors%2C%20Nigerian%20healthcare%20professionals%20managing%20medical%20inventory%2C%20bright%20welcoming%20atmosphere%2C%20professional%20medical%20environment%20in%20Nigeria%20with%20various%20healthcare%20resources%20displayed&width=600&height=500&seq=hero-main-multi-ng&orientation=portrait"
                  alt="Healthcare resource center in Nigeria"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -right-6 glass rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                      <i className="ri-heart-pulse-fill text-white text-2xl"></i>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">12,847</div>
                      <div className="text-sm text-gray-500 font-medium">Lives Saved</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Search */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Find Healthcare Resources 
              <span className="gradient-text"> Across Nigeria</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search for blood, oxygen, medicines, PPE, and medical supplies with real-time availability updates
            </p>
          </div>
          
          <Card variant="glass" className="max-w-6xl mx-auto shadow-2xl border-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-4">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your city (Lagos, Abuja, Kano...)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                  />
                  <i className="ri-map-pin-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Resource Type</label>
                <div className="relative">
                  <select
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                    className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                  >
                    <option value="">All resources</option>
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <i className="ri-medical-mask-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-2xl hover:shadow-pink-500/30" size="lg">
                  <i className="ri-search-line mr-3"></i>
                  Search Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Resource Categories */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-pink-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Healthcare 
              <span className="gradient-text"> Resource Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical resources available through our network of verified healthcare facilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: 'Blood & Plasma', 
                description: 'Blood products, plasma, platelets for transfusions',
                icon: 'ri-drop-line',
                color: 'from-red-500 to-pink-500',
                count: '2,847 units'
              },
              { 
                title: 'Oxygen Support', 
                description: 'Cylinders, concentrators, respiratory equipment',
                icon: 'ri-lungs-line',
                color: 'from-blue-500 to-cyan-500',
                count: '1,234 units'
              },
              { 
                title: 'Medicines & Vaccines', 
                description: 'Prescription drugs, vaccines, medical treatments',
                icon: 'ri-capsule-line',
                color: 'from-green-500 to-emerald-500',
                count: '15,678 items'
              },
              { 
                title: 'PPE & Medical Kits', 
                description: 'Protective equipment, surgical supplies, lab consumables',
                icon: 'ri-shield-cross-line',
                color: 'from-purple-500 to-pink-500',
                count: '8,923 items'
              }
            ].map((category, index) => (
              <Card key={index} variant="glass" className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-glow`}>
                  <i className={`${category.icon} text-white text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                <div className="glass px-4 py-2 rounded-full inline-block">
                  <span className="text-sm font-bold text-pink-600">{category.count} available</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-pink-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Why Choose 
              <span className="gradient-text"> Our Network?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets compassionate care to create Nigeria's most efficient healthcare resource network
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  variant={activeFeature === index ? 'gradient' : 'glass'}
                  className={`cursor-pointer transition-all duration-500 ${
                    activeFeature === index 
                      ? 'shadow-2xl border-2 border-pink-200 transform scale-105' 
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg animate-glow' 
                        : 'glass'
                    }`}>
                      <i className={`${feature.icon} text-2xl ${
                        activeFeature === index ? 'text-white' : 'text-gray-600'
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-[3rem] blur-3xl animate-pulse-slow"></div>
              <Card variant="glass" className="relative overflow-hidden shadow-2xl">
                <img 
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  className="w-full h-96 object-cover rounded-2xl transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nearby Facilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-5xl font-black text-gray-900 mb-4">Nearby Medical Facilities</h2>
              <p className="text-xl text-gray-600">Verified healthcare facilities across Nigeria with real-time resource availability</p>
            </div>
            <Link to="/facilities">
              <Button variant="glass" className="shadow-2xl">
                View All Facilities
                <i className="ri-arrow-right-line ml-3"></i>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {nearbyFacilities.map((facility) => (
              <Card key={facility.id} variant="glass" className="hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mr-3">{facility.name}</h3>
                      {facility.verified && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <i className="ri-check-line text-white text-sm"></i>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm flex items-center mb-2">
                      <i className="ri-map-pin-line mr-2 text-pink-500"></i>
                      {facility.address}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-500 text-sm font-medium">{facility.distance} away</p>
                      <div className="flex items-center glass px-3 py-1 rounded-full">
                        <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                        <span className="text-sm font-bold text-gray-700">{facility.rating}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">{facility.type}</Badge>
                  </div>
                  <Badge variant={facility.status === 'Open' ? 'success' : 'warning'} className="ml-3 font-bold">
                    {facility.status}
                  </Badge>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Available Resources</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-drop-line mr-2 text-red-500"></i>
                        Blood Types
                      </span>
                      <div className="flex space-x-1">
                        {Object.entries(facility.availability.blood).slice(0, 3).map(([type, count]) => (
                          <Badge key={type} variant={count < 5 ? 'danger' : 'success'} className="text-xs">
                            {type}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-lungs-line mr-2 text-blue-500"></i>
                        Oxygen
                      </span>
                      <div className="flex space-x-1">
                        <Badge variant="success" className="text-xs">
                          Cylinders: {facility.availability.oxygen.cylinders}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-capsule-line mr-2 text-green-500"></i>
                        Medicines
                      </span>
                      <div className="flex space-x-1">
                        <Badge variant="success" className="text-xs">
                          Available: {facility.availability.medicines.vaccines}+
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="pink" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {facility.specialties.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{facility.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <a href={`tel:${facility.phone}`} className="text-pink-500 hover:text-pink-600 text-sm font-bold cursor-pointer flex items-center glass px-4 py-2 rounded-xl transition-all duration-300">
                    <i className="ri-phone-line mr-2"></i>
                    Call Now
                  </a>
                  <Link to={`/facilities/${facility.id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="floating-element absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="floating-element absolute bottom-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="floating-element absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6">Making a Difference Across Nigeria</h2>
            <p className="text-pink-100 text-xl max-w-3xl mx-auto leading-relaxed">
              Join thousands of Nigerian donors and healthcare providers in our mission to save lives through comprehensive medical resource sharing.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-24 h-24 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-glow`}>
                  <i className={`${stat.icon} text-white text-4xl`}></i>
                </div>
                <div className="text-5xl font-black text-white mb-3">{stat.value}</div>
                <div className="text-pink-100 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="floating-element absolute top-20 left-20 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="floating-element absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="floating-element absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              Ready to 
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> Save Lives?</span>
            </h2>
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Whether you're looking to donate medical resources or need to find available supplies across Nigeria, 
              our network makes it easy to connect with healthcare facilities instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <Link to="/donate">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 shadow-2xl hover:shadow-pink-500/30 text-xl px-12 py-6">
                  <i className="ri-gift-fill mr-4"></i>
                  Start Donating Today
                </Button>
              </Link>
              <Link to="/facilities">
                <Button variant="glass" size="lg" className="w-full sm:w-auto text-white shadow-2xl text-xl px-12 py-6">
                  <i className="ri-hospital-line mr-4"></i>
                  Find Facilities
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-12 text-gray-400">
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-shield-check-line mr-3 text-green-400 text-xl"></i>
                <span className="font-medium">100% Secure</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-time-line mr-3 text-blue-400 text-xl"></i>
                <span className="font-medium">24/7 Available</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-2xl">
                <i className="ri-heart-pulse-line mr-3 text-pink-400 text-xl"></i>
                <span className="font-medium">Life Saving</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';

export default function Facilities() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  
  const resourceTypes = [
    { value: 'blood', label: 'Blood & Blood Products' },
    { value: 'plasma', label: 'Plasma' },
    { value: 'platelets', label: 'Platelets' },
    { value: 'oxygen', label: 'Oxygen Cylinders' },
    { value: 'concentrators', label: 'Oxygen Concentrators' },
    { value: 'medicines', label: 'Medicines & Vaccines' },
    { value: 'ppe', label: 'PPE & Medical Kits' },
    { value: 'lab', label: 'Lab Consumables' }
  ];

  const facilityTypes = [
    { value: 'hospital', label: 'Hospitals' },
    { value: 'clinic', label: 'Clinics' },
    { value: 'bloodbank', label: 'Blood Banks' },
    { value: 'pharmacy', label: 'Pharmacies' },
    { value: 'laboratory', label: 'Laboratories' },
    { value: 'emergency', label: 'Emergency Centers' }
  ];
  
  const facilities = [
    {
      id: 1,
      name: 'Lagos University Teaching Hospital Medical Center',
      address: 'Idi-Araba, Surulere, Lagos State',
      distance: '2.5 km',
      type: 'Teaching Hospital',
      availability: { 
        blood: { 'A+': 15, 'A-': 8, 'B+': 12, 'B-': 5, 'AB+': 3, 'AB-': 2, 'O+': 20, 'O-': 6 },
        oxygen: { cylinders: 25, concentrators: 8 },
        medicines: { vaccines: 150, antibiotics: 89, painkillers: 200 },
        ppe: { masks: 500, gloves: 1200, gowns: 80 }
      },
      status: 'Open',
      phone: '+234 803 123 4567',
      hours: '24/7',
      rating: 4.8,
      image: 'https://readdy.ai/api/search-image?query=Modern%20Nigerian%20teaching%20hospital%20exterior%20with%20comprehensive%20medical%20services%2C%20clean%20white%20building%20with%20medical%20cross%20symbol%2C%20professional%20healthcare%20environment%20in%20Lagos%20Nigeria%2C%20people%20entering%20and%20leaving%2C%20bright%20daylight%2C%20contemporary%20architecture%2C%20multiple%20medical%20departments&width=400&height=250&seq=facility1-multi-ng&orientation=landscape',
      specialties: ['Emergency Care', 'Blood Bank', 'Pharmacy', 'Lab Services', 'ICU', 'Surgery'],
      verified: true
    },
    {
      id: 2,
      name: 'National Hospital Abuja Medical Supply Center',
      address: 'Central Business District, Abuja FCT',
      distance: '1.8 km',
      type: 'Government Hospital',
      availability: { 
        blood: { 'A+': 22, 'A-': 12, 'B+': 6, 'B-': 8, 'AB+': 9, 'AB-': 4, 'O+': 18, 'O-': 10 },
        oxygen: { cylinders: 40, concentrators: 15 },
        medicines: { vaccines: 200, antibiotics: 120, painkillers: 300 },
        ppe: { masks: 800, gloves: 2000, gowns: 150 }
      },
      status: 'Open',
      phone: '+234 809 876 5432',
      hours: '6:00 AM - 10:00 PM',
      rating: 4.6,
      image: 'https://readdy.ai/api/search-image?query=Large%20Nigerian%20government%20hospital%20medical%20center%20building%20in%20Abuja%2C%20modern%20healthcare%20facility%20with%20glass%20windows%2C%20medical%20emergency%20entrance%2C%20ambulances%20parked%20outside%2C%20professional%20medical%20environment%20in%20Nigeria%2C%20comprehensive%20medical%20services&width=400&height=250&seq=facility2-multi-ng&orientation=landscape',
      specialties: ['Critical Care', 'Respiratory Support', 'Vaccination Center', 'Emergency Medicine'],
      verified: true
    },
    {
      id: 3,
      name: 'University College Hospital Ibadan',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      distance: '3.2 km',
      type: 'Teaching Hospital',
      availability: { 
        blood: { 'A+': 5, 'A-': 3, 'B+': 8, 'B-': 2, 'AB+': 1, 'AB-': 1, 'O+': 2, 'O-': 4 },
        oxygen: { cylinders: 12, concentrators: 3 },
        medicines: { vaccines: 75, antibiotics: 45, painkillers: 100 },
        ppe: { masks: 200, gloves: 400, gowns: 30 }
      },
      status: 'Closing Soon',
      phone: '+234 805 456 7890',
      hours: '8:00 AM - 6:00 PM',
      rating: 4.4,
      image: 'https://readdy.ai/api/search-image?query=University%20College%20Hospital%20Ibadan%20Nigeria%2C%20community%20health%20center%20building%2C%20smaller%20medical%20facility%20with%20welcoming%20entrance%2C%20Nigerian%20people%20walking%20in%20and%20out%2C%20friendly%20neighborhood%20healthcare%20setting%2C%20clean%20modern%20design&width=400&height=250&seq=facility3-multi-ng&orientation=landscape',
      specialties: ['Medical Training', 'Research', 'General Medicine', 'Pediatrics'],
      verified: false
    },
    {
      id: 4,
      name: 'Ahmadu Bello University Teaching Hospital',
      address: 'Shika, Zaria, Kaduna State',
      distance: '4.5 km',
      type: 'Teaching Hospital',
      availability: { 
        blood: { 'A+': 18, 'A-': 14, 'B+': 16, 'B-': 9, 'AB+': 7, 'AB-': 5, 'O+': 25, 'O-': 12 },
        oxygen: { cylinders: 30, concentrators: 12 },
        medicines: { vaccines: 180, antibiotics: 95, painkillers: 250 },
        ppe: { masks: 600, gloves: 1500, gowns: 100 }
      },
      status: 'Open',
      phone: '+234 807 234 5678',
      hours: '24/7',
      rating: 4.9,
      image: 'https://readdy.ai/api/search-image?query=Ahmadu%20Bello%20University%20hospital%20complex%20in%20Zaria%20Nigeria%2C%20large%20academic%20medical%20center%2C%20modern%20glass%20and%20steel%20architecture%2C%20Nigerian%20students%20and%20medical%20staff%20walking%20around%2C%20educational%20healthcare%20environment&width=400&height=250&seq=facility4-multi-ng&orientation=landscape',
      specialties: ['Academic Medicine', 'Research', 'Specialized Care', 'Training'],
      verified: true
    },
    {
      id: 5,
      name: 'Federal Medical Centre Katsina',
      address: 'Katsina, Katsina State',
      distance: '6.8 km',
      type: 'Federal Medical Center',
      availability: { 
        blood: { 'A+': 8, 'A-': 4, 'B+': 10, 'B-': 3, 'AB+': 2, 'AB-': 1, 'O+': 12, 'O-': 5 },
        oxygen: { cylinders: 20, concentrators: 6 },
        medicines: { vaccines: 100, antibiotics: 60, painkillers: 150 },
        ppe: { masks: 300, gloves: 800, gowns: 50 }
      },
      status: 'Open',
      phone: '+234 808 567 8901',
      hours: '24/7',
      rating: 4.7,
      image: 'https://readdy.ai/api/search-image?query=Federal%20Medical%20Centre%20Katsina%20Nigeria%2C%20emergency%20medical%20services%20building%2C%20urgent%20care%20facility%20with%20red%20cross%20symbols%2C%20ambulances%20and%20emergency%20vehicles%2C%20fast-paced%20medical%20environment%2C%20professional%20emergency%20healthcare%20setting%20in%20Northern%20Nigeria&width=400&height=250&seq=facility5-multi-ng&orientation=landscape',
      specialties: ['Emergency Medicine', 'Critical Care', 'General Surgery', 'Internal Medicine'],
      verified: true
    },
    {
      id: 6,
      name: 'Lagos State Medical Supplies Depot',
      address: 'Ikeja, Lagos State',
      distance: '5.2 km',
      type: 'Medical Supply Center',
      availability: { 
        blood: { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 },
        oxygen: { cylinders: 100, concentrators: 25 },
        medicines: { vaccines: 500, antibiotics: 300, painkillers: 800 },
        ppe: { masks: 2000, gloves: 5000, gowns: 500 }
      },
      status: 'Open',
      phone: '+234 806 345 6789',
      hours: '8:00 AM - 6:00 PM',
      rating: 4.5,
      image: 'https://readdy.ai/api/search-image?query=Lagos%20State%20medical%20supplies%20depot%20warehouse%2C%20large%20medical%20supply%20distribution%20center%2C%20trucks%20loading%20medical%20equipment%20and%20supplies%2C%20organized%20medical%20inventory%20storage%2C%20professional%20logistics%20operation%20in%20Lagos%20Nigeria&width=400&height=250&seq=facility6-multi-ng&orientation=landscape',
      specialties: ['Medical Supplies', 'Equipment Distribution', 'Bulk Orders', 'Emergency Supplies'],
      verified: true
    }
  ];
  
  const getStockLevel = (count: number) => {
    if (count === 0) return { level: 'out', color: 'danger' };
    if (count < 5) return { level: 'critical', color: 'danger' };
    if (count < 10) return { level: 'low', color: 'warning' };
    return { level: 'good', color: 'success' };
  };
  
  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Page Header */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30">
          <div className="absolute inset-0 opacity-20">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-pink-400/30 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-black text-gray-900 mb-6">
              Find Healthcare 
              <span className="gradient-text"> Facilities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Locate medical facilities across Nigeria and check real-time availability of blood, oxygen, 
              medicines, PPE, and medical supplies for your healthcare needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your location"
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Facility Type</label>
                <div className="relative">
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                  >
                    <option value="">All facilities</option>
                    {facilityTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <i className="ri-hospital-line absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                    <option value="availability">Availability</option>
                    <option value="name">Name</option>
                  </select>
                  <i className="ri-sort-asc absolute left-5 top-5 text-pink-500 text-xl"></i>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-2xl hover:shadow-pink-500/30" size="lg">
                  <i className="ri-search-line mr-3"></i>
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Facilities List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-gray-900">
              {facilities.length} Medical Facilities Found
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="p-3 text-gray-400 hover:text-pink-500 cursor-pointer glass rounded-xl">
                  <i className="ri-list-unordered text-xl"></i>
                </button>
                <button className="p-3 text-pink-500 cursor-pointer glass rounded-xl">
                  <i className="ri-grid-fill text-xl"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <Card key={facility.id} variant="glass" className="hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className="relative mb-6">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-48 object-cover object-top rounded-2xl"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Badge variant={facility.status === 'Open' ? 'success' : 'warning'} className="font-bold">
                      {facility.status}
                    </Badge>
                    {facility.verified && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                    <div className="flex items-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="text-sm font-bold text-gray-600">{facility.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center">
                      <i className="ri-map-pin-line mr-2 text-pink-500"></i>
                      {facility.address}
                    </p>
                    <p className="flex items-center">
                      <i className="ri-road-map-line mr-2 text-pink-500"></i>
                      {facility.distance} away
                    </p>
                    <p className="flex items-center">
                      <i className="ri-time-line mr-2 text-pink-500"></i>
                      {facility.hours}
                    </p>
                  </div>

                  <Badge variant="secondary" className="mb-4">{facility.type}</Badge>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Resource Availability</h4>
                  <div className="space-y-3">
                    {/* Blood Availability */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-drop-line mr-2 text-red-500"></i>
                        Blood
                      </span>
                      <div className="flex space-x-1">
                        {Object.entries(facility.availability.blood).slice(0, 3).map(([type, count]) => {
                          const stock = getStockLevel(count);
                          return (
                            <Badge key={type} variant={stock.color as any} className="text-xs">
                              {type}: {count}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Oxygen Availability */}
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

                    {/* Medicines Availability */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-capsule-line mr-2 text-green-500"></i>
                        Medicines
                      </span>
                      <div className="flex space-x-1">
                        <Badge variant="success" className="text-xs">
                          {facility.availability.medicines.vaccines}+ items
                        </Badge>
                      </div>
                    </div>

                    {/* PPE Availability */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <i className="ri-shield-cross-line mr-2 text-purple-500"></i>
                        PPE
                      </span>
                      <div className="flex space-x-1">
                        <Badge variant="success" className="text-xs">
                          {facility.availability.ppe.masks}+ items
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="pink" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {facility.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{facility.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={`tel:${facility.phone}`} 
                    className="flex-1"
                  >
                    <Button variant="glass" size="sm" className="w-full shadow-lg">
                      <i className="ri-phone-line mr-2"></i>
                      Call Now
                    </Button>
                  </a>
                  <Link to={`/facilities/${facility.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-16">
            <Button variant="glass" size="lg" className="shadow-2xl">
              Load More Facilities
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
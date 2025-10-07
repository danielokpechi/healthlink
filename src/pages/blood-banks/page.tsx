
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';

export default function BloodBanks() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const bloodBanks = [
    {
      id: 1,
      name: 'Lagos University Teaching Hospital Blood Bank',
      address: 'Idi-Araba, Surulere, Lagos State',
      distance: '2.5 km',
      availability: { 'A+': 15, 'A-': 8, 'B+': 12, 'B-': 5, 'AB+': 3, 'AB-': 2, 'O+': 20, 'O-': 6 },
      status: 'Open',
      phone: '+234 803 123 4567',
      hours: '24/7',
      rating: 4.8,
      image: 'https://readdy.ai/api/search-image?query=Modern%20Nigerian%20medical%20blood%20bank%20facility%20exterior%2C%20clean%20white%20building%20with%20medical%20cross%20symbol%2C%20professional%20healthcare%20environment%20in%20Lagos%20Nigeria%2C%20people%20entering%20and%20leaving%2C%20bright%20daylight%2C%20contemporary%20architecture&width=400&height=250&seq=bloodbank1-ng&orientation=landscape'
    },
    {
      id: 2,
      name: 'National Hospital Abuja Blood Centre',
      address: 'Central Business District, Abuja FCT',
      distance: '1.8 km',
      availability: { 'A+': 22, 'A-': 12, 'B+': 6, 'B-': 8, 'AB+': 9, 'AB-': 4, 'O+': 18, 'O-': 10 },
      status: 'Open',
      phone: '+234 809 876 5432',
      hours: '6:00 AM - 10:00 PM',
      rating: 4.6,
      image: 'https://readdy.ai/api/search-image?query=Large%20Nigerian%20hospital%20medical%20center%20building%20in%20Abuja%2C%20modern%20healthcare%20facility%20with%20glass%20windows%2C%20medical%20emergency%20entrance%2C%20ambulances%20parked%20outside%2C%20professional%20medical%20environment%20in%20Nigeria&width=400&height=250&seq=bloodbank2-ng&orientation=landscape'
    },
    {
      id: 3,
      name: 'University College Hospital Ibadan',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      distance: '3.2 km',
      availability: { 'A+': 5, 'A-': 3, 'B+': 8, 'B-': 2, 'AB+': 1, 'AB-': 1, 'O+': 2, 'O-': 4 },
      status: 'Closing Soon',
      phone: '+234 805 456 7890',
      hours: '8:00 AM - 6:00 PM',
      rating: 4.4,
      image: 'https://readdy.ai/api/search-image?query=University%20College%20Hospital%20Ibadan%20Nigeria%2C%20community%20health%20center%20building%2C%20smaller%20medical%20facility%20with%20welcoming%20entrance%2C%20Nigerian%20people%20walking%20in%20and%20out%2C%20friendly%20neighborhood%20healthcare%20setting%2C%20clean%20modern%20design&width=400&height=250&seq=bloodbank3-ng&orientation=landscape'
    },
    {
      id: 4,
      name: 'Ahmadu Bello University Teaching Hospital',
      address: 'Shika, Zaria, Kaduna State',
      distance: '4.5 km',
      availability: { 'A+': 18, 'A-': 14, 'B+': 16, 'B-': 9, 'AB+': 7, 'AB-': 5, 'O+': 25, 'O-': 12 },
      status: 'Open',
      phone: '+234 807 234 5678',
      hours: '24/7',
      rating: 4.9,
      image: 'https://readdy.ai/api/search-image?query=Ahmadu%20Bello%20University%20hospital%20complex%20in%20Zaria%20Nigeria%2C%20large%20academic%20medical%20center%2C%20modern%20glass%20and%20steel%20architecture%2C%20Nigerian%20students%20and%20medical%20staff%20walking%20around%2C%20educational%20healthcare%20environment&width=400&height=250&seq=bloodbank4-ng&orientation=landscape'
    },
    {
      id: 5,
      name: 'University of Nigeria Teaching Hospital',
      address: 'Ituku-Ozalla, Enugu State',
      distance: '5.2 km',
      availability: { 'A+': 11, 'A-': 7, 'B+': 13, 'B-': 6, 'AB+': 4, 'AB-': 3, 'O+': 15, 'O-': 8 },
      status: 'Open',
      phone: '+234 806 345 6789',
      hours: '7:00 AM - 9:00 PM',
      rating: 4.5,
      image: 'https://readdy.ai/api/search-image?query=University%20of%20Nigeria%20Teaching%20Hospital%20Enugu%2C%20metropolitan%20blood%20bank%20facility%2C%20urban%20medical%20center%20with%20modern%20signage%2C%20busy%20Nigerian%20city%20location%2C%20professional%20healthcare%20workers%2C%20clean%20contemporary%20building%20design&width=400&height=250&seq=bloodbank5-ng&orientation=landscape'
    },
    {
      id: 6,
      name: 'Federal Medical Centre Katsina',
      address: 'Katsina, Katsina State',
      distance: '6.8 km',
      availability: { 'A+': 8, 'A-': 4, 'B+': 10, 'B-': 3, 'AB+': 2, 'AB-': 1, 'O+': 12, 'O-': 5 },
      status: 'Open',
      phone: '+234 808 567 8901',
      hours: '24/7',
      rating: 4.7,
      image: 'https://readdy.ai/api/search-image?query=Federal%20Medical%20Centre%20Katsina%20Nigeria%2C%20emergency%20medical%20services%20building%2C%20urgent%20care%20facility%20with%20red%20cross%20symbols%2C%20ambulances%20and%20emergency%20vehicles%2C%20fast-paced%20medical%20environment%2C%20professional%20emergency%20healthcare%20setting%20in%20Northern%20Nigeria&width=400&height=250&seq=bloodbank6-ng&orientation=landscape'
    }
  ];
  
  const getStockLevel = (count: number) => {
    if (count < 5) return { level: 'critical', color: 'danger' };
    if (count < 10) return { level: 'low', color: 'warning' };
    return { level: 'good', color: 'success' };
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Blood Banks
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Locate blood banks in your area and check real-time availability of blood types. 
              Find the nearest facility for your donation or blood request needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                  <i className="ri-map-pin-line absolute left-3 top-3.5 text-gray-400"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <div className="relative">
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm appearance-none"
                  >
                    <option value="">All blood types</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <i className="ri-drop-line absolute left-3 top-3.5 text-gray-400"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm appearance-none"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                    <option value="availability">Availability</option>
                  </select>
                  <i className="ri-sort-asc absolute left-3 top-3.5 text-gray-400"></i>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full" size="lg">
                  <i className="ri-search-line mr-2"></i>
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Blood Banks List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {bloodBanks.length} Blood Banks Found
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-pink-500 cursor-pointer">
                <i className="ri-list-unordered text-xl"></i>
              </button>
              <button className="p-2 text-pink-500 cursor-pointer">
                <i className="ri-grid-fill text-xl"></i>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bloodBanks.map((bank) => (
              <Card key={bank.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="relative mb-4">
                  <img
                    src={bank.image}
                    alt={bank.name}
                    className="w-full h-48 object-cover object-top rounded-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={bank.status === 'Open' ? 'success' : 'warning'}>
                      {bank.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bank.name}</h3>
                    <div className="flex items-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="text-sm text-gray-600">{bank.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <i className="ri-map-pin-line mr-2 text-gray-400"></i>
                      {bank.address}
                    </p>
                    <p className="flex items-center">
                      <i className="ri-road-map-line mr-2 text-gray-400"></i>
                      {bank.distance} away
                    </p>
                    <p className="flex items-center">
                      <i className="ri-time-line mr-2 text-gray-400"></i>
                      {bank.hours}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Blood Availability</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(bank.availability).map(([type, count]) => {
                      const stock = getStockLevel(count);
                      return (
                        <div key={type} className="text-center">
                          <Badge variant={stock.color as any} size="md" className="w-full">
                            {type}
                          </Badge>
                          <div className="text-xs text-gray-5%0 mt-1">{count} units</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <a 
                      href={`tel:${bank.phone}`} 
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium cursor-pointer flex items-center"
                    >
                      <i className="ri-phone-line mr-1"></i>
                      Call Now
                    </a>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">From ₦15,000/pint</span>
                    </div>
                  </div>
                  <Link to={`/blood-banks/${bank.id}`}>
                    <Button size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Blood Banks
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

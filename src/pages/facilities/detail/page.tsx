import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';

export default function FacilityDetail() {
  const { id } = useParams();
  const [selectedResourceType, setSelectedResourceType] = useState('blood');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [selectedResource, setSelectedResource] = useState('');

  // Mock data for facility detail
  const facility = {
    id: 1,
    name: 'Lagos University Teaching Hospital Medical Center',
    address: 'Idi-Araba, Surulere, Lagos State, Nigeria',
    phone: '+234 803 123 4567',
    email: 'medical.center@luth.edu.ng',
    hours: '24/7',
    rating: 4.8,
    reviews: 156,
    type: 'Teaching Hospital',
    description: 'Leading medical facility serving Lagos and surrounding areas with comprehensive healthcare services including emergency care, specialized treatments, and medical resource distribution.',
    image: 'https://readdy.ai/api/search-image?query=Modern%20Nigerian%20teaching%20hospital%20medical%20center%20exterior%20with%20comprehensive%20healthcare%20services%2C%20clean%20white%20building%20with%20medical%20cross%20symbol%20in%20Lagos%20Nigeria%2C%20people%20entering%20and%20leaving%2C%20bright%20daylight%2C%20contemporary%20architecture%2C%20welcoming%20entrance%2C%20multiple%20medical%20departments&width=800&height=400&seq=facilitydetail1-multi-ng&orientation=landscape',
    resources: {
      blood: [
        { type: 'A+', quantity: 15, price: 15000, status: 'in-stock' },
        { type: 'A-', quantity: 8, price: 18000, status: 'in-stock' },
        { type: 'B+', quantity: 12, price: 16000, status: 'in-stock' },
        { type: 'B-', quantity: 3, price: 20000, status: 'low-stock' },
        { type: 'AB+', quantity: 6, price: 22000, status: 'in-stock' },
        { type: 'AB-', quantity: 2, price: 25000, status: 'low-stock' },
        { type: 'O+', quantity: 20, price: 14000, status: 'in-stock' },
        { type: 'O-', quantity: 4, price: 24000, status: 'low-stock' }
      ],
      oxygen: [
        { type: 'Oxygen Cylinders (10L)', quantity: 25, price: 8000, status: 'in-stock' },
        { type: 'Oxygen Cylinders (40L)', quantity: 15, price: 25000, status: 'in-stock' },
        { type: 'Oxygen Concentrators', quantity: 8, price: 150000, status: 'in-stock' },
        { type: 'Portable Oxygen Tanks', quantity: 12, price: 12000, status: 'in-stock' }
      ],
      medicines: [
        { type: 'COVID-19 Vaccines', quantity: 150, price: 2000, status: 'in-stock' },
        { type: 'Hepatitis B Vaccines', quantity: 89, price: 3500, status: 'in-stock' },
        { type: 'Antibiotics (Amoxicillin)', quantity: 200, price: 500, status: 'in-stock' },
        { type: 'Pain Relievers (Paracetamol)', quantity: 300, price: 200, status: 'in-stock' },
        { type: 'Insulin', quantity: 45, price: 8000, status: 'in-stock' },
        { type: 'Blood Pressure Medication', quantity: 120, price: 1500, status: 'in-stock' }
      ],
      ppe: [
        { type: 'N95 Face Masks', quantity: 500, price: 300, status: 'in-stock' },
        { type: 'Surgical Gloves (Box)', quantity: 1200, price: 2500, status: 'in-stock' },
        { type: 'Medical Gowns', quantity: 80, price: 1200, status: 'in-stock' },
        { type: 'Face Shields', quantity: 200, price: 800, status: 'in-stock' },
        { type: 'Hand Sanitizer (500ml)', quantity: 150, price: 1000, status: 'in-stock' },
        { type: 'Medical Caps', quantity: 300, price: 150, status: 'in-stock' }
      ]
    },
    services: [
      'Emergency Medical Care',
      'Blood Banking Services',
      'Pharmacy Services',
      'Laboratory Testing',
      'Oxygen Therapy',
      'Medical Equipment Rental',
      'Vaccination Services',
      'Medical Supply Distribution'
    ],
    certifications: [
      'NAFDAC Approved',
      'Nigerian Medical Association Certified',
      'ISO 9001 Certified',
      'WHO Standards Compliant'
    ],
    specialties: ['Emergency Care', 'Blood Bank', 'Pharmacy', 'Lab Services', 'ICU', 'Surgery']
  };

  const resourceCategories = [
    { key: 'blood', label: 'Blood & Blood Products', icon: 'ri-drop-line', color: 'text-red-500' },
    { key: 'oxygen', label: 'Oxygen & Respiratory', icon: 'ri-lungs-line', color: 'text-blue-500' },
    { key: 'medicines', label: 'Medicines & Vaccines', icon: 'ri-capsule-line', color: 'text-green-500' },
    { key: 'ppe', label: 'PPE & Medical Supplies', icon: 'ri-shield-cross-line', color: 'text-purple-500' }
  ];

  const getStockBadge = (quantity: number, status: string) => {
    if (status === 'out-of-stock' || quantity === 0) {
      return { variant: 'danger' as const, text: 'Out of Stock' };
    }
    if (quantity < 5) {
      return { variant: 'warning' as const, text: 'Low Stock' };
    }
    if (quantity < 10) {
      return { variant: 'pink' as const, text: 'Moderate Stock' };
    }
    return { variant: 'success' as const, text: 'In Stock' };
  };

  const handleRequestResource = (resourceType: string, resourceName: string) => {
    setSelectedResource(resourceName);
    setShowRequestModal(true);
  };

  const calculateTotal = () => {
    const currentResources = facility.resources[selectedResourceType as keyof typeof facility.resources];
    const resourceData = currentResources.find((r: any) => r.type === selectedResource);
    return resourceData ? resourceData.price * requestQuantity : 0;
  };

  const submitRequest = () => {
    console.log('Resource request submitted:', {
      facility: facility.name,
      resourceType: selectedResourceType,
      resource: selectedResource,
      quantity: requestQuantity,
      total: calculateTotal()
    });
    setShowRequestModal(false);
    setSelectedResource('');
    setRequestQuantity(1);
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30">
          <div className="absolute inset-0 opacity-20">
            <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-pink-400/30 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Link to="/facilities" className="text-pink-500 hover:text-pink-600 text-sm font-medium glass px-4 py-2 rounded-xl transition-all duration-300">
                  <i className="ri-arrow-left-line mr-2"></i>
                  Back to Facilities
                </Link>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                {facility.name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {facility.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <i className="ri-map-pin-line mr-4 text-pink-500 text-xl"></i>
                  <span className="font-medium">{facility.address}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <i className="ri-phone-line mr-4 text-pink-500 text-xl"></i>
                  <a href={`tel:${facility.phone}`} className="hover:text-pink-500 font-medium">
                    {facility.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-700">
                  <i className="ri-time-line mr-4 text-pink-500 text-xl"></i>
                  <span className="font-medium">{facility.hours}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <i className="ri-star-fill mr-4 text-yellow-400 text-xl"></i>
                  <span className="font-medium">{facility.rating} ({facility.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 shadow-2xl hover:shadow-pink-500/30">
                  <i className="ri-calendar-line mr-3"></i>
                  Schedule Visit
                </Button>
                <Button variant="glass" size="lg" className="shadow-2xl">
                  <i className="ri-phone-line mr-3"></i>
                  Call Now
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-[3rem] blur-3xl transform rotate-6 animate-pulse-slow"></div>
              <Card variant="glass" className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-80 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -right-6 glass rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
                      <i className="ri-hospital-fill text-white text-2xl"></i>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">{facility.rating}</div>
                      <div className="text-sm text-gray-500 font-medium">Rating</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Available 
              <span className="gradient-text"> Resources</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our comprehensive inventory of medical resources and supplies
            </p>
          </div>

          <Card variant="glass" className="shadow-2xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-4 mb-8 p-2 glass rounded-2xl">
              {resourceCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedResourceType(category.key)}
                  className={`flex items-center px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                    selectedResourceType === category.key
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <i className={`${category.icon} mr-3 text-xl ${
                    selectedResourceType === category.key ? 'text-white' : category.color
                  }`}></i>
                  {category.label}
                </button>
              ))}
            </div>

            {/* Resource List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-6 px-6 font-bold text-gray-900">Resource</th>
                    <th className="text-left py-6 px-6 font-bold text-gray-900">Quantity Available</th>
                    <th className="text-left py-6 px-6 font-bold text-gray-900">Price per Unit</th>
                    <th className="text-left py-6 px-6 font-bold text-gray-900">Status</th>
                    <th className="text-left py-6 px-6 font-bold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facility.resources[selectedResourceType as keyof typeof facility.resources].map((resource: any, index: number) => {
                    const stockBadge = getStockBadge(resource.quantity, resource.status);
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                              selectedResourceType === 'blood' ? 'bg-red-100' :
                              selectedResourceType === 'oxygen' ? 'bg-blue-100' :
                              selectedResourceType === 'medicines' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                              <i className={`${resourceCategories.find(c => c.key === selectedResourceType)?.icon} ${
                                selectedResourceType === 'blood' ? 'text-red-500' :
                                selectedResourceType === 'oxygen' ? 'text-blue-500' :
                                selectedResourceType === 'medicines' ? 'text-green-500' : 'text-purple-500'
                              } text-xl`}></i>
                            </div>
                            <span className="font-bold text-gray-900">{resource.type}</span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-lg font-medium text-gray-700">{resource.quantity} units</span>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-xl font-bold text-gray-900">₦{resource.price.toLocaleString()}</span>
                        </td>
                        <td className="py-6 px-6">
                          <Badge variant={stockBadge.variant} className="font-bold">
                            {stockBadge.text}
                          </Badge>
                        </td>
                        <td className="py-6 px-6">
                          {resource.quantity > 0 ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleRequestResource(selectedResourceType, resource.type)}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
                            >
                              <i className="ri-shopping-cart-line mr-2"></i>
                              Request
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" disabled>
                              Out of Stock
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 p-6 glass rounded-2xl">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-500 mt-1 mr-3 text-xl"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-2">Pricing Information</p>
                  <p className="text-blue-700 leading-relaxed">
                    Prices are set by individual facilities and may vary based on resource type, processing costs, and availability. 
                    All prices include handling, storage, and distribution fees. Prices shown in Nigerian Naira (₦).
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Services & Certifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card variant="glass" className="shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 mb-8">
                <i className="ri-service-line mr-3 text-pink-500"></i>
                Services Offered
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {facility.services.map((service, index) => (
                  <div key={index} className="flex items-center p-4 glass rounded-xl">
                    <i className="ri-check-line mr-4 text-green-500 text-xl"></i>
                    <span className="font-medium text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card variant="glass" className="shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 mb-8">
                <i className="ri-award-line mr-3 text-pink-500"></i>
                Certifications & Specialties
              </h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-700 mb-4">Certifications</h4>
                <div className="grid grid-cols-1 gap-3">
                  {facility.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-3 glass rounded-xl">
                      <i className="ri-shield-check-line mr-3 text-blue-500 text-lg"></i>
                      <span className="font-medium text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-700 mb-4">Medical Specialties</h4>
                <div className="flex flex-wrap gap-3">
                  {facility.specialties.map((specialty, index) => (
                    <Badge key={index} variant="pink" className="font-medium">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-8">
              <i className="ri-map-pin-line mr-3 text-pink-500"></i>
              Location & Directions
            </h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Facility Location"
              ></iframe>
            </div>
          </Card>
        </div>
      </section>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card variant="glass" className="w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                Request Resource
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-2 glass rounded-xl"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="text-sm text-pink-800">
                  <p className="mb-2"><strong>Facility:</strong> {facility.name}</p>
                  <p className="mb-2"><strong>Resource:</strong> {selectedResource}</p>
                  <p><strong>Price per Unit:</strong> ₦{facility.resources[selectedResourceType as keyof typeof facility.resources].find((r: any) => r.type === selectedResource)?.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Quantity
                </label>
                <select
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-8 input-glass rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-medium"
                >
                  {[1, 2, 3, 4, 5, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <div className="flex justify-between items-center text-xl font-black">
                  <span>Total Cost:</span>
                  <span className="text-pink-500">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  variant="glass" 
                  className="flex-1"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 shadow-2xl"
                  onClick={submitRequest}
                >
                  <i className="ri-send-plane-fill mr-2"></i>
                  Submit Request
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
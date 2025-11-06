
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import type { BloodTypeData } from '../../../firebase/types';
import bloodBankImg from '../../../assets/images/blood-bank.jpg';
import { useNavigate } from 'react-router-dom';

export default function BloodBankDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [bloodBank, setBloodBank] = useState<any>(null)

  useEffect(() => {
    const fetchBank = async () => {

      // get document
      const docRef = doc(db, "blood_banks", id as string);
      const snap = await getDoc(docRef);

      if (!snap.exists()) return;

      const bank:any = { id: snap.id, ...snap.data() };

      // get inventory
      const invRef = collection(db, "blood_banks", snap.id, "inventory");
      const invSnap = await getDocs(invRef);

      const bloodTypes: BloodTypeData[] = [];
      invSnap.forEach((d) => {
        bloodTypes.push({
          type: d.id,
          quantity: d.data().quantity,
          price: d.data().price,
          status: d.data().available ? "in-stock" : "out-of-stock"
        })
      });

      bank.bloodTypes = bloodTypes;

      setBloodBank(bank);
    };

    fetchBank();
  }, [id]);

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

  const handleRequestBlood = (bloodType: string) => {
    navigate(`/request?bank=${bloodBank.id}&type=${bloodType}`);
  };

  const calculateTotal = () => {
    const bloodTypeData = bloodBank.bloodTypes.find(
      (bt: BloodTypeData) => bt.type === selectedBloodType
    );
    return bloodTypeData ? bloodTypeData.price * requestQuantity : 0;
  };

  const submitRequest = () => {

    console.log('Blood request submitted:', {
      bloodBank: bloodBank.name,
      bloodType: selectedBloodType,
      quantity: requestQuantity,
      total: calculateTotal()
    });
    setShowRequestModal(false);
    setSelectedBloodType('');
    setRequestQuantity(1);
  };

  if (!bloodBank) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Link to="/blood-banks" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                  <i className="ri-arrow-left-line mr-1"></i>
                  Back to Blood Banks
                </Link>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {bloodBank.name}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {bloodBank.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <i className="ri-map-pin-line mr-3 text-pink-500"></i>
                  <span>{bloodBank.address}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <i className="ri-phone-line mr-3 text-pink-500"></i>
                  <a href={`tel:${bloodBank.contactPhone}`} className="hover:text-pink-500">
                    {bloodBank.contactPhone}
                  </a>
                </div>
                <div className="flex items-center text-gray-700">
                  <i className="ri-mail-line mr-3 text-pink-500"></i>
                  <span>{bloodBank.contactEmail}</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button size="lg">
                  <i className="ri-calendar-line mr-2"></i>
                  <Link to="/donate">Schedule Donation</Link>
                </Button>
              </div>
            </div>
            
            <div>
              <img
                src={bloodBankImg}
                alt={bloodBank.name}
                className="w-full h-80 object-fit object-top rounded-lg "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types & Pricing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Blood Types & Pricing
            </h2>
            <p className="text-gray-600">
              Current availability and pricing for all blood types. Prices are set per pint.
            </p>
          </div>
          
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Blood Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Quantity Available</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Price per Pint</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodBank.bloodTypes.map((bloodType: BloodTypeData) => {
                    const stockBadge = getStockBadge(bloodType.quantity, bloodType.status);
                    return (
                      <tr key={bloodType.type} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                              <i className="ri-drop-line text-pink-500"></i>
                            </div>
                            <span className="font-semibold text-gray-900">{bloodType.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-700">{bloodType.quantity} units</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-lg font-semibold text-gray-900">₦{bloodType.price.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={stockBadge.variant}>
                            {stockBadge.text}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {bloodType.quantity > 0 ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleRequestBlood(bloodType.type)}
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
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-500 mt-0.5 mr-2"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Pricing Information</p>
                  <p className="text-blue-700">
                    Prices are set by individual blood banks and may vary based on blood type rarity and processing costs. 
                    All prices include testing, processing, and storage fees. Prices shown in Nigerian Naira (₦).
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Request Blood
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="text-sm text-pink-800">
                  <p><strong>Blood Bank:</strong> {bloodBank.name}</p>
                  <p><strong>Blood Type:</strong> {selectedBloodType}</p>
                  <p><strong>Price per Pint:</strong> ₦{bloodBank.bloodTypes.find((bt: BloodTypeData) => bt.type === selectedBloodType)?.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (pints)
                </label>
                <select
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Cost:</span>
                  <span className="text-pink-500">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
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

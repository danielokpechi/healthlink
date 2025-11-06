
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import bloodBankImg from '../../assets/images/blood-bank.jpg';

export default function BloodBanks() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [filteredBanks, setFilteredBanks] = useState<any[]>([]);
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanks = async () => {
      const q = query(
        collection(db, "blood_banks"),
        where("approved", "==", true)
      );

      const snapshot = await getDocs(q);

      const banks:any[] = [];

      for (const docSnap of snapshot.docs) {
      const bankData:any = { id: docSnap.id, ...docSnap.data() };

      const invRef = collection(db, "blood_banks", docSnap.id, "inventory");
      const invSnap = await getDocs(invRef);

      const availability:any = {};
      let lowestPrice = Infinity;

      invSnap.forEach(invDoc => {
        const data:any = invDoc.data();

        const type = invDoc.id;

        availability[type] = {
          quantity: data.quantity,
          price: data.price,
          available: data.available
        };

        if (data.price && data.price < lowestPrice) {
          lowestPrice = data.price;
        }
      });

      bankData.availability = availability;
      bankData.amountPerPint = lowestPrice === Infinity ? null : lowestPrice;

      banks.push(bankData);
    }

      setBloodBanks(banks);
      setFilteredBanks(banks);
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    let filtered = [...bloodBanks];

    if (searchLocation.trim() !== "") {
      filtered = filtered.filter(bank =>
        bank.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
        bank.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // filter by blood type selected
    if (selectedBloodType.trim() !== "") {
      filtered = filtered.filter(bank => {
        return bank.availability && bank.availability[selectedBloodType]?.available === true;
      });
    }

    // sort by availability
    if (sortBy === "availability") {
      filtered = filtered.filter(bank => {
        return Object.values(bank.availability).some((val: any) => val.available === true);
      });

      filtered = filtered.sort((a, b) => {
        const bCount: number = Object.values(b.availability).reduce((acc: number, val: any) => acc + (val.available ? 1 : 0), 0);
        const aCount: number = Object.values(a.availability).reduce((acc: number, val: any) => acc + (val.available ? 1 : 0), 0);
        return bCount - aCount;
      });
    }
    setFilteredBanks(filtered);

  }, [searchLocation, selectedBloodType, sortBy, bloodBanks]);
  
  const getStockLevel = (count: number) => {
    if (count < 5) return { level: 'critical', color: 'danger' };
    if (count < 10) return { level: 'low', color: 'warning' };
    return { level: 'good', color: 'success' };
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Blood Banks
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View blood banks in your area and check real-time availability of blood types. 
              Find the nearest facility for your donation or blood request needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="rating">Select</option>
                    <option value="availability">Availability</option>
                  </select>
                  <i className="ri-sort-asc absolute left-3 top-3.5 text-gray-400"></i>
                </div>
              </div>
              
              {/* <div className="flex items-end">
                <Button className="w-full" size="lg">
                  <i className="ri-search-line mr-2"></i>
                  Search
                </Button>
              </div> */}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map((bank) => (
              <Card key={bank.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="relative mb-4">
                  <img
                    src={bloodBankImg}
                    alt={bank.name}
                    className="w-full h-48 object-cover object-top rounded-lg"
                  />
                  <div className="absolute top-3 right-3">
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bank.name}</h3>
                    <div className="flex items-center space-x-1">
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <i className="ri-map-pin-line mr-2 text-gray-400"></i>
                      {bank.address}
                    </p>
                    <p className="flex items-center">
                      <i className="ri-mail-line mr-2 text-gray-400"></i>
                      {bank.contactEmail} 
                    </p>
                    <p className="flex items-center">
                      <i className="ri-phone-line mr-2 text-gray-400"></i>
                      {bank.contactPhone}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Blood Availability</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {bank.availability && Object.entries(bank.availability).map(([type, val]: any) => {
                      const stock = getStockLevel(val.quantity);
                      return (
                        <div key={type} className="text-center">
                          <Badge variant={stock.color as any} size="md" >
                            {type}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">{val.quantity} units</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">From ₦{bank.amountPerPint}/pint</span>
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
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

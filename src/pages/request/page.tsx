
import { useState, useEffect, useMemo } from 'react';
// import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
// import Badge from '../../components/base/Badge';
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function RequestBlood() {
  
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: '',
    location: '',
    patientName: '',
    totalAmount: '',
    contactNumber: '',
    unitsNeeded: '',
    medicalCondition: '',
    additionalNotes: ''
  });
  const [unitPrice, setUnitPrice] = useState<number | null>(null);

  const totalAmount = useMemo(() => {
    const units = Number(formData.unitsNeeded || 0);
    return unitPrice != null ? units * unitPrice : 0;
  }, [formData.unitsNeeded, unitPrice]);

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

  useEffect(() => {
    if (!formData.location || !formData.bloodType) return;

    const getPrice = async () => {
      const bank = bloodBanks.find(b => b.id === formData.location);
      if (!bank) return;

      const invRef = collection(db, "blood_banks", bank.id, "inventory");
      const snap = await getDocs(invRef);

      snap.forEach(d => {
        if (d.id === formData.bloodType) {
          const data = d.data();
          if (data.price) setUnitPrice(data.price);
        }
      });
    };

    getPrice();
  }, [formData.location, formData.bloodType, bloodBanks]);



  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Within 2 hours)', color: 'red' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', color: 'orange' },
    { value: 'routine', label: 'Routine (Within 7 days)', color: 'green' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "blood_requests"), {
      ...formData,
      totalAmount: totalAmount,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Blood request submitted successfully!");

    setFormData({
      bloodType: '',
      urgency: '',
      location: '',
      patientName: '',
      totalAmount: '',
      contactNumber: '',
      unitsNeeded: '',
      medicalCondition: '',
      additionalNotes: ''
    });
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
                  <label className="block text-sm font-bold text-gray-700 mb-4">Select Blood Bank *</label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-8 py-5 input-glass rounded-2xl text-base font-medium appearance-none"
                    >
                      <option value="">Choose Blood Bank</option>
                      {bloodBanks.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <i className="ri-hospital-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Pints Needed *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="unitsNeeded"
                      value={formData.unitsNeeded}
                      onChange={handleInputChange}
                      placeholder="Number of pints"
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
                  <label className="block text-sm font-bold text-gray-700 mb-4">Total Amount (₦) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="totalAmount"
                      value={unitPrice == null ? '—' : `₦${totalAmount.toLocaleString()}`}
                      readOnly
                      className="w-full pl-14 pr-4 py-5 input-glass rounded-2xl text-base font-medium placeholder-gray-400"
                    />
                    <i className="ri-cash-line absolute left-5 top-5 text-red-500 text-xl"></i>
                  </div>

                  {unitPrice != null && (
                    <p className="text-xs text-gray-500 mt-1">
                      ₦{unitPrice.toLocaleString()} per pint × {formData.unitsNeeded || 0} pint(s)
                    </p>
                  )}
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
                  disabled={!formData.bloodType || !formData.location}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl hover:shadow-blue-500/30"
                  size="lg"
                >
                      Blood Banks
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


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'donor' | 'bloodbank'>('donor');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    bloodType: '',
    dateOfBirth: '',
    organizationName: '',
    licenseNumber: '',
    address: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('bloodlink_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.type === 'donor') {
        navigate('/profile');
      } else if (user.type === 'bloodbank') {
        navigate('/blood-banks/dashboard');
      }
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (authMode === 'signup') {
      if (activeTab === 'donor') {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
          alert('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          alert('Password must be at least 6 characters long');
          return false;
        }
      } else {
        if (!formData.organizationName || !formData.licenseNumber || !formData.address || !formData.email || !formData.phone) {
          alert('Please fill in all required fields');
          return false;
        }
      }
    } else {
      if (!formData.email || !formData.password) {
        alert('Please enter your email and password');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (authMode === 'login') {
      // Mock login logic
      const userData = {
        id: Date.now(),
        email: formData.email,
        type: activeTab,
        firstName: activeTab === 'donor' ? 'John' : 'Lagos University Teaching Hospital',
        lastName: activeTab === 'donor' ? 'Doe' : 'Blood Bank',
        organizationName: activeTab === 'bloodbank' ? 'Lagos University Teaching Hospital Blood Bank' : undefined,
        phone: formData.phone || '(555) 123-4567',
        bloodType: formData.bloodType || 'O+',
        dateOfBirth: formData.dateOfBirth || '1990-01-01',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('bloodlink_user', JSON.stringify(userData));
      localStorage.setItem('bloodlink_auth_token', 'mock_token_' + Date.now());

      // Redirect based on user type
      if (activeTab === 'donor') {
        navigate('/profile');
      } else if (activeTab === 'bloodbank') {
        navigate('/blood-banks/dashboard');
      }
    } else {
      // Mock signup logic - save user data
      const userData = {
        id: Date.now(),
        email: formData.email,
        type: activeTab,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bloodType: formData.bloodType,
        dateOfBirth: formData.dateOfBirth,
        organizationName: formData.organizationName,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        signupTime: new Date().toISOString()
      };

      if (activeTab === 'bloodbank') {
        // For blood bank registration, show success message
        setShowSuccess(true);
        setTimeout(() => {
          setAuthMode('login');
          setShowSuccess(false);
          // Clear form data
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            bloodType: '',
            dateOfBirth: '',
            organizationName: '',
            licenseNumber: '',
            address: ''
          });
        }, 3000);
      } else {
        // For donor registration, auto-login
        localStorage.setItem('bloodlink_user', JSON.stringify(userData));
        localStorage.setItem('bloodlink_auth_token', 'mock_token_' + Date.now());
        navigate('/profile');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>

      <Header />
      
      <section className="py-20 relative z-10">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-lg shadow-pink-500/20 mb-6">
              <i className="ri-heart-pulse-fill text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {authMode === 'login' ? 'Welcome Back' : 'Join BloodLink'}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {authMode === 'login' 
                ? 'Sign in to your account to continue saving lives'
                : 'Create your account and start making a difference'
              }
            </p>
          </div>

          {/* Main Auth Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>

            {authMode === 'login' ? (
              <>
                {/* User Type Selection for Login */}
                <div className="flex mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setActiveTab('donor')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'donor'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-user-heart-line mr-2"></i>
                    Donor/User
                  </button>
                  <button
                    onClick={() => setActiveTab('bloodbank')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'bloodbank'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-hospital-line mr-2"></i>
                    Blood Bank
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm transition-all duration-200 bg-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm transition-all duration-200 bg-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-pink-500/30 text-white font-semibold py-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="ri-loader-4-line mr-2 animate-spin"></i>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="ri-login-box-line mr-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium cursor-pointer transition-colors duration-200"
                    >
                      Don't have an account? Sign up here
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Tab Switcher for Signup */}
                <div className="flex mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setActiveTab('donor')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'donor'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-user-heart-line mr-2"></i>
                    Donor/User
                  </button>
                  <button
                    onClick={() => setActiveTab('bloodbank')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'bloodbank'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-hospital-line mr-2"></i>
                    Blood Bank
                  </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm">Registration Submitted!</h4>
                        <p className="text-green-700 text-xs">You'll receive login credentials once approved.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signup Forms */}
                {activeTab === 'donor' ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blood Type
                        </label>
                        <select
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                        >
                          <option value="">Select type</option>
                          {bloodTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg text-white font-semibold py-3" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="ri-loader-4-line mr-2 animate-spin"></i>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="ri-user-add-line mr-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-pink-500 hover:text-pink-600 text-sm font-medium cursor-pointer transition-colors duration-200"
                      >
                        Already have an account? Sign in
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Blood Bank Registration
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Registration requires offline verification for security
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facility Name *
                        </label>
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Number *
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg text-white font-semibold py-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="ri-loader-4-line mr-2 animate-spin"></i>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-fill mr-2"></i>
                            Submit Application
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center pt-4">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-pink-500 hover:text-pink-600 text-sm font-medium cursor-pointer transition-colors duration-200"
                      >
                        Already registered? Sign in
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Back to Home Link */}
          <div className="text-center mt-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-pink-500 text-sm font-medium transition-colors duration-200">
              <i className="ri-arrow-left-line mr-2"></i>
              Back to BloodLink Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
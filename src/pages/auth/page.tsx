
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import { signUpDonorProfile, signUpBloodBank, signIn as firebaseSignIn } from '../../firebase/auth';
import { getUserProfile } from '../../firebase/services';
import { useNotification } from "../../context/NotificationContext";

export default function Auth() {
  const { notify } = useNotification();

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
        navigate('/donor/dashboard');
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
          notify({ type:"error", message:"Please fill in all required fields" });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          notify({ type:"error", message:"Passwords do not match" });
          return false;
        }
        if (formData.password.length < 6) {
          notify({ type:"error", message:"Password must be at least 6 characters long" });
          return false;
        }
      } else {
        if (!formData.organizationName || !formData.licenseNumber || !formData.address || !formData.email || !formData.phone) {
          notify({ type:"error", message:"Please fill in all required fields" });
          return false;
        }
      }
    } else {
      if (!formData.email || !formData.password) {
        notify({ type:"error", message:"Please enter your email and password" });
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
      try {
        const userCredential = await firebaseSignIn(formData.email, formData.password);
        const uid = userCredential.user.uid;

        const userDoc = await getUserProfile(uid);
        if (!userDoc.exists()) {
          // If profile missing, sign out and show error
          notify({ type:"error", message:"User profile not found. Please contact support." });
          return;
        }

        const raw = userDoc.data() as any;
        const rawType = (raw.userType || raw.type || '').toString();
        const normalizedType = rawType.toLowerCase().includes('blood') ? 'bloodbank' : rawType.toLowerCase().includes('admin') ? 'superadmin' : 'donor';
        const userData = {
          id: uid,
          // keep original fields
          ...raw,
          // normalized type and name fields for UI
          type: normalizedType,
          firstName: raw.firstName || (raw.fullName ? raw.fullName.split(' ')[0] : ''),
          lastName: raw.lastName || (raw.fullName ? raw.fullName.split(' ').slice(1).join(' ') : ''),
        };
        // Ensure the selected login tab matches the user's role to prevent role spoofing
        const expectedType = activeTab === 'donor' ? 'donor' : 'bloodBank';
        if (userData.userType !== expectedType && userData.userType !== 'superAdmin') {
          // Sign out the user to be safe
          try {
            // firebaseSignIn already signed them in; sign them out
            await import('../../firebase/auth').then(m => m.signOut());
          } catch (e) {
            console.warn('Error signing out after role mismatch', e);
          }
          notify({ 
            type:"error", 
            message:`You are signing in as ${activeTab === 'donor' ? 'Donor' : 'Blood Bank'}. Your account is registered as ${userData.userType}. Please choose the correct login type.`  
          });
          setIsLoading(false);
          return;
        }
        localStorage.setItem('bloodlink_user', JSON.stringify(userData));
        // token stored by Firebase; keep a simple marker
        localStorage.setItem('bloodlink_auth_token', 'firebase_auth_' + Date.now());

        // Redirect based on user type
        if (userData.userType === 'donor') {
          navigate('/donor/dashboard');
        } else if (userData.userType === 'bloodBank') {
          navigate('/blood-banks/dashboard');
        } else if (userData.userType === 'superAdmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } catch (err: any) {
        console.error('Login error', err);
        notify({ type:"error", message: err?.message || 'Login failed' });
      }
    } else {
        try {
          if (activeTab === 'bloodbank') {
            // Create blood bank user and documents
            const userProfileData = {
              fullName: formData.organizationName || '',
              email: formData.email,
              userType: 'bloodBank',
              phone: formData.phone || '',
              address: formData.address || ''
            };

            const bloodBankData = {
              name: formData.organizationName || '',
              address: formData.address || '',
              licenseNumber: formData.licenseNumber || '',
              contactEmail: formData.email,
              contactPhone: formData.phone || '',
              approved: false,
              inventory: {},
            };

            await signUpBloodBank(formData.email, formData.password, userProfileData as any, bloodBankData as any);
            setShowSuccess(true);
            setTimeout(() => {
              setAuthMode('login');
              setShowSuccess(false);
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
            // Donor signup with Firestore profile
            const userProfileData = {
              fullName: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              userType: 'donor',
              phone: formData.phone || '',
              address: ''
            };

            // Create Auth user and Firestore profile
            const userCredential = await signUpDonorProfile(formData.email, formData.password, userProfileData as any);
            // Normalize and store profile in localStorage so dashboards can read it
            try {
              const newUid = userCredential.user.uid;
              const createdDoc = await getUserProfile(newUid);
              const raw = createdDoc.exists() ? (createdDoc.data() as any) : userProfileData;
              const rawType = (raw.userType || raw.type || '').toString();
              const normalizedType = rawType.toLowerCase().includes('blood') ? 'bloodbank' : rawType.toLowerCase().includes('admin') ? 'superadmin' : 'donor';
              const normalized = {
                id: newUid,
                ...raw,
                type: normalizedType,
                firstName: raw.firstName || (raw.fullName ? raw.fullName.split(' ')[0] : formData.firstName),
                lastName: raw.lastName || (raw.fullName ? raw.fullName.split(' ').slice(1).join(' ') : formData.lastName),
              };
              localStorage.setItem('bloodlink_user', JSON.stringify(normalized));
              localStorage.setItem('bloodlink_auth_token', 'firebase_auth_' + Date.now());
            } catch (e) {
              console.warn('Failed to persist created user to localStorage', e);
            }

            navigate('/profile');
          }
        } catch (err: any) {
          console.error('Signup error', err);
          notify({ type:"error", message: err?.message || "Signup failed." });
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
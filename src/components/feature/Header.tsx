import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../base/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Request Resources', href: '/request' },
    { name: 'Donate Resources', href: '/donate' },
  ];

  useEffect(() => {
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn('Sign out failed, clearing local state', e);
      try { localStorage.removeItem('bloodlink_user'); } catch {}
      try { localStorage.removeItem('bloodlink_auth_token'); } catch {}
    }
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 animate-glow">
              <i className="ri-heart-pulse-fill text-white text-2xl"></i>
            </div>
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                HealthLink
              </div>
              <div className="text-xs text-gray-500 font-medium -mt-1">Healthcare Resources Network</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-pink-500 ${
                  isActive(item.href)
                    ? 'text-pink-500 font-bold'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user.userType === 'bloodbank'
                        ? user.organizationName || user.fullName
                        : user.userType === 'superadmin'
                          ? user.organizationName || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`
                          : user.fullName || `${user.firstName || ''} ${user.lastName || ''}`}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.userType === 'bloodbank'
                        ? 'Blood Bank'
                        : user.userType === 'superadmin'
                          ? 'Admin'
                          : 'Donor'}
                    </div>
                  </div>
                </div>
                <Link
                  to={
                    user.userType === 'bloodbank'
                      ? '/blood-banks/dashboard'
                      : user.userType === 'superadmin'
                        ? '/admin/dashboard'
                        : '/donor/dashboard'
                  }
                >
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500">
                    <i className="ri-dashboard-line mr-2"></i>
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-500"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-pink-500">
                    <i className="ri-login-box-line mr-2"></i>
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg hover:shadow-pink-500/30">
                    <i className="ri-user-add-line mr-2"></i>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass hover:bg-pink-50 transition-colors duration-200"
          >
            <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-4">
              {publicNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-pink-500 bg-pink-50 font-bold'
                      : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-white text-sm"></i>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {user.userType === 'bloodbank'
                              ? user.organizationName || user.firstName
                              : `${user.firstName || ''} ${user.lastName || ''}`}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {user.userType === 'bloodbank' ? 'Blood Bank' : user.userType === 'superadmin' ? 'Admin' : 'Donor'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={
                        user.userType === 'bloodbank'
                          ? '/blood-banks/dashboard'
                          : user.userType === 'superadmin'
                            ? '/admin/dashboard'
                            : '/donor/dashboard'
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                        <i className="ri-dashboard-line mr-2"></i>
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-700"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                        <i className="ri-login-box-line mr-2"></i>
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                        <i className="ri-user-add-line mr-2"></i>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

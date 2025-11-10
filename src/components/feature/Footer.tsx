
import { Link } from 'react-router-dom';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Donate Resources', href: '/donate' },
    { name: 'Request Resources', href: '/request' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const resourceLinks = [
    { name: 'Blood Banks', href: '/blood-banks' },
    { name: 'Medical Facilities', href: '/blood-banks' },
    { name: 'Emergency Resources', href: '/emergency' },
    { name: 'Health Education', href: '/education' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="floating-element absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="floating-element absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 animate-glow">
                <i className="ri-heart-pulse-fill text-white text-2xl"></i>
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  HealthLink
                </div>
                <div className="text-xs text-gray-400 font-medium -mt-1">Healthcare Resources Network</div>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Connecting healthcare resources across Nigeria to save lives. Join our network of donors, 
              medical facilities, and healthcare providers making a difference every day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-500/20 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer">
                <i className="ri-facebook-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-500/20 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer">
                <i className="ri-twitter-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-500/20 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer">
                <i className="ri-instagram-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-500/20 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer">
                <i className="ri-linkedin-fill text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-pink-400 text-sm transition-colors duration-300 flex items-center group"
                  >
                    <i className="ri-arrow-right-s-line mr-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-pink-400 text-sm transition-colors duration-300 flex items-center group"
                  >
                    <i className="ri-arrow-right-s-line mr-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-pink-400 text-sm transition-colors duration-300 flex items-center group"
                  >
                    <i className="ri-arrow-right-s-line mr-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-white mb-3">Emergency Hotline</h4>
              <a href="tel:+234-911" className="text-pink-400 hover:text-pink-300 font-bold text-lg transition-colors duration-300">
                <i className="ri-phone-fill mr-2"></i>
                911
              </a>
              <p className="text-gray-400 text-xs mt-1">24/7 Emergency Medical Support</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 HealthLink. All rights reserved. Saving lives across Nigeria.
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <i className="ri-shield-check-line text-green-400"></i>
                <span>Verified & Secure Platform</span>
              </div>
              <a 
                href="https://readdy.ai/?origin=logo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 text-sm transition-colors duration-300"
              >
                Powered by Readdy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

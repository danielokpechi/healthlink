import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function AccessRevoked() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/20">
      <Header />
      <section className="py-40">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Access Revoked</h1>
          <p className="text-gray-600 mb-6">Your account has been revoked. Please contact the administrator for more information.</p>
          <div className="space-x-3">
            <Link to="/auth"><Button variant="outline">Return to Login</Button></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

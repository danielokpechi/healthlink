import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import Badge from '../../../components/base/Badge';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/index';

export default function AdminApprovalsPage() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blood_banks'), where('approved', '==', false));
      const snap = await getDocs(q);
      const items: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApps(items);
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const bankRef = doc(db, 'blood_banks', id);
      await updateDoc(bankRef, { approved: true, approvedAt: Timestamp.now() });
      // Optionally update users collection if needed
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Failed to approve', e);
      alert('Failed to approve application');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and delete this application? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'blood_banks', id));
      // Optionally remove the corresponding user doc
      try { await deleteDoc(doc(db, 'users', id)); } catch (_) {}
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Failed to reject', e);
      alert('Failed to reject application');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30">
      <Header />
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blood Bank Applications</h1>
              <p className="text-sm text-gray-600">Review and approve blood bank registrations.</p>
            </div>
            <div>
              <Link to="/admin/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {loading && (
              <Card>
                <p className="text-gray-600">Loading applications...</p>
              </Card>
            )}

            {!loading && apps.length === 0 && (
              <Card>
                <p className="text-gray-600">No pending applications at the moment.</p>
              </Card>
            )}

            {apps.map((app) => (
              <Card key={app.id} className="border-l-4 border-l-yellow-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{app.name || app.organizationName || 'Unnamed Facility'}</h3>
                    <p className="text-sm text-gray-600">{app.address || app.location || ''}</p>
                    {app.licenseNumber && <p className="text-sm text-gray-500">License: {app.licenseNumber}</p>}
                    <div className="mt-2">
                      <Badge>{app.contactEmail || app.contactEmail}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleReject(app.id)}>
                      Reject
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApprove(app.id)}>
                      <i className="ri-check-line mr-2"></i>
                      Approve
                    </Button>
                  </div>
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

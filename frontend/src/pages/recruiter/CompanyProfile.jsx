import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const CompanyProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', website: '', location: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await axios.get('/companies/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setForm(data);
        setCompanyId(data._id);
      } catch {
        // No company yet
      } finally {
        setFetching(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (companyId) {
        await axios.put(`/companies/${companyId}`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success('Company updated!');
      } else {
        const { data } = await axios.post('/companies', form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCompanyId(data._id);
        login({ ...user, company: data._id });
        toast.success('Company created!');
      }
      navigate('/recruiter/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800";

  if (fetching) return (
    <DashboardLayout role="recruiter">
      <p className="text-center text-gray-400 py-20">Loading...</p>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {companyId ? 'Edit Company Profile' : 'Create Company Profile'}
          </h1>
          <p className="text-gray-500 mt-1">
            {companyId ? 'Update your company information.' : 'Set up your company to start posting jobs.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Company preview card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl mb-6" style={{ backgroundColor: PL }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: P }}>
              {form.name ? form.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{form.name || 'Your Company'}</p>
              <p className="text-gray-500 text-sm">{form.location || 'Location not set'}</p>
              {form.website && (
                <a href={form.website} target="_blank" rel="noreferrer"
                  className="text-xs underline" style={{ color: P }}>
                  {form.website}
                </a>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Company Name *</label>
              <input className={inputCls} required placeholder="e.g. TechCorp India"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea className={inputCls} rows={4}
                placeholder="What does your company do? What's your mission?"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Website</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <input className={inputCls + ' pl-9'} placeholder="https://yourcompany.com"
                  value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Location</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input className={inputCls + ' pl-9'} placeholder="e.g. Pune, Maharashtra"
                  value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}/>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: P }}>
                {loading ? 'Saving...' : companyId ? 'Update Company' : 'Create Company'}
              </button>
              <button type="button" onClick={() => navigate('/recruiter/dashboard')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
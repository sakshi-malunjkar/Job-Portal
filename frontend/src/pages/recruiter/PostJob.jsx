import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const steps = ['Basic Info', 'Details', 'Preview'];

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    description: '',
    skills: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
  });

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const { data } = await axios.get('/companies/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setForm(f => ({ ...f, companyName: data.name || '' }));
      } catch {
        toast.error('Please create a company profile first!');
        navigate('/recruiter/company');
      }
    };

    if (user?.token) {
      checkCompany();
    }
  }, [user, navigate]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/jobs', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success('Job posted!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800";

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a New Job</h1>
        <p className="text-gray-500 mb-6">Fill in the details to attract top talent.</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition"
                style={{
                  backgroundColor: i <= step ? P : '#E5E7EB',
                  color: i <= step ? 'white' : '#9CA3AF',
                }}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className="w-12 h-px bg-gray-200 mx-1"/>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Basic Information</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Job Title *</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <input className={inputCls + ' pl-9'} placeholder="e.g. Senior Frontend Developer"
                    value={form.title} onChange={e => set('title', e.target.value)}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Company Name *</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <input className={inputCls + ' pl-9'} placeholder="e.g. Google, Microsoft, TCS"
                    value={form.companyName} onChange={e => set('companyName', e.target.value)}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Employment Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Full-time','Part-time','Contract','Internship'].map(t => (
                    <button key={t} onClick={() => set('employmentType', t)}
                      className="py-2.5 rounded-xl text-sm font-medium border transition"
                      style={{
                        backgroundColor: form.employmentType === t ? P : 'transparent',
                        borderColor: form.employmentType === t ? P : '#E5E7EB',
                        color: form.employmentType === t ? 'white' : '#6B7280',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Location *</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input className={inputCls + ' pl-9'} placeholder="e.g. Pune, Maharashtra or Remote"
                    value={form.location} onChange={e => set('location', e.target.value)}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Salary Range *</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <input className={inputCls + ' pl-9'} placeholder="e.g. 6-8 LPA"
                    value={form.salary} onChange={e => set('salary', e.target.value)}/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Experience Level *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Entry Level','Mid Level','Senior Level','Lead/Manager'].map(l => (
                    <button key={l} onClick={() => set('experienceLevel', l)}
                      className="py-2.5 rounded-xl text-sm font-medium border transition"
                      style={{
                        backgroundColor: form.experienceLevel === l ? P : 'transparent',
                        borderColor: form.experienceLevel === l ? P : '#E5E7EB',
                        color: form.experienceLevel === l ? 'white' : '#6B7280',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Job Details</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Job Description *</label>
                <textarea className={inputCls} rows={6}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={form.description} onChange={e => set('description', e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Required Skills <span className="text-gray-400 font-normal">(comma separated)</span>
                </label>
                <input className={inputCls} placeholder="React, Node.js, MongoDB, TypeScript"
                  value={form.skills} onChange={e => set('skills', e.target.value)}/>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Preview Your Job Post</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{form.title || 'Job Title'}</h3>
                <p className="text-sm font-semibold" style={{ color: P }}>{form.companyName || 'Company Name'}</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>📍 {form.location || 'Location'}</span>
                  <span>💰 {form.salary || 'Salary'}</span>
                  <span>⏱ {form.employmentType}</span>
                  <span>⭐ {form.experienceLevel}</span>
                </div>
                <p className="text-gray-700 text-sm">{form.description || 'No description added.'}</p>
                <div className="flex flex-wrap gap-2">
                  {form.skills.split(',').filter(Boolean).map((s, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#EDE8F5', color: '#5B2D8E' }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition disabled:opacity-40"
              disabled={step === 0}>
              Previous
            </button>
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: P }}>
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: P }}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
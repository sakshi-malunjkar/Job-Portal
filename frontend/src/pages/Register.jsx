import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const P = '#5B2D8E';

const roles = [
  {
    value: 'candidate',
    label: 'Candidate',
    sub: 'Looking for job opportunities',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    panelTitle: 'Find Your Dream Job',
    panelSub: 'Discover opportunities that match your skills and career goals.',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    sub: 'Hiring talent for your team',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    panelTitle: 'Find Top Talent',
    panelSub: 'Connect with the best candidates and build your dream team.',
  },
];

const Register = () => {
  const { user, login }  = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    }
  }, [user, navigate]);
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [step, setStep]       = useState(roleParam ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    roleParam === 'recruiter' || roleParam === 'employer' ? 'recruiter' : 'candidate'
  );
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const activeRole = roles.find(r => r.value === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', {
        ...form,
        role: selectedRole,
      });
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate(data.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex bg-[#FAF9F7] dark:bg-[#0F0F12] text-gray-900 dark:text-white transition-colors duration-300">

      {/* LEFT — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-12 sm:py-10 bg-[#FAF9F7] dark:bg-zinc-900/40 border-r border-gray-150 dark:border-zinc-800/80 transition-colors duration-300"
        style={{ maxWidth: 640 }}>

        {/* Back Link */}
        <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#5B2D8E] dark:hover:text-purple-400 mb-8 select-none w-fit transition-colors duration-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </Link>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 w-fit hover:opacity-90 transition select-none">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-[#5B2D8E]/20"
            style={{ backgroundColor: P }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-xl">JobParking</span>
        </Link>

        {/* STEP 1 — Pick role */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Join JobParking</h1>
            <p className="text-gray-500 mb-8">Select your role to get started with the right experience.</p>

            <div className="space-y-3 mb-8">
              {roles.map((r) => (
                <button key={r.value} type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left"
                  style={{
                    borderColor: selectedRole === r.value ? P : '#E5E7EB',
                    backgroundColor: selectedRole === r.value ? '#F5F0FB' : 'white',
                  }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: selectedRole === r.value ? P : '#F3F4F6',
                      color: selectedRole === r.value ? 'white' : '#6B7280',
                    }}>
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{r.label}</p>
                    <p className="text-gray-500 text-sm">{r.sub}</p>
                  </div>
                  {selectedRole === r.value && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: P }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: P }}>
              Continue →
            </button>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: P }}>
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 — Fill details */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
              ← Back to role selection
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 mb-8">
              Signing up as{' '}
              <span className="font-semibold" style={{ color: P }}>
                {activeRole?.label}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" required placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" required placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: P }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>

              <p className="text-center text-xs text-gray-400">
                By signing up, you agree to our{' '}
                <span className="underline cursor-pointer" style={{ color: P }}>Terms of Service</span>
                {' '}and{' '}
                <span className="underline cursor-pointer" style={{ color: P }}>Privacy Policy</span>
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: P }}>
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* RIGHT — Decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B2D8E 0%, #7C3AED 50%, #9333EA 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}/>
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}/>
        <div className="absolute top-1/2 right-[-40px] w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: 'white' }}/>

        {/* Content — changes based on selected role */}
        <div className="text-center text-white px-12 z-10">
          <div className="w-28 h-28 rounded-3xl mx-auto mb-8 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2">
              {selectedRole === 'candidate'
                ? <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>
                : <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>
              }
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-3">{activeRole?.panelTitle}</h2>
          <p className="text-purple-200 text-base leading-relaxed max-w-xs mx-auto">
            {activeRole?.panelSub}
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {(selectedRole === 'candidate'
              ? ['Browse thousands of job listings', 'Apply with one click', 'Track your application status', 'Chat directly with recruiters']
              : ['Post unlimited job listings', 'Review candidate profiles', 'Manage applications easily', 'Message candidates directly']
            ).map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-purple-100 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
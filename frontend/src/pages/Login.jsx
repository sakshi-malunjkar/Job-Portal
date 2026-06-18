import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const P = '#5B2D8E';

const Login = () => {
  const { user, login }  = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    }
  }, [user, navigate]);
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    roleParam === 'recruiter' || roleParam === 'employer' ? 'recruiter' : 'candidate'
  );
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', {
        ...form,
        role: selectedRole,
      });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit hover:opacity-90 transition select-none">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-[#5B2D8E]/20"
            style={{ backgroundColor: P }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-xl">JobParking</span>
        </Link>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 select-none">
            <button
              type="button"
              onClick={() => setSelectedRole('candidate')}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              style={{
                backgroundColor: selectedRole === 'candidate' ? P : 'transparent',
                color: selectedRole === 'candidate' ? 'white' : '#6B7280',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('recruiter')}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              style={{
                backgroundColor: selectedRole === 'recruiter' ? P : 'transparent',
                color: selectedRole === 'recruiter' ? 'white' : '#6B7280',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              Recruiter
            </button>
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: P }}>
            Sign up
          </Link>
        </p>
      </div>

      {/* RIGHT — Decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B2D8E 0%, #7C3AED 50%, #9333EA 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}/>
        <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}/>

        {/* Content */}
        <div className="text-center text-white px-12 z-10">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-purple-200 text-base leading-relaxed max-w-xs mx-auto">
            Sign in to access your dashboard and continue your journey with JobParking.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              { value: '50K+', label: 'Active Jobs' },
              { value: '10K+', label: 'Companies' },
              { value: '95%',  label: 'Success Rate' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-purple-300 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
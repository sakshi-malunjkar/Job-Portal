import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const CandidateNav = [
  { label: 'Dashboard',   path: '/candidate/dashboard',  icon: 'grid' },
  { label: 'Browse Jobs', path: '/candidate/jobs',       icon: 'search' },
  { label: 'Applications',path: '/candidate/applications',icon: 'file' },
  { label: 'Messages',    path: '/messages',             icon: 'msg' },
  { label: 'Notifications',path: '/candidate/notifications',icon: 'bell' },
  { label: 'Profile',     path: '/candidate/profile',    icon: 'user' },
];

const RecruiterNav = [
  { label: 'Dashboard',    path: '/recruiter/dashboard', icon: 'grid' },
  { label: 'Post Job',     path: '/recruiter/post-job',  icon: 'plus' },
  { label: 'My Jobs',      path: '/recruiter/jobs',      icon: 'briefcase' },
  { label: 'Applicants',   path: '/recruiter/applicants',icon: 'users' },
  { label: 'Messages',     path: '/messages',            icon: 'msg' },
  { label: 'Notifications',path: '/recruiter/notifications',icon: 'bell' },
];

const Icon = ({ name, size = 18 }) => {
  const s = { width: size, height: size };
  const icons = {
    grid:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    msg:      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
    briefcase:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    moon:     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    flag:     <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
  };
  return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const navItems = role === 'recruiter' ? RecruiterNav : CandidateNav;
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (role === 'recruiter') {
      navigate(`/recruiter/applicants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/candidate/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toast.success(isDark ? 'Theme updated!' : 'Theme updated!');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const { data } = await axios.get('/notifications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUnreadCount(data.filter(n => !n.read).length);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F5F0EB' }}>

      {/* Sidebar */}
      <div className={`sidebar-container flex flex-col bg-white border-r border-gray-100 ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

        {/* Logo */}
        <Link to={role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
          className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 hover:opacity-90 transition select-none">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: P }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          {!collapsed && <span className="font-bold text-gray-900 text-lg">JobParking</span>}
        </Link>

        {/* Role badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ backgroundColor: '#F5F0EB' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: PL }}>
              <Icon name={role === 'recruiter' ? 'briefcase' : 'user'} size={14} />
            </div>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {role === 'recruiter' ? 'Employer' : 'Job Seeker'}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
                style={{
                  backgroundColor: active ? P : 'transparent',
                  color: active ? 'white' : '#6B7280',
                }}>
                <span style={{ color: active ? 'white' : '#6B7280', flexShrink: 0 }}>
                  <Icon name={item.icon} size={18} />
                </span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 px-2 py-2 space-y-0.5">
          <Link to={role === 'recruiter' ? '/recruiter/notifications' : '/candidate/notifications'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition relative">
            <div className="relative flex items-center justify-center">
              <Icon name="bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundColor: '#EF4444', fontSize: 10 }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {!collapsed && 'Notifications'}
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
            <Icon name="logout" size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay Backdrop for Mobile */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)} 
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <button onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-700 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={role === 'recruiter' ? 'Search candidates...' : 'Search jobs by title or company...'}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
            />
          </form>

          <div className="flex items-center gap-3 ml-auto">
            <button onClick={toggleDarkMode} className="text-gray-400 hover:text-gray-600 transition" title="Toggle dark mode">
              <Icon name="moon" size={18} />
            </button>
            <button onClick={() => toast.success('English language selected')} className="relative text-gray-400 hover:text-gray-600 transition" title="Language selector">
              <Icon name="flag" size={18} />
            </button>
            <Link to={role === 'recruiter' ? '/recruiter/notifications' : '/candidate/notifications'}
              className="relative text-gray-400 hover:text-gray-600 transition flex items-center justify-center" title="Notifications">
              <Icon name="bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundColor: '#EF4444', fontSize: 9, width: 14, height: 14 }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Avatar */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: P }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                  style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                    <p className="text-sm text-gray-800 font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{role === 'recruiter' ? 'Employer' : 'Job Seeker'}</p>
                  </div>
                  <Link
                    to={role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/profile'}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Icon name={role === 'recruiter' ? 'grid' : 'user'} size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <Icon name="logout" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Icon };
export default DashboardLayout;
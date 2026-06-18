import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Hide on all dashboard/app routes — they have their own layout
  const hiddenRoutes = [
    '/recruiter',
    '/candidate',
    '/messages',
  ];

  const shouldHide = hiddenRoutes.some(r => location.pathname.startsWith(r))
    || location.pathname === '/';

  if (shouldHide) return null;

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#5B2D8E' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-lg">JobParking</span>
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link to="/register"
              className="text-white px-4 py-2 rounded-full hover:opacity-90 transition font-medium"
              style={{ backgroundColor: '#5B2D8E' }}>
              Get Started
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-600 font-medium">Hi, {user.name} 👋</span>
            <Link
              to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
              className="text-gray-600 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="text-white px-4 py-2 rounded-full transition font-medium"
              style={{ backgroundColor: '#DC2626' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const statusColor = (s) => ({
  pending:     'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-600');

const statusLabel = (s) => ({
  pending:     'Pending',
  shortlisted: 'Under Review',
  rejected:    'Rejected',
}[s] || s);

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/applications/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(data);
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const stats = [
    { label: 'Applications Sent',    value: applications.length,                                          sub: '+3 this week',        icon: 'file',      },
    { label: 'Profile Views',        value: 156,                                                           sub: '+12% from last week', icon: 'user',      },
    { label: 'Interviews Scheduled', value: applications.filter(a => a.status === 'shortlisted').length,  sub: '2 this week',         icon: 'bell',      },
    { label: 'Jobs Saved',           value: 18,                                                            sub: '5 new matches',       icon: 'briefcase', },
  ];

  return (
    <DashboardLayout role="candidate">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your job search.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-gray-500 text-sm">{s.label}</p>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: PL }}>
                    <span style={{ color: P }}><Icon name={s.icon} size={16}/></span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: '#16A34A' }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-sm font-medium flex items-center gap-1" style={{ color: P }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="text-center text-gray-400 py-10">Loading...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No applications yet.</p>
                <Link to="/candidate/jobs"
                  className="mt-3 inline-block text-sm font-medium px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: P }}>
                  Browse Jobs
                </Link>
              </div>
            ) : (
              applications.slice(0, 5).map((app, i) => (
                <div key={i} className="flex items-center gap-4 p-5 border-b border-gray-50 last:border-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: PL }}>
                    <span style={{ color: P }}><Icon name="briefcase" size={18}/></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{app.job?.title}</p>
                    <p className="text-gray-400 text-sm truncate">{app.job?.company?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(app.status)}`}>
                      {statusLabel(app.status)}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to="/candidate/applications"
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <Icon name="search" size={16}/>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Profile completion */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Profile Completion</h3>
            <p className="text-sm text-gray-500 mb-2">75% Complete</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: P }}/>
            </div>
            <p className="text-xs text-gray-500 mb-3">Add your skills to improve your profile.</p>
            <Link to="/candidate/profile"
              className="block text-center text-sm font-semibold py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
              Complete Profile
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Browse Jobs',    path: '/candidate/jobs',    icon: 'briefcase', color: PL,        textColor: P         },
                { label: 'View Messages',  path: '/messages',          icon: 'msg',       color: '#FEF3C7', textColor: '#D97706' },
                { label: 'Update Resume',  path: '/candidate/profile', icon: 'file',      color: '#DCFCE7', textColor: '#16A34A' },
              ].map((a, i) => (
                <Link key={i} to={a.path}
                  className="flex items-center gap-3 p-3 rounded-xl transition hover:opacity-90"
                  style={{ backgroundColor: a.color }}>
                  <span style={{ color: a.textColor }}><Icon name={a.icon} size={16}/></span>
                  <span className="text-sm font-medium" style={{ color: a.textColor }}>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
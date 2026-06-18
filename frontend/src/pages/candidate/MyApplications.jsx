import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const statusConfig = {
  pending:     { label: 'Pending',     color: 'bg-yellow-100 text-yellow-700' },
  shortlisted: { label: 'Shortlisted', color: 'bg-green-100 text-green-700'  },
  rejected:    { label: 'Rejected',    color: 'bg-red-100 text-red-700'      },
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/applications/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(data);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filters = [
    { key: 'all',         label: 'All Applications' },
    { key: 'pending',     label: 'Pending'          },
    { key: 'shortlisted', label: 'Shortlisted'      },
    { key: 'rejected',    label: 'Rejected'         },
  ];

  const filtered = applications.filter(app => {
    const matchFilter = activeFilter === 'all' || app.status === activeFilter;
    const matchSearch = !search ||
      app.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.job?.company?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">Track and manage your job applications.</p>
        </div>

        {/* Search + filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search applications..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"/>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition"
                style={{
                  backgroundColor: activeFilter === f.key ? P : 'transparent',
                  color: activeFilter === f.key ? 'white' : '#6B7280',
                  border: activeFilter === f.key ? 'none' : '1px solid #E5E7EB',
                }}>
                {f.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeFilter === f.key ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                    color: activeFilter === f.key ? 'white' : '#6B7280',
                  }}>
                  {f.key === 'all'
                    ? applications.length
                    : applications.filter(a => a.status === f.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applications list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-purple-300 border-t-purple-700 animate-spin"/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: PL }}>
              <Icon name="file" size={24}/>
            </div>
            <p className="text-gray-500 font-medium">No applications found</p>
            <Link to="/candidate/jobs"
              className="mt-4 inline-block text-sm font-semibold px-5 py-2 rounded-xl text-white"
              style={{ backgroundColor: P }}>
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.map((app, i) => {
              const cfg = statusConfig[app.status] || statusConfig.pending;
              return (
                <div key={app._id}
                  className="flex items-center gap-4 p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: PL }}>
                    <Icon name="briefcase" size={20}/>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {app.job?.title || 'Job Removed'}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {app.job?.companyName || app.job?.company?.name || '—'}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {app.job?._id && (
                      <Link to={`/candidate/jobs/${app.job._id}`}
                        className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-lg hover:bg-gray-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
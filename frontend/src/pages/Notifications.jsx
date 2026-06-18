import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout, { Icon } from '../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const typeConfig = {
  application_status: { icon: 'file',      color: '#5B2D8E', bg: '#EDE8F5' },
  new_applicant:       { icon: 'users',     color: '#0F6E56', bg: '#E1F5EE' },
  message:              { icon: 'msg',       color: '#D97706', bg: '#FEF3C7' },
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await axios.put('/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch {
      toast.error('Failed');
    }
  };

  const handleClick = async (n) => {
    if (!n.read) {
      try {
        await axios.put(`/notifications/${n._id}/read`, {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(items.map(i => i._id === n._id ? { ...i, read: true } : i));
      } catch {}
    }

    if (n.type === 'new_applicant' && n.job) {
      navigate(`/recruiter/applicants/${n.job._id || n.job}`);
    } else if (n.type === 'application_status') {
      navigate('/candidate/applications');
    }
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <DashboardLayout role={user.role}>
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-purple-300 border-t-purple-700 animate-spin"/>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: PL }}>
              <Icon name="bell" size={24}/>
            </div>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              {user.role === 'recruiter'
                ? 'New applicants will appear here.'
                : "You'll be notified when your application status changes."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {items.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.message;
              return (
                <button key={n._id} onClick={() => handleClick(n)}
                  className="w-full flex items-start gap-4 p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition text-left relative">

                  {!n.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: P }}/>
                  )}

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cfg.bg }}>
                    <span style={{ color: cfg.color }}><Icon name={cfg.icon} size={18}/></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                      {n.title}
                    </p>
                    <p className="text-gray-500 text-sm mt-0.5">{n.message}</p>

                    {/* Interview details card */}
                    {n.interviewDetails?.date && (
                      <div className="mt-3 p-3 rounded-xl border border-gray-100" style={{ backgroundColor: '#FAF9F7' }}>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {n.interviewDetails.date}
                          </span>
                          {n.interviewDetails.time && (
                            <span className="flex items-center gap-1.5">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {n.interviewDetails.time}
                            </span>
                          )}
                          {n.interviewDetails.location && (
                            <span className="flex items-center gap-1.5">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                              {n.interviewDetails.location}
                            </span>
                          )}
                        </div>
                        {n.interviewDetails.notes && (
                          <p className="text-xs text-gray-500 mt-2">{n.interviewDetails.notes}</p>
                        )}
                      </div>
                    )}

                    <p className="text-gray-400 text-xs mt-2">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
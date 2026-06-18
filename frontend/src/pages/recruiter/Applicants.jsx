import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';
const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const Applicants = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalApp, setModalApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', location: '', notes: '' });
  const [search, setSearch] = useState('');

  const fetchApplicants = async () => {
    try {
      const endpoint = jobId ? `/applications/job/${jobId}` : '/applications/recruiter';
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplicants(data);
    } catch (error) {
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status, interviewDetails = null) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status, interviewDetails }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success(`Status updated to ${status}`);
      setApplicants(applicants.map((a) =>
        a._id === appId ? { ...a, status } : a
      ));
      setModalApp(null);
      setInterviewForm({ date: '', time: '', location: '', notes: '' });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleStatusChange = (app, newStatus) => {
    if (newStatus === 'shortlisted') {
      setModalApp(app);
    } else {
      updateStatus(app._id, newStatus);
    }
  };

  useEffect(() => { fetchApplicants(); }, [jobId]);

  const loc = useLocation();
  useEffect(() => {
    const searchParam = new URLSearchParams(loc.search).get('search') || '';
    setSearch(searchParam);
  }, [loc.search]);

  const statusColor = (status) => {
    if (status === 'shortlisted') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const filters = ['All Applicants', 'Pending', 'Shortlisted', 'Rejected'];
  const [activeFilter, setActiveFilter] = useState('All Applicants');

  const filteredApplicants = applicants.filter((app) => {
    const searchLower = search.toLowerCase();
    const applicantName = app.applicant?.name || '';
    const applicantEmail = app.applicant?.email || '';
    const applicantSkills = app.applicant?.skills || [];
    const jobTitle = (app.job && typeof app.job === 'object') ? (app.job.title || '') : '';
    const jobCompany = (app.job && typeof app.job === 'object') ? (app.job.companyName || app.job.company?.name || '') : '';

    const matchSearch =
      !search ||
      applicantName.toLowerCase().includes(searchLower) ||
      applicantEmail.toLowerCase().includes(searchLower) ||
      applicantSkills.some(s => s?.toLowerCase().includes(searchLower)) ||
      jobTitle.toLowerCase().includes(searchLower) ||
      jobCompany.toLowerCase().includes(searchLower);

    if (activeFilter === 'All Applicants') return matchSearch;
    if (activeFilter === 'Pending') {
      return matchSearch && app.status === 'pending';
    }
    if (activeFilter === 'Shortlisted') {
      return matchSearch && app.status === 'shortlisted';
    }
    if (activeFilter === 'Rejected') {
      return matchSearch && app.status === 'rejected';
    }
    return matchSearch;
  });

  const getFilterCount = (filter) => {
    if (filter === 'All Applicants') return applicants.length;
    if (filter === 'Pending') return applicants.filter(a => a.status === 'pending').length;
    if (filter === 'Shortlisted') return applicants.filter(a => a.status === 'shortlisted').length;
    if (filter === 'Rejected') return applicants.filter(a => a.status === 'rejected').length;
    return 0;
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 mt-1">Review and manage candidates for your positions.</p>
        </div>

        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                placeholder="Search applicants by name, email, skills, or job..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition"
                style={{
                  backgroundColor: activeFilter === f ? P : 'transparent',
                  color: activeFilter === f ? 'white' : '#6B7280',
                  border: activeFilter === f ? 'none' : '1px solid #E5E7EB',
                }}>
                {f}
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeFilter === f ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                    color: activeFilter === f ? 'white' : '#6B7280',
                  }}>
                  {getFilterCount(f)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applicants list */}
        {loading ? (
          <p className="text-center text-gray-400 py-16">Loading...</p>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
            <p className="text-gray-400 text-lg">No matching applicants found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filteredApplicants.map((app, i) => (
              <div key={app._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">

                {/* Candidate Info (Avatar + Details) */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: P }}>
                    {app.applicant?.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-semibold text-gray-800 text-base">{app.applicant?.name || 'Deleted Candidate'}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {app.applicant?.email || 'No email address'}
                    </p>
                    {!jobId && app.job?.title && (
                      <p className="text-xs font-semibold mt-1" style={{ color: P }}>
                        Job: {app.job.title}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {app.applicant?.skills?.slice(0, 4).map((skill, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: PL, color: P }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Applied time & Resume */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex-shrink-0">
                  <p className="text-gray-400 text-xs">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  {app.applicant?.resume ? (
                    <a href={`${backendUrl}/${app.applicant.resume}?t=${Date.now()}`}
                      target="_blank" rel="noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 bg-[#EDE8F5] text-[#5B2D8E] rounded-lg hover:opacity-90 transition inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Resume
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No resume</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                    className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white">
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {app.applicant?._id ? (
                    <Link to={`/messages/${app.applicant._id}`}
                      className="flex-1 sm:flex-none justify-center text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 font-medium"
                      style={{ backgroundColor: P }}>
                      <Icon name="msg" size={14} />
                      Message
                    </Link>
                  ) : (
                    <button disabled
                      className="flex-1 sm:flex-none justify-center text-gray-400 bg-gray-100 text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-not-allowed font-medium">
                      <Icon name="msg" size={14} />
                      Message
                    </button>
                  )}
                </div>

                {/* Interview details modal */}
                {modalApp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Shortlist {modalApp.applicant?.name || 'Candidate'}</h3>
                      <p className="text-gray-500 text-sm mb-5">Add interview details to notify the candidate.</p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-600 mb-1">Interview Date</label>
                          <input type="date"
                            value={interviewForm.date}
                            onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-600 mb-1">Interview Time</label>
                          <input type="time"
                            value={interviewForm.time}
                            onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-600 mb-1">Location / Meeting Link</label>
                          <input type="text" placeholder="Office address or Zoom/Meet link"
                            value={interviewForm.location}
                            onChange={e => setInterviewForm({ ...interviewForm, location: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-600 mb-1">Additional Notes</label>
                          <textarea rows={3} placeholder="What to bring, who to ask for, dress code, etc."
                            value={interviewForm.notes}
                            onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setModalApp(null)}
                          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition">
                          Cancel
                        </button>
                        <button onClick={() => updateStatus(modalApp._id, 'shortlisted', interviewForm)}
                          className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                          style={{ backgroundColor: '#5B2D8E' }}>
                          Shortlist & Notify
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;
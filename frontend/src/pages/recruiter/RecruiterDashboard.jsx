import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs]                 = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: jobsData } = await axios.get('/jobs/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setJobs(jobsData);

        const { data: appsData } = await axios.get('/applications/recruiter', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(appsData);
      } catch { 
        toast.error('Failed to load dashboard data'); 
      } finally { 
        setLoading(false); 
      }
    };
    fetch();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Job deleted');
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch { toast.error('Failed to delete'); }
  };

  const totalApplications = applications.length;
  const interviewsScheduled = applications.filter(a => a.status === 'shortlisted').length;

  const stats = [
    { label: 'Active Jobs',           value: jobs.length, sub: 'Updated live',          icon: 'briefcase' },
    { label: 'Total Applications',    value: totalApplications,         sub: 'All time',    icon: 'users'     },
    { label: 'Profile Views',         value: 1240,        sub: 'Static stats',          icon: 'user'      },
    { label: 'Interviews Scheduled',  value: interviewsScheduled,          sub: 'Shortlisted',icon: 'bell'      },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's an overview of your hiring activity.</p>
            </div>
            <Link to="/recruiter/post-job"
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: P }}>
              <span>+</span> Post New Job
            </Link>
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

          {/* Two column layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Job Postings */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Your Job Postings</h2>
                <Link to="/recruiter/jobs" className="text-sm font-medium flex items-center gap-1" style={{ color: P }}>
                  View All →
                </Link>
              </div>

              {loading ? (
                <p className="text-center text-gray-400 py-10">Loading...</p>
              ) : jobs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400">No jobs posted yet.</p>
                  <Link to="/recruiter/post-job"
                    className="mt-3 inline-block text-sm font-medium px-4 py-2 rounded-xl text-white"
                    style={{ backgroundColor: P }}>
                    Post First Job
                  </Link>
                </div>
              ) : (
                jobs.slice(0, 4).map((job, i) => (
                  <div key={i} className="p-5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{job.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">
                      {job.location} • Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3">
                      <Link to={`/recruiter/applicants/${job._id}`}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        View Applicants
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Applicants sidebar */}
            <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Recent Applicants</h2>
                <Link to="/recruiter/applicants" className="text-sm font-semibold hover:underline" style={{ color: P }}>View All →</Link>
              </div>
              <div className="p-3">
                {applications.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">No applicants yet</p>
                ) : (
                  applications.slice(0, 4).map((app, i) => {
                    const applicantName = app.applicant?.name || 'Candidate';
                    const jobTitle = app.job?.title || 'Job Posting';
                    return (
                      <Link to={`/recruiter/applicants/${app.job?._id || ''}`} key={app._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition text-left block">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: ['#5B2D8E', '#7C3AED', '#9333EA', '#A855F7'][i % 4] }}>
                          {applicantName[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{applicantName}</p>
                          <p className="text-gray-400 text-xs truncate">{jobTitle}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor: app.status === 'shortlisted' ? '#E1F5EE' : app.status === 'rejected' ? '#FEE2E2' : PL,
                            color: app.status === 'shortlisted' ? '#0F6E56' : app.status === 'rejected' ? '#DC2626' : P
                          }}>
                          {app.status}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
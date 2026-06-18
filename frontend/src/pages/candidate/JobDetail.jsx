import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const JobDetail = () => {
  const { jobId }  = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/jobs/${jobId}`);
        setJob(data);

        // Check if already applied
        const { data: myApps } = await axios.get('/applications/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const alreadyApplied = myApps.some(a => a.job?._id === jobId || a.job === jobId);
        setApplied(alreadyApplied);
      } catch {
        toast.error('Failed to load job');
        navigate('/candidate/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);
    try {
      await axios.post(`/applications/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <DashboardLayout role="candidate">
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-purple-300 border-t-purple-700 animate-spin"/>
      </div>
    </DashboardLayout>
  );

  if (!job) return null;

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate('/candidate/jobs')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 text-sm font-medium">
          ← Back to Jobs
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1 space-y-4">

            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: PL }}>
                  <Icon name="briefcase" size={28}/>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-gray-500 mt-1 font-medium">{job.companyName || job.company?.name}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    {job.location && (
                      <span className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        {job.salary}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: PL, color: P }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Company info */}
            {job.company && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-4">About the Company</h2>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: P }}>
                    {(job.companyName || job.company?.name)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{job.companyName || job.company?.name}</p>
                    {job.company.location && (
                      <p className="text-gray-500 text-sm">{job.company.location}</p>
                    )}
                  </div>
                </div>
                {job.company.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{job.company.description}</p>
                )}
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer"
                    className="text-sm font-medium underline mt-2 inline-block" style={{ color: P }}>
                    Visit Website →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Apply card */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Apply for this job</h3>

              {applied ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-green-100">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-green-700">Already Applied!</p>
                  <p className="text-gray-400 text-sm mt-1">Track it in My Applications</p>
                  <button onClick={() => navigate('/candidate/applications')}
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition hover:opacity-90"
                    style={{ borderColor: P, color: P }}>
                    View Application
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-5 text-sm text-gray-600">
                    {job.location && (
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {job.location}
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        {job.salary}
                      </div>
                    )}
                  </div>

                  <button onClick={handleApply} disabled={applying}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: P }}>
                    {applying ? 'Submitting...' : 'Apply Now →'}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Make sure your profile is complete before applying
                  </p>

                  <button
                    onClick={() => navigate(`/messages`)}
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <Icon name="msg" size={14}/>
                    Message Recruiter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
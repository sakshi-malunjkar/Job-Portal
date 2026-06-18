import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout, { Icon } from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';

const BrowseJobs = () => {
  const { user }   = useAuth();
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [keyword, setKeyword]     = useState('');
  const [location, setLocation]   = useState('');
  const [activeType, setActiveType] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/jobs', {
        params: { keyword, location },
      });
      setJobs(data);
    } catch {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const loc = useLocation();

  useEffect(() => {
    const searchParam = new URLSearchParams(loc.search).get('search') || '';
    setKeyword(searchParam);
    
    const fetchWithKeyword = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/jobs', {
          params: { keyword: searchParam, location },
        });
        setJobs(data);
      } catch {
        toast.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchWithKeyword();
  }, [loc.search]);

  const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-500 mt-1">Discover your next career opportunity.</p>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Search jobs, companies..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div className="relative w-48">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                placeholder="All Locations"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <button
              onClick={fetchJobs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: P }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search Jobs
            </button>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition"
                style={{
                  backgroundColor: activeType === t ? P : 'transparent',
                  color: activeType === t ? 'white' : '#6B7280',
                  border: activeType === t ? 'none' : '1px solid #E5E7EB',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 text-sm font-medium">
              <span className="font-bold text-gray-900">{jobs.length}</span> jobs found
            </p>
            <select className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none bg-white text-gray-600">
              <option>Most Relevant</option>
              <option>Most Recent</option>
              <option>Highest Salary</option>
            </select>
          </div>
        )}

        {/* Jobs list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-purple-300 border-t-purple-700 animate-spin"/>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: PL }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={P} strokeWidth="1.8">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-lg">No jobs found</p>
            <p className="text-gray-400 text-sm mt-1">Try different keywords or clear filters</p>
            <button onClick={() => { setKeyword(''); setLocation(''); fetchJobs(); }}
              className="mt-4 text-sm font-semibold px-5 py-2 rounded-xl text-white"
              style={{ backgroundColor: P }}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <div key={job._id}
                className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
                style={{ borderColor: i === 0 ? '#FCA5A5' : '#F3F4F6' }}>

                {/* Featured badge for first job */}
                {i === 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 mb-3 inline-block">
                    Featured
                  </span>
                )}

                <div className="flex items-start gap-4">
                  {/* Company icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: PL }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={P} strokeWidth="1.8">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {job.companyName || job.company?.name || 'Company'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          💰 {job.salary}
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {job.skills.slice(0, 5).map((skill, j) => (
                          <span key={j}
                            className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Details button — goes to job detail page */}
                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition flex-shrink-0 whitespace-nowrap"
                    style={{ backgroundColor: P }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseJobs;
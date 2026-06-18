import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import toast from 'react-hot-toast';

const P = '#5B2D8E';
const PL = '#EDE8F5';
const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const CandidateProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    name:   user.name   || '',
    skills: user.skills?.join(', ') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',   form.name);
      formData.append('skills', form.skills);
      if (resumeFile) formData.append('resume', resumeFile);

      const { data } = await axios.put('/auth/profile', formData, {
        headers: {
          Authorization:  `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      login({ ...user, name: data.user.name, skills: data.user.skills, resume: data.user.resume });
      toast.success('Profile updated!');
      navigate('/candidate/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800";

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your profile and resume.</p>
          </div>
          <button onClick={() => navigate('/candidate/dashboard')}
            className="text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            ← Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main form */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            {/* Profile header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl mb-6" style={{ backgroundColor: PL }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: P }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                <p className="text-sm font-medium" style={{ color: P }}>Job Seeker</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input className={inputCls} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}/>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Skills <span className="text-gray-400 font-normal">(comma separated)</span>
                </label>
                <input className={inputCls}
                  placeholder="React, Node.js, MongoDB, TypeScript, Python"
                  value={form.skills}
                  onChange={e => setForm({ ...form, skills: e.target.value })}/>
                {/* Skills preview */}
                {form.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.skills.split(',').filter(Boolean).map((s, i) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: PL, color: P }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: P }}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
                <button type="button" onClick={() => navigate('/candidate/dashboard')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Resume sidebar */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Resume</h3>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer"
                onClick={() => document.getElementById('resume-input').click()}>
                {resumeFile ? (
                  <div>
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: PL }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-700 text-sm truncate">{resumeFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to change</p>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto mb-2" width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="#9CA3AF" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">Drag and drop your resume or</p>
                    <button type="button"
                      className="mt-2 text-sm font-semibold px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                      Browse Files
                    </button>
                    <p className="text-gray-400 text-xs mt-2">PDF, DOC up to 5MB</p>
                  </div>
                )}
              </div>
              <input id="resume-input" type="file" accept=".pdf,.doc,.docx"
                className="hidden" onChange={e => setResumeFile(e.target.files[0])}/>

              {user.resume && (
                <a href={`${backendUrl}/${user.resume}?t=${Date.now()}`} target="_blank" rel="noreferrer"
                  className="mt-3 block text-center text-sm font-medium underline" style={{ color: P }}>
                  View current resume
                </a>
              )}
            </div>

            {/* Skills card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.length > 0 ? (
                  user.skills.map((s, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-medium border border-gray-200 text-gray-600">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfile;
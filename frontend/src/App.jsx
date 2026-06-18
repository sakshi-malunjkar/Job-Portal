import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import Applicants from './pages/recruiter/Applicants';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import BrowseJobs from './pages/candidate/BrowseJobs';
import CandidateProfile from './pages/candidate/CandidateProfile';
import Messages from './pages/Messages';
import JobDetail from './pages/candidate/JobDetail';
import MyApplications from './pages/candidate/MyApplications';
import Notifications from './pages/Notifications';

function ThemeRouteWatcher() {
  const location = useLocation();

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeRouteWatcher />
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/"                             element={<Landing />} />
          <Route path="/login"                        element={<Login />} />
          <Route path="/register"                     element={<Register />} />

          {/* Recruiter */}
          <Route path="/recruiter/dashboard"          element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs"               element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job"           element={<PostJob />} />
          <Route path="/recruiter/applicants"         element={<Applicants />} />
          <Route path="/recruiter/applicants/:jobId"  element={<Applicants />} />
          <Route path="/recruiter/company"            element={<CompanyProfile />} />

          {/* Candidate */}
          <Route path="/candidate/dashboard"          element={<CandidateDashboard />} />
          <Route path="/candidate/jobs"               element={<BrowseJobs />} />
          <Route path="/candidate/profile"            element={<CandidateProfile />} />

          {/* Shared */}
          <Route path="/messages"                     element={<Messages />} />
          <Route path="/messages/:userId"             element={<Messages />} />


          <Route path="/candidate/jobs"           element={<BrowseJobs />} />
          <Route path="/candidate/jobs/:jobId"    element={<JobDetail />} />
          <Route path="/candidate/applications"   element={<MyApplications />} />

          <Route path="/candidate/notifications" element={<Notifications />} />
          <Route path="/recruiter/notifications" element={<Notifications />} />
          

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
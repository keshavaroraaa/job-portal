import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Jobs from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import EmployerDashboard from '../pages/EmployerDashboard';
import CreateJob from '../pages/CreateJob';
import ManageJobs from '../pages/ManageJobs';
import Applicants from '../pages/Applicants';
import SeekerDashboard from '../pages/SeekerDashboard';
import AppliedJobs from '../pages/AppliedJobs';
import Profile from '../pages/Profile';

const AppRoutes = ({ darkMode, toggleDarkMode }) => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<PublicLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['employer', 'job_seeker']}>
            <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={
          user?.role === 'employer' ? <EmployerDashboard /> : <SeekerDashboard />
        } />
        <Route path="/dashboard/create-job" element={
          <ProtectedRoute allowedRoles={['employer']}><CreateJob /></ProtectedRoute>
        } />
        <Route path="/dashboard/manage-jobs" element={
          <ProtectedRoute allowedRoles={['employer']}><ManageJobs /></ProtectedRoute>
        } />
        <Route path="/dashboard/applicants" element={
          <ProtectedRoute allowedRoles={['employer']}><Applicants /></ProtectedRoute>
        } />
        <Route path="/dashboard/applied-jobs" element={
          <ProtectedRoute allowedRoles={['job_seeker']}><AppliedJobs /></ProtectedRoute>
        } />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

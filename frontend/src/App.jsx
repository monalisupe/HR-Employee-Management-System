import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Common Auth Guard
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// HR Dashboard Pages
import Dashboard from './pages/hr/Dashboard';
import Applicants from './pages/hr/Applicants';
import ApplicantDetails from './pages/hr/ApplicantDetails';
import OpenPositions from './pages/hr/OpenPositions';
import Employees from './pages/hr/Employees';
import EmployeeDetails from './pages/hr/EmployeeDetails';
import LeaveManagement from './pages/hr/LeaveManagement';
import HolidayManagement from './pages/hr/HolidayManagement';
import OnboardingDocuments from './pages/hr/OnboardingDocuments';
import PerformanceManagement from './pages/hr/PerformanceManagement';
import Interviews from './pages/hr/Interviews';
import Reports from './pages/hr/Reports';
import Notifications from './pages/hr/Notifications';
import Settings from './pages/hr/Settings';

// Candidate Dashboard Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateBrowseJobs from './pages/candidate/CandidateBrowseJobs';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateInterviews from './pages/candidate/CandidateInterviews';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateNotifications from './pages/candidate/CandidateNotifications';

// Employee Dashboard Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeLeaveManagement from './pages/employee/LeaveManagement';
import ApplyLeave from './pages/employee/ApplyLeave';
import CompanyHolidays from './pages/employee/CompanyHolidays';
import EmployeeOnboardingDocs from './pages/employee/OnboardingDocuments';
import UploadDocument from './pages/employee/UploadDocument';
import EmployeePerformancePage from './pages/employee/Performance';
import HRSupport from './pages/employee/HRSupport';
import EmployeeNotificationsPage from './pages/employee/Notifications';

/**
 * RootRedirect enforces:
 * If unauthenticated -> redirect to /login
 * If authenticated -> redirect to the appropriate role dashboard
 */
function RootRedirect() {
  const { isAuthenticated, activeRole } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (activeRole === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }
  if (activeRole === 'employee') {
    return <Navigate to="/employee/dashboard" replace />;
  }
  return <Navigate to="/hr/dashboard" replace />;
}

/**
 * PublicAuthRoute:
 * If user is already authenticated and visits /login or /register,
 * automatically redirect them to their active dashboard.
 */
function PublicAuthRoute({ children }) {
  const { isAuthenticated, activeRole } = useApp();

  if (isAuthenticated) {
    if (activeRole === 'candidate') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
    if (activeRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/hr/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes (Redirects to dashboard if already logged in) */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <Register />
              </PublicAuthRoute>
            }
          />

          {/* Root Route: strictly directs to Login if not logged in, or Dashboard if authenticated */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected HR Management Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRole="hr" />}>
            <Route path="/hr" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/hr/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="applicants/:id" element={<ApplicantDetails />} />
              <Route path="positions" element={<OpenPositions />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/:id" element={<EmployeeDetails />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="holidays" element={<HolidayManagement />} />
              <Route path="onboarding" element={<OnboardingDocuments />} />
              <Route path="performance" element={<PerformanceManagement />} />
              <Route path="interviews" element={<Interviews />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Protected Candidate Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRole="candidate" />}>
            <Route path="/candidate" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="jobs" element={<CandidateBrowseJobs />} />
              <Route path="applications" element={<CandidateApplications />} />
              <Route path="interviews" element={<CandidateInterviews />} />
              <Route path="profile" element={<CandidateProfile />} />
              <Route path="notifications" element={<CandidateNotifications />} />
            </Route>
          </Route>

          {/* Protected Employee Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRole="employee" />}>
            <Route path="/employee" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="leaves" element={<EmployeeLeaveManagement />} />
              <Route path="leaves/apply" element={<ApplyLeave />} />
              <Route path="apply-leave" element={<ApplyLeave />} />
              <Route path="holidays" element={<CompanyHolidays />} />
              <Route path="onboarding" element={<EmployeeOnboardingDocs />} />
              <Route path="onboarding/upload" element={<UploadDocument />} />
              <Route path="upload-document" element={<UploadDocument />} />
              <Route path="performance" element={<EmployeePerformancePage />} />
              <Route path="support" element={<HRSupport />} />
              <Route path="notifications" element={<EmployeeNotificationsPage />} />
            </Route>
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialOrganization,
  initialDepartments,
  initialDesignations,
  initialRecruiters,
  initialCandidateProfile,
  initialOpenPositions,
  initialApplicants,
  initialEmployees,
  initialLeaveRequests,
  initialHolidays,
  initialOnboardingDocuments,
  initialPerformanceReviews,
  initialInterviews,
  initialNotifications,
  initialActivities,
  sampleWalkthroughData,
} from '../data/mockData.js';

const AUTH_STORAGE_KEY = 'securetenant_auth_session';

const loadStoredSession = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isAuthenticated && parsed.currentUser) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading auth session from localStorage:', err);
  }
  return null;
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Session Authentication & Active User
  const initialSession = loadStoredSession();
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialSession);
  const [currentUser, setCurrentUser] = useState(initialSession?.currentUser || null);

  // Active Role: 'hr' | 'candidate' | 'employee'
  const [activeRole, setActiveRole] = useState(initialSession?.currentUser?.role || 'hr');

  // Multi-tenant & Organization Core Data
  const [organization, setOrganization] = useState(initialOrganization);
  const [departments, setDepartments] = useState(initialDepartments);
  const [designations, setDesignations] = useState(initialDesignations);
  const [recruiters, setRecruiters] = useState(initialRecruiters);

  // Operational Collections (Initialized empty/clean per specifications)
  const [openPositions, setOpenPositions] = useState(initialOpenPositions);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [interviews, setInterviews] = useState(initialInterviews);
  const [employees, setEmployees] = useState(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [holidays, setHolidays] = useState(initialHolidays);
  const [onboardingDocuments, setOnboardingDocuments] = useState(initialOnboardingDocuments);
  const [performanceReviews, setPerformanceReviews] = useState(initialPerformanceReviews);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activities, setActivities] = useState(initialActivities);

  // Active Profiles for Candidate and Employee views
  const [currentCandidate, setCurrentCandidate] = useState(initialCandidateProfile);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message = '', type = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (user, action, icon = 'Clock') => {
    const newActivity = {
      id: 'act-' + Date.now(),
      user,
      action,
      timestamp: 'Just now',
      icon,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
  };

  const addNotification = (recipientRole, title, message, category = 'General') => {
    const newNotification = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      recipientRole, // 'hr', 'candidate', 'employee', 'all'
      title,
      message,
      timestamp: 'Just now',
      read: false,
      category,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = (role = null) => {
    if (!role) {
      setNotifications([]);
    } else {
      setNotifications((prev) => prev.filter((n) => n.recipientRole !== role && n.recipientRole !== 'all'));
    }
    showToast('Notifications Cleared', 'Your notification feed has been cleared.', 'info');
  };

  // Helper to get active employee object
  const getActiveEmployee = () => {
    if (employees.length === 0) return null;
    const found = employees.find((e) => e.id === currentEmployeeId);
    return found || employees[0];
  };

  // Helper to resolve persona metadata
  const getPersonaProfile = (role, emailOverride = null, nameOverride = null) => {
    if (role === 'candidate') {
      return {
        id: currentCandidate?.id || 'cand-001',
        name: nameOverride || currentCandidate?.name || 'Alex Rivera',
        email: emailOverride || currentCandidate?.email || 'alex.rivera@example.com',
        role: 'candidate',
        title: 'Job Candidate',
        badge: 'Candidate',
        organization: organization?.name || 'SecureTenant Systems Inc',
        avatar: 'AR',
      };
    }
    if (role === 'employee') {
      const emp = getActiveEmployee();
      return {
        id: emp?.id || currentEmployeeId || 'emp-001',
        name: nameOverride || emp?.name || 'Jordan Hayes',
        email: emailOverride || emp?.email || 'jordan.hayes@securetenant.io',
        role: 'employee',
        title: emp?.designation || 'Staff Member',
        badge: 'Employee',
        organization: organization?.name || 'SecureTenant Systems Inc',
        avatar: 'JH',
      };
    }
    // Default: HR Admin
    return {
      id: 'usr-hr-01',
      name: nameOverride || 'Sarah Jenkins',
      email: emailOverride || 'admin@securetenant.io',
      role: 'hr',
      title: 'Lead HR Administrator',
      badge: 'HR Admin',
      organization: organization?.name || 'SecureTenant Systems Inc',
      avatar: 'SJ',
    };
  };

  // Role switching helper with persistent session sync
  const switchRole = (newRole) => {
    setActiveRole(newRole);
    if (currentUser) {
      const updatedUser = getPersonaProfile(newRole, currentUser.email);
      setCurrentUser(updatedUser);
      const sessionData = {
        isAuthenticated: true,
        currentUser: updatedUser,
        token: 'st_token_' + Date.now(),
        loginAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error('Storage error syncing switched role', e);
      }
    }
    showToast(
      'Role Switched',
      `Now viewing as ${newRole === 'hr' ? 'HR Administrator' : newRole === 'candidate' ? 'Job Candidate' : 'Employee'}.`,
      'info'
    );
  };

  // Authentication: Login with role, credentials, and persistent storage
  const login = async ({ email, password, role = 'hr', rememberMe = true }) => {
    const userProfile = getPersonaProfile(role, email);

    const sessionData = {
      isAuthenticated: true,
      currentUser: userProfile,
      token: 'st_jwt_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
      loginAt: new Date().toISOString(),
    };

    try {
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      }
    } catch (e) {
      console.error('Storage error during login', e);
    }

    setIsAuthenticated(true);
    setCurrentUser(userProfile);
    setActiveRole(role);

    addActivity(userProfile.name, `Logged in to ${role.toUpperCase()} workspace`, 'CheckCircle');
    showToast('Authentication Successful', `Welcome back, ${userProfile.name}!`);

    return { success: true, user: userProfile };
  };

  // Authentication: Logout with clean session reset
  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Storage error during logout', e);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Signed Out', 'You have been safely logged out of SecureTenant.', 'info');
  };

  // Authentication: Register new account
  const register = async (registerData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
          role: registerData.accountType || 'candidate',
        }),
      });
    } catch (err) {
      console.log('Backend auth unavailable, registering with local session:', err.message);
    }

    const role = registerData.accountType || 'candidate';
    const initials = (registerData.fullName || 'ST')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: 'usr-' + Date.now(),
      name: registerData.fullName || 'New User',
      email: registerData.email,
      role: role,
      title: role === 'hr' ? 'HR Administrator' : 'Candidate',
      badge: role === 'hr' ? 'HR Admin' : 'Candidate',
      organization: registerData.companyName || organization?.name || 'SecureTenant Systems Inc',
      avatar: initials,
    };

    if (role === 'candidate') {
      setCurrentCandidate((prev) => ({
        ...prev,
        name: registerData.fullName || prev.name,
        email: registerData.email || prev.email,
        phone: registerData.phone || prev.phone,
      }));
    }

    const sessionData = {
      isAuthenticated: true,
      currentUser: newUser,
      token: 'st_jwt_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
      loginAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Storage error during register', e);
    }

    setIsAuthenticated(true);
    setCurrentUser(newUser);
    setActiveRole(role);

    addActivity(newUser.name, `Created and verified account as ${role}`, 'CheckCircle');
    showToast('Account Created', `Welcome to SecureTenant, ${newUser.name}!`);

    return { success: true, user: newUser };
  };

  // -------------------------------------------------------------
  // OPEN POSITIONS (HR & Candidate)
  // -------------------------------------------------------------
  const createPosition = (positionData) => {
    const newPos = {
      ...positionData,
      id: 'pos-' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      status: positionData.status || 'Published',
    };
    setOpenPositions((prev) => [newPos, ...prev]);
    addActivity('HR Admin', `Created job opening: ${newPos.title}`, 'Briefcase');
    addNotification('candidate', 'New Job Opening Available', `${newPos.title} in ${newPos.department} is now accepting applications.`, 'Jobs');
    showToast('Job Opening Created', `Successfully posted ${newPos.title}.`);
    return newPos;
  };

  const updatePosition = (id, updatedFields) => {
    setOpenPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, ...updatedFields } : pos))
    );
    addActivity('HR Admin', `Updated job position: ${updatedFields.title || id}`, 'Briefcase');
    showToast('Position Updated', 'Job details were successfully updated.');
  };

  const deletePosition = (id) => {
    const pos = openPositions.find((p) => p.id === id);
    setOpenPositions((prev) => prev.filter((p) => p.id !== id));
    addActivity('HR Admin', `Removed job position: ${pos ? pos.title : id}`, 'Trash');
    showToast('Position Removed', 'Job position was deleted.', 'info');
  };

  // -------------------------------------------------------------
  // APPLICANTS & RECRUITMENT WORKFLOW (Candidate -> HR)
  // -------------------------------------------------------------
  const applyForJob = (positionId, applicationFormData) => {
    const position = openPositions.find((p) => p.id === positionId);
    if (!position) {
      showToast('Error', 'Position not found.', 'error');
      return false;
    }

    // Check duplicate application
    const hasAlreadyApplied = applicants.some(
      (app) => app.candidateId === currentCandidate.id && app.positionId === positionId
    );

    if (hasAlreadyApplied) {
      showToast('Already Applied', 'You have already submitted an application for this position.', 'error');
      return false;
    }

    const newApplication = {
      id: 'app-' + Date.now(),
      candidateId: currentCandidate.id,
      candidateName: applicationFormData.name || currentCandidate.name,
      candidateEmail: applicationFormData.email || currentCandidate.email,
      candidatePhone: applicationFormData.phone || currentCandidate.phone,
      candidateLocation: applicationFormData.location || currentCandidate.location,
      positionId: position.id,
      jobTitle: position.title,
      department: position.department,
      designation: position.designation,
      recruiter: position.recruiter || 'Sarah Jenkins',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied', // Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected
      education: applicationFormData.education || currentCandidate.education,
      experience: applicationFormData.experience || currentCandidate.experience,
      skills: applicationFormData.skills || currentCandidate.skills,
      resumeName: applicationFormData.resumeName || currentCandidate.resumeName,
      coverNote: applicationFormData.coverNote || '',
      rating: 0,
      notes: '',
    };

    setApplicants((prev) => [newApplication, ...prev]);
    addActivity(newApplication.candidateName, `Submitted application for ${position.title}`, 'FileText');
    addNotification('hr', 'New Candidate Application', `${newApplication.candidateName} applied for ${position.title} (${position.department}).`, 'Recruitment');
    addNotification('candidate', 'Application Received', `Your application for ${position.title} has been received by HR.`, 'Recruitment');
    showToast('Application Submitted!', `Successfully applied for ${position.title}. Good luck!`);
    return true;
  };

  const updateApplicationStatus = (applicationId, newStatus, feedback = '') => {
    const app = applicants.find((a) => a.id === applicationId);
    if (!app) return;

    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: newStatus, notes: feedback || a.notes }
          : a
      )
    );

    addActivity('HR Recruiter', `Changed ${app.candidateName}'s status to "${newStatus}" for ${app.jobTitle}`, 'CheckCircle');
    addNotification(
      'candidate',
      `Application Status Update: ${newStatus}`,
      `Your application for ${app.jobTitle} is now marked as "${newStatus}".`,
      'Recruitment'
    );
    showToast('Status Updated', `Application status changed to "${newStatus}".`);
  };

  // -------------------------------------------------------------
  // INTERVIEWS (HR & Candidate)
  // -------------------------------------------------------------
  const scheduleInterview = (interviewData) => {
    const newInterview = {
      ...interviewData,
      id: 'int-' + Date.now(),
      result: 'Scheduled',
    };

    setInterviews((prev) => [newInterview, ...prev]);

    // Automatically update applicant status if linked
    if (newInterview.applicationId) {
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === newInterview.applicationId
            ? { ...a, status: 'Interview Scheduled' }
            : a
        )
      );
    }

    addActivity('HR Recruiter', `Scheduled ${newInterview.stage} for ${newInterview.candidateName}`, 'Calendar');
    addNotification(
      'candidate',
      'Interview Scheduled!',
      `You have an upcoming ${newInterview.stage} for ${newInterview.jobTitle} on ${newInterview.interviewDate} at ${newInterview.interviewTime}.`,
      'Interview'
    );
    showToast('Interview Scheduled', `Interview set for ${newInterview.candidateName} on ${newInterview.interviewDate}.`);
    return newInterview;
  };

  const updateInterview = (id, updatedFields) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updatedFields } : i))
    );
    showToast('Interview Updated', 'Interview details updated successfully.');
  };

  const cancelInterview = (id) => {
    const interview = interviews.find((i) => i.id === id);
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, result: 'Cancelled' } : i))
    );
    if (interview) {
      addActivity('HR Recruiter', `Cancelled interview for ${interview.candidateName}`, 'AlertCircle');
      addNotification('candidate', 'Interview Cancelled', `Your scheduled interview for ${interview.jobTitle} on ${interview.interviewDate} has been cancelled.`, 'Interview');
    }
    showToast('Interview Cancelled', 'The scheduled interview was marked as cancelled.', 'info');
  };

  // -------------------------------------------------------------
  // ONBOARDING & EMPLOYEE CREATION (HR Selection -> Employee)
  // -------------------------------------------------------------
  const onboardCandidateAsEmployee = (applicationId, customOverrides = {}) => {
    const app = applicants.find((a) => a.id === applicationId);
    if (!app) {
      showToast('Error', 'Applicant not found.', 'error');
      return null;
    }

    const employeeCode = 'ST-EMP-' + new Date().getFullYear() + '-' + String(employees.length + 1).padStart(3, '0');
    const newEmployee = {
      id: 'emp-' + Date.now(),
      employeeCode,
      name: app.candidateName,
      email: app.candidateEmail,
      phone: app.candidatePhone || '+1 (555) 000-1234',
      department: app.department,
      designation: app.designation || app.jobTitle,
      employmentStatus: 'Onboarding', // Active, Onboarding, On Leave, Terminated
      employmentType: 'Full-time',
      joiningDate: customOverrides.joiningDate || new Date().toISOString().split('T')[0],
      reportingManager: customOverrides.reportingManager || app.recruiter || 'Sarah Jenkins',
      location: customOverrides.location || 'Austin Headquarters (or Remote)',
      emergencyContact: customOverrides.emergencyContact || 'Pending Submission',
      address: customOverrides.address || app.candidateLocation || 'Pending Submission',
      onboardingProgress: 25,
      annualLeaveBalance: 15,
      sickLeaveBalance: 10,
      casualLeaveBalance: 7,
      applicationId: app.id,
    };

    setEmployees((prev) => [newEmployee, ...prev]);

    // Mark applicant as Selected
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'Selected' } : a))
    );

    // Create an initial offer letter / onboarding doc requirement
    const newDoc = {
      id: 'doc-' + Date.now(),
      employeeId: newEmployee.id,
      employeeName: newEmployee.name,
      documentName: 'Signed_Offer_Letter.pdf',
      documentType: 'Offer Letter',
      submissionDate: new Date().toISOString().split('T')[0],
      fileSize: '320 KB',
      verificationStatus: 'Pending',
      verifiedBy: '',
      notes: 'Awaiting HR verification.',
    };
    setOnboardingDocuments((prev) => [newDoc, ...prev]);

    // If no active employee selected, set as current employee
    if (!currentEmployeeId) {
      setCurrentEmployeeId(newEmployee.id);
    }

    addActivity('HR Admin', `Converted candidate ${newEmployee.name} to Employee (${employeeCode})`, 'UserCheck');
    addNotification('employee', 'Welcome to SecureTenant!', `Your employee account (${employeeCode}) is ready. Please complete your onboarding documents.`, 'Onboarding');
    addNotification('hr', 'New Employee Onboarding Started', `${newEmployee.name} is now initiated into the onboarding workflow.`, 'Onboarding');
    showToast('Candidate Onboarded!', `${newEmployee.name} created as employee with ID ${employeeCode}.`);
    return newEmployee;
  };

  const addEmployee = (employeeData) => {
    const employeeCode = 'ST-EMP-' + new Date().getFullYear() + '-' + String(employees.length + 1).padStart(3, '0');
    const newEmp = {
      ...employeeData,
      id: 'emp-' + Date.now(),
      employeeCode: employeeData.employeeCode || employeeCode,
      employmentStatus: employeeData.employmentStatus || 'Active',
      onboardingProgress: employeeData.onboardingProgress || 100,
      annualLeaveBalance: employeeData.annualLeaveBalance || 15,
      sickLeaveBalance: employeeData.sickLeaveBalance || 10,
      casualLeaveBalance: employeeData.casualLeaveBalance || 7,
      joiningDate: employeeData.joiningDate || new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [newEmp, ...prev]);
    if (!currentEmployeeId) {
      setCurrentEmployeeId(newEmp.id);
    }
    addActivity('HR Admin', `Added new employee ${newEmp.name} (${newEmp.employeeCode})`, 'Users');
    showToast('Employee Added', `Employee record for ${newEmp.name} created successfully.`);
    return newEmp;
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedFields } : emp))
    );
    showToast('Employee Updated', 'Employee details saved successfully.');
  };

  // -------------------------------------------------------------
  // LEAVE MANAGEMENT (Employee -> HR)
  // -------------------------------------------------------------
  const submitLeaveRequest = (leaveData) => {
    const activeEmp = getActiveEmployee();
    const newRequest = {
      ...leaveData,
      id: 'leave-' + Date.now(),
      employeeId: activeEmp ? activeEmp.id : 'emp-sample',
      employeeName: activeEmp ? activeEmp.name : 'Employee User',
      department: activeEmp ? activeEmp.department : 'General',
      designation: activeEmp ? activeEmp.designation : 'Staff',
      remainingBalance: activeEmp ? activeEmp.annualLeaveBalance : 12,
      status: 'Pending', // Pending, Approved, Rejected
      appliedDate: new Date().toISOString().split('T')[0],
      hrComment: '',
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    addActivity(newRequest.employeeName, `Submitted ${newRequest.leaveType} request for ${newRequest.daysCount} days`, 'Calendar');
    addNotification('hr', 'New Leave Request', `${newRequest.employeeName} requested ${newRequest.daysCount} days of ${newRequest.leaveType}.`, 'Leave');
    showToast('Leave Request Submitted', 'Your leave request has been sent to HR for approval.');
    return newRequest;
  };

  const updateLeaveStatus = (leaveId, status, hrComment = '') => {
    const request = leaveRequests.find((r) => r.id === leaveId);
    if (!request) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === leaveId ? { ...r, status, hrComment: hrComment || r.hrComment } : r
      )
    );

    // If approved, deduct from employee's balance
    if (status === 'Approved' && request.employeeId) {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === request.employeeId) {
            const days = parseInt(request.daysCount) || 1;
            const updatedAnnual = Math.max(0, (emp.annualLeaveBalance || 15) - days);
            return { ...emp, annualLeaveBalance: updatedAnnual };
          }
          return emp;
        })
      );
    }

    addActivity('HR Admin', `${status} leave request for ${request.employeeName}`, status === 'Approved' ? 'CheckCircle' : 'XCircle');
    addNotification('employee', `Leave Request ${status}`, `Your leave request from ${request.startDate} to ${request.endDate} was ${status.toLowerCase()}.${hrComment ? ` Note: ${hrComment}` : ''}`, 'Leave');
    showToast(`Leave ${status}`, `Request for ${request.employeeName} has been ${status.toLowerCase()}.`);
  };

  // -------------------------------------------------------------
  // HOLIDAY MANAGEMENT (HR -> Employee)
  // -------------------------------------------------------------
  const addHoliday = (holidayData) => {
    const newHoliday = {
      ...holidayData,
      id: 'hol-' + Date.now(),
    };
    setHolidays((prev) => [...prev, newHoliday].sort((a, b) => new Date(a.date) - new Date(b.date)));
    addActivity('HR Admin', `Added holiday: ${newHoliday.name} (${newHoliday.date})`, 'Calendar');
    addNotification('employee', 'New Holiday Added', `${newHoliday.name} on ${newHoliday.date} added to company calendar.`, 'Company');
    showToast('Holiday Added', `${newHoliday.name} scheduled for ${newHoliday.date}.`);
    return newHoliday;
  };

  const updateHoliday = (id, updatedFields) => {
    setHolidays((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedFields } : h))
    );
    showToast('Holiday Updated', 'Holiday details modified.');
  };

  const deleteHoliday = (id) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    showToast('Holiday Removed', 'Holiday deleted from calendar.', 'info');
  };

  // -------------------------------------------------------------
  // ONBOARDING & DOCUMENTS (Employee -> HR)
  // -------------------------------------------------------------
  const submitDocument = (docData) => {
    const activeEmp = getActiveEmployee();
    const newDoc = {
      ...docData,
      id: 'doc-' + Date.now(),
      employeeId: activeEmp ? activeEmp.id : 'emp-sample',
      employeeName: activeEmp ? activeEmp.name : 'Employee User',
      submissionDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending',
      verifiedBy: '',
      notes: '',
    };
    setOnboardingDocuments((prev) => [newDoc, ...prev]);
    addActivity(newDoc.employeeName, `Submitted onboarding document: ${newDoc.documentName}`, 'FileText');
    addNotification('hr', 'New Onboarding Document', `${newDoc.employeeName} submitted ${newDoc.documentType} for verification.`, 'Onboarding');
    showToast('Document Submitted', `${newDoc.documentName} submitted for HR verification.`);
    return newDoc;
  };

  const verifyDocument = (docId, status, notes = '') => {
    const doc = onboardingDocuments.find((d) => d.id === docId);
    if (!doc) return;

    setOnboardingDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, verificationStatus: status, notes: notes || d.notes, verifiedBy: 'HR Admin' }
          : d
      )
    );

    // Update employee onboarding progress percentage
    if (status === 'Verified' && doc.employeeId) {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === doc.employeeId) {
            const newProgress = Math.min(100, (emp.onboardingProgress || 25) + 25);
            return {
              ...emp,
              onboardingProgress: newProgress,
              employmentStatus: newProgress === 100 ? 'Active' : emp.employmentStatus,
            };
          }
          return emp;
        })
      );
    }

    addActivity('HR Admin', `Marked document "${doc.documentName}" as ${status}`, status === 'Verified' ? 'CheckCircle' : 'XCircle');
    addNotification('employee', `Document ${status}`, `Your document "${doc.documentName}" was ${status.toLowerCase()} by HR.`, 'Onboarding');
    showToast(`Document ${status}`, `Document status set to ${status}.`);
  };

  // -------------------------------------------------------------
  // PERFORMANCE MANAGEMENT
  // -------------------------------------------------------------
  const addPerformanceReview = (reviewData) => {
    const newReview = {
      ...reviewData,
      id: 'perf-' + Date.now(),
      reviewDate: new Date().toISOString().split('T')[0],
    };
    setPerformanceReviews((prev) => [newReview, ...prev]);
    addActivity('HR / Manager', `Completed performance appraisal for ${newReview.employeeName}`, 'Award');
    addNotification('employee', 'Performance Appraisal Published', `Your manager completed your performance review for ${newReview.reviewPeriod}.`, 'Performance');
    showToast('Performance Review Saved', `Review for ${newReview.employeeName} has been recorded.`);
    return newReview;
  };

  // -------------------------------------------------------------
  // DEPARTMENTS & ROLES MANAGEMENT
  // -------------------------------------------------------------
  const addDepartment = (deptData) => {
    const newDept = {
      ...deptData,
      id: 'dept-' + Date.now(),
      code: deptData.code || deptData.name.toUpperCase().substring(0, 4),
    };
    setDepartments((prev) => [...prev, newDept]);
    showToast('Department Created', `${newDept.name} department created.`);
  };

  const updateDepartment = (id, updatedFields) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
    showToast('Department Updated', 'Department saved successfully.');
  };

  const deleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    showToast('Department Deleted', 'Department removed.', 'info');
  };

  const addDesignation = (roleData) => {
    const newRole = {
      ...roleData,
      id: 'desig-' + Date.now(),
    };
    setDesignations((prev) => [...prev, newRole]);
    showToast('Role Added', `${newRole.title} added to organization roles.`);
  };

  const deleteDesignation = (id) => {
    setDesignations((prev) => prev.filter((r) => r.id !== id));
    showToast('Role Removed', 'Job role removed.', 'info');
  };

  // -------------------------------------------------------------
  // PROFILES (Candidate & Employee)
  // -------------------------------------------------------------
  const updateCandidateProfile = (updatedProfile) => {
    setCurrentCandidate((prev) => ({ ...prev, ...updatedProfile }));
    showToast('Profile Saved', 'Candidate profile updated.');
  };

  const updateEmployeeProfile = (id, updatedProfile) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedProfile } : emp))
    );
    showToast('Profile Saved', 'Personal information saved.');
  };

  // -------------------------------------------------------------
  // DEMO PRELOAD & RESET SCENARIOS
  // -------------------------------------------------------------
  const preloadDemoData = () => {
    setOpenPositions(sampleWalkthroughData.openPositions);
    setApplicants(sampleWalkthroughData.applicants);
    setInterviews(sampleWalkthroughData.interviews);
    setEmployees(sampleWalkthroughData.employees);
    setLeaveRequests(sampleWalkthroughData.leaveRequests);
    setHolidays(sampleWalkthroughData.holidays);
    setOnboardingDocuments(sampleWalkthroughData.onboardingDocuments);
    setPerformanceReviews(sampleWalkthroughData.performanceReviews);
    setNotifications(sampleWalkthroughData.notifications);
    setActivities(sampleWalkthroughData.activities);
    setCurrentEmployeeId(sampleWalkthroughData.employees[0].id);
    showToast('Demo Data Loaded!', 'Loaded sample positions, applicants, employees, leaves, holidays, and reviews.');
  };

  const resetToZeroData = () => {
    setApplicants([]);
    setInterviews([]);
    setEmployees([]);
    setLeaveRequests([]);
    setHolidays([]);
    setOnboardingDocuments([]);
    setPerformanceReviews([]);
    setNotifications([]);
    setActivities([]);
    setCurrentEmployeeId(null);
    showToast('Reset to Zero State', 'All operational collections are now empty.');
  };

  // Provide initial employee if none exists when creating on the fly
  const createQuickDemoEmployee = () => {
    const demoEmp = {
      id: 'emp-demo-' + Date.now(),
      employeeCode: 'ST-EMP-2026-001',
      name: 'Jordan Hayes',
      email: 'jordan.hayes@securetenant.com',
      phone: '+1 (555) 987-6543',
      department: 'IT',
      designation: 'Software Developer',
      employmentStatus: 'Active',
      employmentType: 'Full-time',
      joiningDate: '2026-01-10',
      reportingManager: 'Marcus Vance',
      location: 'Austin Headquarters',
      emergencyContact: 'Morgan Hayes (+1 555-098-1122)',
      address: '410 Congress Ave, Suite 500, Austin, TX',
      onboardingProgress: 80,
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 6,
    };
    setEmployees([demoEmp]);
    setCurrentEmployeeId(demoEmp.id);
    showToast('Employee Profile Created', 'Demo employee profile is now active.');
    return demoEmp;
  };

  return (
    <AppContext.Provider
      value={{
        // Authentication & Session
        isAuthenticated,
        currentUser,
        login,
        logout,
        register,

        // Role & Auth preview
        activeRole,
        switchRole,
        organization,
        setOrganization,
        departments,
        designations,
        recruiters,

        // Core Collections
        openPositions,
        applicants,
        interviews,
        employees,
        leaveRequests,
        holidays,
        onboardingDocuments,
        performanceReviews,
        notifications,
        activities,

        // Current Role Focus
        currentCandidate,
        currentEmployee: getActiveEmployee(),
        currentEmployeeId,
        setCurrentEmployeeId,
        createQuickDemoEmployee,

        // Actions
        createPosition,
        updatePosition,
        deletePosition,
        applyForJob,
        updateApplicationStatus,
        scheduleInterview,
        updateInterview,
        cancelInterview,
        onboardCandidateAsEmployee,
        addEmployee,
        updateEmployee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addDesignation,
        deleteDesignation,
        submitLeaveRequest,
        updateLeaveStatus,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        submitDocument,
        verifyDocument,
        addPerformanceReview,
        updateCandidateProfile,
        updateEmployeeProfile,

        // Notifications & Activities
        addNotification,
        markNotificationRead,
        clearNotifications,
        addActivity,

        // Toasts & Demo controls
        toasts,
        showToast,
        dismissToast,
        preloadDemoData,
        resetToZeroData,
      }}
    >
      {children}

      {/* Floating Toast Alerts Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : toast.type === 'info'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-violet-50 border-violet-200 text-violet-900'
            }`}
          >
            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;


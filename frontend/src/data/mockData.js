// SecureTenant Data Model and Initial Constants

export const initialOrganization = {
  name: "SecureTenant Enterprise",
  tenantId: "TENANT-ST-2026-X",
  industry: "BPO & Cloud Enterprise Solutions",
  headquarters: "Austin, Texas, USA",
  domain: "securetenant.io",
  timezone: "UTC-6 (Central Time)",
  currency: "USD ($)",
  totalBranchOffices: 4,
};

export const initialDepartments = [
  { id: "dept-it", name: "IT", code: "IT-ENG", head: "Marcus Vance", description: "Software engineering, infrastructure, and technical architecture." },
  { id: "dept-bpo", name: "BPO", code: "OPS-BPO", head: "Aisha Patel", description: "Customer experience, voice operations, and chat support services." },
  { id: "dept-hr", name: "HR", code: "TALENT-HR", head: "Sarah Jenkins", description: "Talent acquisition, employee engagement, and organizational growth." },
  { id: "dept-fin", name: "Finance", code: "FIN-ACC", head: "David Chen", description: "Corporate accounting, financial planning, and payroll auditing." },
  { id: "dept-sales", name: "Sales", code: "SALES-GLB", head: "Rachel Green", description: "Client acquisition, account management, and enterprise partnerships." },
  { id: "dept-mkt", name: "Marketing", code: "MKT-BRD", head: "Leon Thorne", description: "Brand design, product marketing, demand generation, and SEO." },
];

export const initialDesignations = [
  { id: "desig-1", title: "Software Developer", department: "IT", level: "Mid-Senior" },
  { id: "desig-2", title: "Python Developer", department: "IT", level: "Senior" },
  { id: "desig-3", title: "Calling Executive", department: "BPO", level: "Associate" },
  { id: "desig-4", title: "Chat Support Executive", department: "BPO", level: "Junior" },
  { id: "desig-5", title: "HR Generalist", department: "HR", level: "Mid" },
  { id: "desig-6", title: "Financial Analyst", department: "Finance", level: "Mid" },
  { id: "desig-7", title: "Account Executive", department: "Sales", level: "Mid-Senior" },
];

export const initialRecruiters = [
  { id: "rec-1", name: "Sarah Jenkins", email: "sarah.jenkins@securetenant.com", role: "Lead Talent Partner", departments: ["IT", "HR"] },
  { id: "rec-2", name: "Marcus Vance", email: "marcus.vance@securetenant.com", role: "Operations Recruiter", departments: ["BPO", "Sales"] },
  { id: "rec-3", name: "Elena Rostova", email: "elena.rostova@securetenant.com", role: "Technical Talent Specialist", departments: ["IT", "Finance"] },
];

export const initialCandidateProfile = {
  id: "cand-user-01",
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 432-8765",
  location: "San Francisco, CA (Open to Remote)",
  headline: "Full Stack Engineer & Python Backend Specialist",
  education: "B.S. in Computer Science - UC Berkeley (2020)",
  experience: "4+ years in React, Python, PostgreSQL, REST APIs, and Cloud Deployments.",
  skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Tailwind CSS", "Git"],
  bio: "Curious and reliable engineer with hands-on experience building SaaS microservices, clean frontends, and automated workflows.",
  resumeName: "Alex_Rivera_Software_Engineer_Resume.pdf",
  resumeSize: "248 KB",
  resumeUploadedDate: "2026-03-15",
};

// Initial clean state according to specifications:
// Initial applicants: 0
export const initialApplicants = [];

// Initial employees: 0
export const initialEmployees = [];

// Initial positions: empty or initialized via HR
export const initialOpenPositions = [
  {
    id: "pos-101",
    title: "Senior Python Developer",
    department: "IT",
    designation: "Python Developer",
    location: "Remote / Austin, TX",
    employmentType: "Full-time",
    description: "Architect and scale backend REST APIs and microservices using Python, FastAPI, and PostgreSQL. Collaborate with React frontend engineers to ship reliable features.",
    qualifications: "Bachelor's degree in Computer Science or equivalent practical experience.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
    experience: "3+ years",
    recruiter: "Elena Rostova",
    postedDate: "2026-03-10",
    status: "Published", // "Published" | "Draft" | "Closed"
    salaryRange: "$110,000 - $135,000",
  },
  {
    id: "pos-102",
    title: "Chat Support Executive",
    department: "BPO",
    designation: "Chat Support Executive",
    location: "On-site / Dallas, TX",
    employmentType: "Full-time",
    description: "Provide exceptional, prompt, and empathetic omnichannel chat and email support to high-growth enterprise SaaS users.",
    qualifications: "High School Diploma or Associate Degree. Strong written communication skills.",
    skills: ["Customer Communication", "Zendesk", "Problem Solving", "Multi-tasking"],
    experience: "1+ years",
    recruiter: "Marcus Vance",
    postedDate: "2026-03-12",
    status: "Published",
    salaryRange: "$45,000 - $55,000",
  },
];

export const initialLeaveRequests = [];
export const initialHolidays = [];
export const initialOnboardingDocuments = [];
export const initialPerformanceReviews = [];
export const initialInterviews = [];
export const initialNotifications = [];
export const initialActivities = [];

// Realistic Preset for 1-Click Interactive Demo Simulation
export const sampleWalkthroughData = {
  openPositions: [
    {
      id: "pos-101",
      title: "Senior Python Developer",
      department: "IT",
      designation: "Python Developer",
      location: "Remote / Austin, TX",
      employmentType: "Full-time",
      description: "Architect and scale backend REST APIs and microservices using Python, FastAPI, and PostgreSQL. Collaborate with React frontend engineers to ship reliable features.",
      qualifications: "Bachelor's degree in Computer Science or equivalent practical experience.",
      skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
      experience: "3+ years",
      recruiter: "Elena Rostova",
      postedDate: "2026-03-10",
      status: "Published",
      salaryRange: "$110,000 - $135,000",
    },
    {
      id: "pos-102",
      title: "Chat Support Executive",
      department: "BPO",
      designation: "Chat Support Executive",
      location: "On-site / Dallas, TX",
      employmentType: "Full-time",
      description: "Provide exceptional, prompt, and empathetic omnichannel chat and email support to high-growth enterprise SaaS users.",
      qualifications: "High School Diploma or Associate Degree. Strong written communication skills.",
      skills: ["Customer Communication", "Zendesk", "Problem Solving", "Multi-tasking"],
      experience: "1+ years",
      recruiter: "Marcus Vance",
      postedDate: "2026-03-12",
      status: "Published",
      salaryRange: "$45,000 - $55,000",
    },
    {
      id: "pos-103",
      title: "Calling Executive (Voice Inbound)",
      department: "BPO",
      designation: "Calling Executive",
      location: "On-site / Dallas, TX",
      employmentType: "Full-time",
      description: "Manage inbound inquiries, handle customer escalations, and maintain CRM documentation.",
      qualifications: "Excellent verbal articulation, fluent English, customer service orientation.",
      skills: ["Voice Support", "Active Listening", "CRM", "Conflict Resolution"],
      experience: "0-2 years",
      recruiter: "Marcus Vance",
      postedDate: "2026-03-14",
      status: "Published",
      salaryRange: "$42,000 - $50,000",
    },
  ],
  applicants: [
    {
      id: "app-201",
      candidateId: "cand-user-01",
      candidateName: "Alex Rivera",
      candidateEmail: "alex.rivera@example.com",
      candidatePhone: "+1 (555) 432-8765",
      candidateLocation: "San Francisco, CA (Open to Remote)",
      positionId: "pos-101",
      jobTitle: "Senior Python Developer",
      department: "IT",
      designation: "Python Developer",
      recruiter: "Elena Rostova",
      appliedDate: "2026-03-16",
      status: "Interview Scheduled", // Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected
      education: "B.S. in Computer Science - UC Berkeley",
      experience: "4+ years full stack & Python backend engineering",
      skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Tailwind CSS"],
      resumeName: "Alex_Rivera_Software_Engineer_Resume.pdf",
      coverNote: "I'm very excited about SecureTenant's multi-tenant architecture and would love to bring my backend API expertise to the engineering team.",
      rating: 5,
      notes: "Strong technical portfolio with production FastAPI and PostgreSQL experience. Scheduled for Technical Interview.",
    },
  ],
  interviews: [
    {
      id: "int-301",
      applicationId: "app-201",
      candidateName: "Alex Rivera",
      candidateEmail: "alex.rivera@example.com",
      jobTitle: "Senior Python Developer",
      department: "IT",
      interviewDate: "2026-03-24",
      interviewTime: "14:00 (2:00 PM CST)",
      interviewer: "Elena Rostova & Marcus Vance",
      stage: "Technical Round",
      format: "Google Meet Video Call",
      meetingLink: "https://meet.securetenant.dev/interview-py-301",
      feedback: "Candidate demonstrated in-depth knowledge of database indexing and asynchronous event queues.",
      result: "Scheduled", // Scheduled, Completed, Passed, Failed, Cancelled
    },
  ],
  employees: [
    {
      id: "emp-101",
      employeeCode: "ST-EMP-2026-001",
      name: "Jordan Hayes",
      email: "jordan.hayes@securetenant.com",
      phone: "+1 (555) 987-6543",
      department: "IT",
      designation: "Software Developer",
      employmentStatus: "Active", // Active, Onboarding, On Leave, Terminated
      employmentType: "Full-time",
      joiningDate: "2025-11-01",
      reportingManager: "Marcus Vance",
      location: "Austin Headquarters",
      emergencyContact: "Morgan Hayes (+1 555-098-1122)",
      address: "410 Congress Ave, Suite 500, Austin, TX",
      onboardingProgress: 100,
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 5,
    },
  ],
  leaveRequests: [
    {
      id: "leave-401",
      employeeId: "emp-101",
      employeeName: "Jordan Hayes",
      department: "IT",
      designation: "Software Developer",
      leaveType: "Annual Leave",
      startDate: "2026-04-10",
      endDate: "2026-04-14",
      daysCount: 3,
      reason: "Family gathering and personal travel.",
      remainingBalance: 14,
      status: "Pending", // Pending, Approved, Rejected
      appliedDate: "2026-03-18",
      hrComment: "",
    },
  ],
  holidays: [
    {
      id: "hol-501",
      name: "Memorial Day",
      date: "2026-05-25",
      type: "National Holiday",
      department: "All Departments",
      description: "Company-wide paid federal observance.",
    },
    {
      id: "hol-502",
      name: "Independence Day Observance",
      date: "2026-07-03",
      type: "National Holiday",
      department: "All Departments",
      description: "Official United States Independence Day observance day-off.",
    },
    {
      id: "hol-503",
      name: "Labor Day",
      date: "2026-09-07",
      type: "National Holiday",
      department: "All Departments",
      description: "Celebration of the American labor movement.",
    },
  ],
  onboardingDocuments: [
    {
      id: "doc-601",
      employeeId: "emp-101",
      employeeName: "Jordan Hayes",
      documentName: "Government_Issued_Photo_ID.pdf",
      documentType: "Identity Proof",
      submissionDate: "2025-11-02",
      fileSize: "1.4 MB",
      verificationStatus: "Verified", // Pending, Verified, Rejected
      verifiedBy: "Sarah Jenkins",
      notes: "Passport photo and details verified cleanly.",
    },
  ],
  performanceReviews: [
    {
      id: "perf-701",
      employeeId: "emp-101",
      employeeName: "Jordan Hayes",
      department: "IT",
      designation: "Software Developer",
      reviewPeriod: "Q4 2025 Review",
      reviewDate: "2026-01-15",
      rating: 4.8,
      goals: "Deliver tenant isolation security audits, streamline API gateway response latency.",
      achievements: "Reduced average query response time by 34% and refactored authentication middleware.",
      managerFeedback: "Exceptional ownership, proactive communication, and high-quality unit test coverage.",
      trainingNeeds: "Advanced Kubernetes container security certification.",
    },
  ],
  notifications: [
    {
      id: "notif-801",
      recipientRole: "hr",
      title: "New Leave Request Submitted",
      message: "Jordan Hayes (IT) submitted an Annual Leave request for 3 days.",
      timestamp: "10 mins ago",
      read: false,
      category: "Leave",
    },
    {
      id: "notif-802",
      recipientRole: "candidate",
      title: "Interview Scheduled!",
      message: "Your Technical Round interview for Senior Python Developer is set for Mar 24, 2026.",
      timestamp: "1 hour ago",
      read: false,
      category: "Recruitment",
    },
    {
      id: "notif-803",
      recipientRole: "employee",
      title: "Holiday Calendar Updated",
      message: "HR has published the upcoming 2026 company holidays.",
      timestamp: "1 day ago",
      read: true,
      category: "Company",
    },
  ],
  activities: [
    {
      id: "act-901",
      user: "Sarah Jenkins (HR)",
      action: "Scheduled technical interview for Alex Rivera (Senior Python Developer)",
      timestamp: "Today at 10:30 AM",
      icon: "Calendar",
    },
    {
      id: "act-902",
      user: "Jordan Hayes (Employee)",
      action: "Submitted Annual Leave request for April 10-14",
      timestamp: "Today at 09:15 AM",
      icon: "Clock",
    },
    {
      id: "act-903",
      user: "Elena Rostova (HR)",
      action: "Published new opening: Senior Python Developer",
      timestamp: "Yesterday at 04:00 PM",
      icon: "Briefcase",
    },
  ],
};


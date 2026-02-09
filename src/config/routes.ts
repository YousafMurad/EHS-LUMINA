// Route Configuration
export const ROUTES = {
  // Auth Routes
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  // Dashboard
  dashboard: {
    root: "/dashboard",
    admin: "/dashboard/admin",
    accountant: "/dashboard/accountant",
    teacher: "/dashboard/teacher",
  },

  // Students
  students: {
    list: "/students",
    new: "/students/new",
    view: (id: string) => `/students/${id}`,
    edit: (id: string) => `/students/${id}/edit`,
    fees: (id: string) => `/students/${id}/fees`,
    family: (id: string) => `/students/${id}/family`,
    certificates: (id: string) => `/students/${id}/certificates`,
    old: "/students/old",
  },

  // Classes
  classes: {
    list: "/classes",
    new: "/classes/new",
    view: (id: string) => `/classes/${id}`,
    edit: (id: string) => `/classes/${id}/edit`,
  },

  // Sections
  sections: {
    list: "/sections",
    new: "/sections/new",
    view: (id: string) => `/sections/${id}`,
  },

  // Teachers
  teachers: {
    list: "/teachers",
    new: "/teachers/new",
    view: (id: string) => `/teachers/${id}`,
    edit: (id: string) => `/teachers/${id}/edit`,
  },

  // Operators
  operators: {
    list: "/operators",
    new: "/operators/new",
    view: (id: string) => `/operators/${id}`,
    permissions: (id: string) => `/operators/${id}/permissions`,
  },

  // Fees
  fees: {
    overview: "/fees",
    structures: "/fees/structures",
    collection: "/fees/collection",
    dues: "/fees/dues",
    discounts: "/fees/discounts",
    fines: "/fees/fines",
    memo: "/fees/memo",
    history: "/fees/history",
  },

  // Promotions
  promotions: {
    list: "/promotions",
    bulk: "/promotions/bulk",
    history: "/promotions/history",
  },

  // Sessions
  sessions: {
    list: "/sessions",
    new: "/sessions/new",
    view: (id: string) => `/sessions/${id}`,
  },

  // Reports
  reports: {
    overview: "/reports",
    fees: "/reports/fees",
    students: "/reports/students",
    attendance: "/reports/attendance",
    financial: "/reports/financial",
  },

  // Certificates
  certificates: {
    overview: "/certificates",
    slc: "/certificates/slc",
    character: "/certificates/character",
    resultCard: "/certificates/result-card",
  },

  // Settings
  settings: {
    overview: "/settings",
    general: "/settings/general",
    roles: "/settings/roles",
    fees: "/settings/fees",
    policies: "/settings/policies",
    auditLogs: "/settings/audit-logs",
  },
} as const;

// Public routes (no auth required)
export const PUBLIC_ROUTES = [
  ROUTES.auth.login,
  ROUTES.auth.register,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.resetPassword,
];

// Protected routes (require auth)
export const PROTECTED_ROUTES = [
  ROUTES.dashboard.root,
  ROUTES.students.list,
  ROUTES.classes.list,
  ROUTES.sections.list,
  ROUTES.teachers.list,
  ROUTES.operators.list,
  ROUTES.fees.overview,
  ROUTES.promotions.list,
  ROUTES.sessions.list,
  ROUTES.reports.overview,
  ROUTES.certificates.overview,
  ROUTES.settings.overview,
];

// Admin only routes
export const ADMIN_ROUTES = [
  ROUTES.operators.list,
  ROUTES.settings.roles,
  ROUTES.settings.auditLogs,
];

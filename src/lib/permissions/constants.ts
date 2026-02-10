// Permission Types and Constants
export const PERMISSIONS = {
  // Student permissions
  STUDENTS_VIEW: "students.view",
  STUDENTS_CREATE: "students.create",
  STUDENTS_EDIT: "students.edit",
  STUDENTS_DELETE: "students.delete",
  STUDENTS_EXPORT: "students.export",
  
  // Class permissions
  CLASSES_VIEW: "classes.view",
  CLASSES_CREATE: "classes.create",
  CLASSES_EDIT: "classes.edit",
  CLASSES_DELETE: "classes.delete",
  
  // Section permissions
  SECTIONS_VIEW: "sections.view",
  SECTIONS_CREATE: "sections.create",
  SECTIONS_EDIT: "sections.edit",
  SECTIONS_DELETE: "sections.delete",
  
  // Teacher permissions
  TEACHERS_VIEW: "teachers.view",
  TEACHERS_CREATE: "teachers.create",
  TEACHERS_EDIT: "teachers.edit",
  TEACHERS_DELETE: "teachers.delete",
  TEACHERS_SALARY: "teachers.salary",
  
  // Fee permissions
  FEES_VIEW: "fees.view",
  FEES_COLLECT: "fees.collect",
  FEES_STRUCTURE: "fees.structure",
  FEES_DISCOUNT: "fees.discount",
  FEES_REPORTS: "fees.reports",
  
  // Promotion permissions
  PROMOTIONS_VIEW: "promotions.view",
  PROMOTIONS_SINGLE: "promotions.single",
  PROMOTIONS_BULK: "promotions.bulk",
  
  // Settings permissions
  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",
  SETTINGS_ROLES: "settings.roles",
  
  // Operator permissions
  OPERATORS_VIEW: "operators.view",
  OPERATORS_CREATE: "operators.create",
  OPERATORS_EDIT: "operators.edit",
  OPERATORS_DELETE: "operators.delete",
  
  // Report permissions
  REPORTS_VIEW: "reports.view",
  REPORTS_FINANCIAL: "reports.financial",
  REPORTS_EXPORT: "reports.export",
  
  // Certificate permissions
  CERTIFICATES_VIEW: "certificates.view",
  CERTIFICATES_GENERATE: "certificates.generate",
  
  // Audit permissions
  AUDIT_VIEW: "audit.view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  STUDENTS: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.STUDENTS_DELETE,
    PERMISSIONS.STUDENTS_EXPORT,
  ],
  CLASSES: [
    PERMISSIONS.CLASSES_VIEW,
    PERMISSIONS.CLASSES_CREATE,
    PERMISSIONS.CLASSES_EDIT,
    PERMISSIONS.CLASSES_DELETE,
  ],
  SECTIONS: [
    PERMISSIONS.SECTIONS_VIEW,
    PERMISSIONS.SECTIONS_CREATE,
    PERMISSIONS.SECTIONS_EDIT,
    PERMISSIONS.SECTIONS_DELETE,
  ],
  TEACHERS: [
    PERMISSIONS.TEACHERS_VIEW,
    PERMISSIONS.TEACHERS_CREATE,
    PERMISSIONS.TEACHERS_EDIT,
    PERMISSIONS.TEACHERS_DELETE,
    PERMISSIONS.TEACHERS_SALARY,
  ],
  FEES: [
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_COLLECT,
    PERMISSIONS.FEES_STRUCTURE,
    PERMISSIONS.FEES_DISCOUNT,
    PERMISSIONS.FEES_REPORTS,
  ],
  PROMOTIONS: [
    PERMISSIONS.PROMOTIONS_VIEW,
    PERMISSIONS.PROMOTIONS_SINGLE,
    PERMISSIONS.PROMOTIONS_BULK,
  ],
  SETTINGS: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.SETTINGS_ROLES,
  ],
  OPERATORS: [
    PERMISSIONS.OPERATORS_VIEW,
    PERMISSIONS.OPERATORS_CREATE,
    PERMISSIONS.OPERATORS_EDIT,
    PERMISSIONS.OPERATORS_DELETE,
  ],
  REPORTS: [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_FINANCIAL,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  CERTIFICATES: [
    PERMISSIONS.CERTIFICATES_VIEW,
    PERMISSIONS.CERTIFICATES_GENERATE,
  ],
};

// Role Constants and Types
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  ACCOUNTANT: "accountant",
  TEACHER: "teacher",
  OPERATOR: "operator",
  STUDENT: "student",
  PARENT: "parent",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy - higher index = more permissions
export const ROLE_HIERARCHY_ARRAY: Role[] = [
  ROLES.STUDENT,
  ROLES.PARENT,
  ROLES.OPERATOR,
  ROLES.TEACHER,
  ROLES.ACCOUNTANT,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

// Role hierarchy as a record for direct lookup
export const ROLE_HIERARCHY: Record<Role, number> = {
  student: 0,
  parent: 1,
  operator: 2,
  teacher: 3,
  accountant: 4,
  admin: 5,
  super_admin: 6,
};

// Check if role has higher or equal permission level
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

// Role display names
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  accountant: "Accountant",
  teacher: "Teacher",
  operator: "Operator",
  student: "Student",
  parent: "Parent",
};

// Common/Shared Types
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActionResult<T = void> {
  success?: boolean;
  error?: string;
  data?: T;
  message?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  options: SelectOption[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSections: number;
  feeCollectedThisMonth: number;
  totalFeePending: number;
}

export interface ChartData {
  label: string;
  value: number;
}

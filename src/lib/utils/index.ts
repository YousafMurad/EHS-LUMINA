// Utils barrel export
export { validateField, validateForm, PATTERNS, type ValidationRule, type ValidationResult } from "./validation";
export {
  formatDate,
  toISODate,
  getCurrentAcademicYear,
  getMonthName,
  getAcademicMonths,
  calculateAge,
  isOverdue,
  getDaysUntilDue,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "./date";
export {
  formatCurrency,
  formatNumber,
  parseCurrency,
  calculatePercentage,
  formatPercentage,
  roundTo,
  calculateFeeBreakdown,
} from "./currency";
export {
  slugify,
  capitalize,
  titleCase,
  truncate,
  getInitials,
  formatRegistrationNo,
  parseRegistrationNo,
  generateId,
} from "./string";
export { cn } from "./cn";

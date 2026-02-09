// Date Utilities
import { format, parseISO, differenceInDays, addDays, addMonths, startOfMonth, endOfMonth } from "date-fns";

// Format date for display
export function formatDate(date: Date | string, pattern: string = "MMM dd, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

// Format date for database
export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Get current academic year (e.g., "2025-2026")
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  // Academic year starts in April
  if (month >= 3) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

// Get month name
export function getMonthName(monthIndex: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

// Get fee months for academic year
export function getAcademicMonths(startMonth: number = 3): { month: number; year: number; label: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const months = [];
  
  for (let i = 0; i < 12; i++) {
    const monthIndex = (startMonth + i) % 12;
    const year = monthIndex >= startMonth ? currentYear : currentYear + 1;
    months.push({
      month: monthIndex,
      year,
      label: `${getMonthName(monthIndex)} ${year}`,
    });
  }
  
  return months;
}

// Calculate age from date of birth
export function calculateAge(dob: Date | string): number {
  const birthDate = typeof dob === "string" ? parseISO(dob) : dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Check if date is overdue
export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return differenceInDays(new Date(), due) > 0;
}

// Get days until due
export function getDaysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return differenceInDays(due, new Date());
}

export { addDays, addMonths, startOfMonth, endOfMonth, parseISO };

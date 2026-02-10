// String Utilities

// Generate slug from string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Title case
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

// Truncate text
export function truncate(text: string, length: number, suffix: string = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + suffix;
}

// Generate initials from name
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLength);
}

// Format registration number
export function formatRegistrationNo(
  year: number,
  sequence: number,
  prefix: string = "EHS"
): string {
  const yearShort = year.toString().slice(-2);
  const seq = sequence.toString().padStart(4, "0");
  return `${prefix}-${yearShort}-${seq}`;
}

// Parse registration number
export function parseRegistrationNo(regNo: string): { prefix: string; year: number; sequence: number } | null {
  const match = regNo.match(/^([A-Z]+)-(\d{2})-(\d{4})$/);
  if (!match) return null;
  
  return {
    prefix: match[1],
    year: 2000 + parseInt(match[2]),
    sequence: parseInt(match[3]),
  };
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

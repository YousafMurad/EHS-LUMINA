// Form Validation Utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validate a single value against rules
export function validateField(value: unknown, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    // Required check
    if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
      return rule.message;
    }

    // Skip other validations if empty and not required
    if (!value && !rule.required) continue;

    // String validations
    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
}

// Validate an entire form
export function validateForm(
  data: Record<string, unknown>,
  schema: Record<string, ValidationRule[]>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-]{10,}$/,
  CNIC: /^\d{5}-\d{7}-\d$/,
  NUMERIC: /^\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
};

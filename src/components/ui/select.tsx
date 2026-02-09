// Select Component - Dropdown select with options
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label>{label}</label>}
        <select ref={ref} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, type SelectProps, type SelectOption };

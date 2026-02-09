// Date Picker Component
"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          type="date"
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };

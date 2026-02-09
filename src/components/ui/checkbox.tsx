// Checkbox Component
import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" ref={ref} {...props} />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, type CheckboxProps };

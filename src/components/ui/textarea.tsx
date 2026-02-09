// Textarea Component - Multi-line text input
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label>{label}</label>}
        <textarea ref={ref} {...props} />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };

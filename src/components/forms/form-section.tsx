// Form Section Component - Groups related fields
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

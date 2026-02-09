// Page Header Component - Page title and actions
import { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <div className="mb-2">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

// Page Header Component - Consistent header for all dashboard pages
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function PageHeader({ title, description, breadcrumbs, actions, children, showBackButton = true }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-3 mb-2">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <ChevronRight size={14} />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-500 mt-1">{description}</p>}
        </div>
        {(actions || children) && <div className="flex items-center gap-3">{actions || children}</div>}
      </div>
    </div>
  );
}

interface PageHeaderButtonProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function PageHeaderButton({
  href,
  onClick,
  icon,
  children,
  variant = "primary",
}: PageHeaderButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const classes = `${baseClasses} ${variantClasses[variant]}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}

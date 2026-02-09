"use client";

import { useSchoolInfo } from "@/hooks/useSchoolSettings";

interface DocumentHeaderProps {
  title: string;
  subtitle?: string;
  showBorder?: boolean;
  compact?: boolean;
}

/**
 * Reusable document header component with school logo and information
 * Used in fee challans, reports, receipts, etc.
 */
export function DocumentHeader({ title, subtitle, showBorder = true, compact = false }: DocumentHeaderProps) {
  const { schoolInfo, isLoading } = useSchoolInfo();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-4 ${showBorder ? "border-b border-gray-200 pb-4 mb-4" : ""}`}>
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`${showBorder ? "border-b border-gray-200 pb-3 mb-3" : ""}`}>
        <div className="flex items-center gap-3">
          {/* School Logo */}
          {schoolInfo?.logoUrl ? (
            <img
              src={schoolInfo.logoUrl}
              alt={schoolInfo.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
              <span className="text-sm font-bold text-blue-900">
                {schoolInfo?.name?.substring(0, 3).toUpperCase() || "EHS"}
              </span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-gray-900">{schoolInfo?.name || "EHS School"}</h1>
              <h2 className="font-semibold text-gray-700">{title}</h2>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{schoolInfo?.phone}</span>
              {subtitle && <span>{subtitle}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${showBorder ? "border-b-2 border-gray-300 pb-4 mb-4" : ""}`}>
      <div className="flex items-start gap-4">
        {/* School Logo */}
        {schoolInfo?.logoUrl ? (
          <img
            src={schoolInfo.logoUrl}
            alt={schoolInfo.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-blue-900">
              {schoolInfo?.name?.substring(0, 3).toUpperCase() || "EHS"}
            </span>
          </div>
        )}

        {/* School Info */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{schoolInfo?.name || "EHS School"}</h1>
          {schoolInfo?.tagline && (
            <p className="text-sm text-gray-600 italic">{schoolInfo.tagline}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {schoolInfo?.address && <span>{schoolInfo.address}</span>}
          </div>
          <div className="text-xs text-gray-500">
            {schoolInfo?.phone && <span>Ph: {schoolInfo.phone}</span>}
            {schoolInfo?.email && <span className="ml-2">• {schoolInfo.email}</span>}
          </div>
        </div>

        {/* Document Title */}
        <div className="text-right">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

/**
 * Print-optimized document header (for PDF/print)
 */
interface PrintDocumentHeaderProps {
  title: string;
  subtitle?: string;
  schoolName: string;
  tagline?: string;
  logoUrl?: string | null;
  address?: string;
  phone?: string;
  email?: string;
  showBorder?: boolean;
}

export function PrintDocumentHeader({
  title,
  subtitle,
  schoolName,
  tagline,
  logoUrl,
  address,
  phone,
  email,
  showBorder = true,
}: PrintDocumentHeaderProps) {
  return (
    <div className={`${showBorder ? "border-b-2 border-gray-300 pb-4 mb-4" : ""}`}>
      <div className="flex items-start gap-4">
        {/* School Logo */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={schoolName}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-blue-900">
              {schoolName.substring(0, 3).toUpperCase()}
            </span>
          </div>
        )}

        {/* School Info */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{schoolName}</h1>
          {tagline && <p className="text-sm text-gray-600 italic">{tagline}</p>}
          <div className="text-xs text-gray-500 mt-1">
            {address && <span>{address}</span>}
          </div>
          <div className="text-xs text-gray-500">
            {phone && <span>Ph: {phone}</span>}
            {email && <span className="ml-2">• {email}</span>}
          </div>
        </div>

        {/* Document Title */}
        <div className="text-right">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

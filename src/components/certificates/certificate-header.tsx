"use client";

import { useSchoolInfo } from "@/hooks/useSchoolSettings";

interface CertificateHeaderProps {
  showBorder?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable certificate header component with school logo and information
 * Used in all certificates: SLC, Character Certificate, etc.
 */
export function CertificateHeader({ showBorder = true, size = "md" }: CertificateHeaderProps) {
  const { schoolInfo, isLoading } = useSchoolInfo();

  const sizeClasses = {
    sm: {
      logo: "w-12 h-12",
      title: "text-lg",
      tagline: "text-xs",
      info: "text-[10px]",
    },
    md: {
      logo: "w-16 h-16",
      title: "text-xl",
      tagline: "text-sm",
      info: "text-xs",
    },
    lg: {
      logo: "w-20 h-20",
      title: "text-2xl",
      tagline: "text-base",
      info: "text-sm",
    },
  };

  const classes = sizeClasses[size];

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-4 ${showBorder ? "border-b-2 border-gray-300 pb-4 mb-4" : ""}`}>
        <div className={`${classes.logo} bg-gray-200 rounded-lg animate-pulse`} />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${showBorder ? "border-b-2 border-gray-300 pb-4 mb-4" : ""}`}>
      <div className="flex items-center justify-center gap-4">
        {/* School Logo */}
        {schoolInfo?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={schoolInfo.logoUrl}
            alt={schoolInfo.name}
            className={`${classes.logo} rounded-lg object-cover`}
          />
        ) : (
          <div className={`${classes.logo} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center`}>
            <span className="text-lg font-bold text-blue-900">
              {schoolInfo?.name?.substring(0, 3).toUpperCase() || "EHS"}
            </span>
          </div>
        )}

        {/* School Info */}
        <div className="text-center flex-1">
          <h1 className={`${classes.title} font-bold text-gray-900`}>
            {schoolInfo?.name || "EHS School"}
          </h1>
          {schoolInfo?.tagline && (
            <p className={`${classes.tagline} text-gray-600 italic`}>
              {schoolInfo.tagline}
            </p>
          )}
          <div className={`${classes.info} text-gray-500 mt-1 space-x-2`}>
            {schoolInfo?.address && <span>{schoolInfo.address}</span>}
            {schoolInfo?.phone && <span>• {schoolInfo.phone}</span>}
          </div>
          {schoolInfo?.registrationNo && (
            <p className={`${classes.info} text-gray-500`}>
              Reg. No: {schoolInfo.registrationNo}
            </p>
          )}
        </div>

        {/* Duplicate logo for symmetry (optional) */}
        {schoolInfo?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={schoolInfo.logoUrl}
            alt={schoolInfo.name}
            className={`${classes.logo} rounded-lg object-cover opacity-0`}
          />
        ) : (
          <div className={`${classes.logo} opacity-0`} />
        )}
      </div>
    </div>
  );
}

/**
 * Print-optimized certificate header (for PDF/print)
 * This version receives data as props instead of fetching
 */
interface PrintCertificateHeaderProps {
  schoolName: string;
  tagline?: string;
  logoUrl?: string | null;
  address?: string;
  phone?: string;
  registrationNo?: string;
  showBorder?: boolean;
}

export function PrintCertificateHeader({
  schoolName,
  tagline,
  logoUrl,
  address,
  phone,
  registrationNo,
  showBorder = true,
}: PrintCertificateHeaderProps) {
  return (
    <div className={`${showBorder ? "border-b-2 border-gray-300 pb-4 mb-4" : ""}`}>
      <div className="flex items-center justify-center gap-4">
        {/* School Logo */}
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
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
        <div className="text-center flex-1">
          <h1 className="text-xl font-bold text-gray-900">{schoolName}</h1>
          {tagline && (
            <p className="text-sm text-gray-600 italic">{tagline}</p>
          )}
          <div className="text-xs text-gray-500 mt-1 space-x-2">
            {address && <span>{address}</span>}
            {phone && <span>• {phone}</span>}
          </div>
          {registrationNo && (
            <p className="text-xs text-gray-500">Reg. No: {registrationNo}</p>
          )}
        </div>

        {/* Spacer for symmetry */}
        <div className="w-16 h-16 opacity-0" />
      </div>
    </div>
  );
}

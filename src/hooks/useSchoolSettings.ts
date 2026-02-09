"use client";

import { useState, useEffect, useCallback } from "react";
import { getSchoolSettings, SchoolSettings } from "@/server/actions/settings";

interface UseSchoolSettingsResult {
  settings: SchoolSettings | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and cache school settings for client components
 */
export function useSchoolSettings(): UseSchoolSettingsResult {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getSchoolSettings();
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        setError(result.error || "Failed to load settings");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching school settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
  };
}

/**
 * Hook to get just the school logo URL
 */
export function useSchoolLogo(): {
  logoUrl: string | null;
  isLoading: boolean;
} {
  const { settings, isLoading } = useSchoolSettings();
  
  return {
    logoUrl: settings?.logo_url || null,
    isLoading,
  };
}

/**
 * Hook to get school info for documents (certificates, challans, etc.)
 */
export function useSchoolInfo() {
  const { settings, isLoading, error } = useSchoolSettings();

  const schoolInfo = settings
    ? {
        name: settings.school_name,
        tagline: settings.tagline,
        logoUrl: settings.logo_url,
        address: `${settings.address}, ${settings.city}, ${settings.state}`,
        fullAddress: {
          street: settings.address,
          city: settings.city,
          state: settings.state,
          country: settings.country,
          postalCode: settings.postal_code,
        },
        phone: settings.phone,
        alternatePhone: settings.alternate_phone,
        email: settings.email,
        website: settings.website,
        registrationNo: settings.registration_no,
        establishedYear: settings.established_year,
        principalName: settings.principal_name,
        principalEmail: settings.principal_email,
      }
    : null;

  return {
    schoolInfo,
    isLoading,
    error,
  };
}

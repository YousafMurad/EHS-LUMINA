"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Table name - using existing 'settings' table in database
const SETTINGS_TABLE = "settings";

export interface SchoolSettings {
  school_name: string;
  tagline: string;
  email: string;
  phone: string;
  alternate_phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  principal_name: string;
  principal_email: string;
  registration_no: string;
  established_year: string;
  logo_url: string | null;
}

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

const STORAGE_PUBLIC_PATH = "/storage/v1/object/public/";

function parseStoragePublicUrl(url: string): { bucket: string; path: string } | null {
  try {
    const parsed = new URL(url);
    const idx = parsed.pathname.indexOf(STORAGE_PUBLIC_PATH);
    if (idx === -1) return null;
    const pathPart = parsed.pathname.substring(idx + STORAGE_PUBLIC_PATH.length);
    const [bucket, ...rest] = pathPart.split("/");
    const path = rest.join("/");
    if (!bucket || !path) return null;
    return { bucket, path };
  } catch {
    return null;
  }
}

async function resolveLogoUrl(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  logoUrl: string | null
): Promise<string | null> {
  if (!logoUrl) return null;

  const storageRef = parseStoragePublicUrl(logoUrl);
  if (!storageRef) {
    return logoUrl;
  }

  const { data, error } = await supabase.storage
    .from(storageRef.bucket)
    .createSignedUrl(storageRef.path, 60 * 60 * 24);

  if (error) {
    return logoUrl;
  }

  return data?.signedUrl || logoUrl;
}

/**
 * Get all school settings
 */
export async function getSchoolSettings(): Promise<ActionResult<SchoolSettings>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Only select columns that exist - no created_at/updated_at to avoid errors
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      // If any error, return default values
      console.log("Settings fetch error, using defaults:", error.message);
      return {
        success: true,
        data: getDefaultSettings(),
      };
    }

    if (!data) {
      // No settings row exists yet
      return {
        success: true,
        data: getDefaultSettings(),
      };
    }

    // Merge fetched data with defaults for any missing fields
    const defaults = getDefaultSettings();
    const resolvedLogoUrl = await resolveLogoUrl(supabase, data.logo_url || null);
    return { 
      success: true, 
      data: {
        ...defaults,
        school_name: data.school_name || defaults.school_name,
        tagline: data.tagline || defaults.tagline,
        email: data.email || defaults.email,
        phone: data.phone || defaults.phone,
        alternate_phone: data.alternate_phone || defaults.alternate_phone,
        website: data.website || defaults.website,
        address: data.address || defaults.address,
        city: data.city || defaults.city,
        state: data.state || defaults.state,
        country: data.country || defaults.country,
        postal_code: data.postal_code || defaults.postal_code,
        principal_name: data.principal_name || defaults.principal_name,
        principal_email: data.principal_email || defaults.principal_email,
        registration_no: data.registration_no || defaults.registration_no,
        established_year: data.established_year || defaults.established_year,
        logo_url: resolvedLogoUrl,
      }
    };
  } catch (error) {
    console.error("Error in getSchoolSettings:", error);
    return { success: true, data: getDefaultSettings() };
  }
}

// Default settings values
function getDefaultSettings(): SchoolSettings {
  return {
    school_name: "EHS School",
    tagline: "Excellence in Education",
    email: "info@ehsschool.edu.pk",
    phone: "042-35761234",
    alternate_phone: "0300-1234567",
    website: "www.ehsschool.edu.pk",
    address: "123 Main Boulevard, Gulberg III",
    city: "Lahore",
    state: "Punjab",
    country: "Pakistan",
    postal_code: "54000",
    principal_name: "Dr. Ahmed Khan",
    principal_email: "principal@ehsschool.edu.pk",
    registration_no: "REG-2020-12345",
    established_year: "1995",
    logo_url: null,
  };
}

/**
 * Save/update school settings
 * Dynamically handles whatever columns exist in the database
 */
export async function saveSchoolSettings(
  settings: Partial<SchoolSettings>
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Prepare the data object with all possible fields
    const settingsData: Record<string, unknown> = {};
    
    // Map all settings fields
    const fieldMappings: { key: keyof SchoolSettings; dbKey: string }[] = [
      { key: 'school_name', dbKey: 'school_name' },
      { key: 'tagline', dbKey: 'tagline' },
      { key: 'logo_url', dbKey: 'logo_url' },
      { key: 'email', dbKey: 'email' },
      { key: 'phone', dbKey: 'phone' },
      { key: 'alternate_phone', dbKey: 'alternate_phone' },
      { key: 'website', dbKey: 'website' },
      { key: 'address', dbKey: 'address' },
      { key: 'city', dbKey: 'city' },
      { key: 'state', dbKey: 'state' },
      { key: 'country', dbKey: 'country' },
      { key: 'postal_code', dbKey: 'postal_code' },
      { key: 'principal_name', dbKey: 'principal_name' },
      { key: 'principal_email', dbKey: 'principal_email' },
      { key: 'registration_no', dbKey: 'registration_no' },
      { key: 'established_year', dbKey: 'established_year' },
    ];

    for (const { key, dbKey } of fieldMappings) {
      if (key in settings) {
        settingsData[dbKey] = settings[key];
      }
    }

    // Check if settings already exist
    const { data: existing } = await supabase
      .from(SETTINGS_TABLE)
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .update(settingsData)
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating school settings:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new settings with all fields
      const { error } = await supabase.from(SETTINGS_TABLE).insert({
        ...settingsData,
        school_name: settings.school_name || "EHS School",
        tagline: settings.tagline || "Excellence in Education",
      });

      if (error) {
        console.error("Error creating school settings:", error);
        return { success: false, error: error.message };
      }
    }

    // Revalidate all paths that use school settings
    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/certificates");
    revalidatePath("/reports");
    revalidatePath("/fees");

    return { success: true };
  } catch (error) {
    console.error("Error in saveSchoolSettings:", error);
    return { success: false, error: "Failed to save school settings" };
  }
}

/**
 * Update just the logo URL
 */
export async function updateSchoolLogo(logoUrl: string): Promise<ActionResult> {
  return saveSchoolSettings({ logo_url: logoUrl });
}

/**
 * Get only the school logo URL (lightweight query for components)
 */
export async function getSchoolLogo(): Promise<ActionResult<string | null>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select("logo_url")
      .limit(1)
      .maybeSingle();

    if (error) {
      // Return null for any error - logo is optional
      console.log("Logo fetch error (using null):", error.code);
      return { success: true, data: null };
    }

    const resolvedLogoUrl = await resolveLogoUrl(supabase, data?.logo_url || null);
    return { success: true, data: resolvedLogoUrl };
  } catch (error) {
    console.error("Error in getSchoolLogo:", error);
    return { success: true, data: null };
  }
}

/**
 * Get school info for certificates/documents (name, logo, address, etc.)
 */
export async function getSchoolInfoForDocuments(): Promise<
  ActionResult<{
    name: string;
    tagline: string;
    logoUrl: string | null;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    registrationNo: string;
    principalName: string;
  }>
> {
  try {
    const result = await getSchoolSettings();
    
    if (!result.success || !result.data) {
      return { success: false, error: result.error || "No settings found" };
    }

    const settings = result.data;
    
    return {
      success: true,
      data: {
        name: settings.school_name,
        tagline: settings.tagline,
        logoUrl: settings.logo_url,
        address: `${settings.address}, ${settings.city}, ${settings.state}`,
        city: settings.city,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        registrationNo: settings.registration_no,
        principalName: settings.principal_name,
      },
    };
  } catch (error) {
    console.error("Error in getSchoolInfoForDocuments:", error);
    return { success: false, error: "Failed to fetch school info" };
  }
}

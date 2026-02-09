// Dashboard Layout - Main application layout with sidebar and header
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import { getSchoolSettings } from "@/server/actions/settings";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface ProfileData {
  name: string;
  role: string;
  avatar_url?: string;
}

interface SessionData {
  name: string;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile, active session, and school settings in parallel
  const [profileResult, activeSessionResult, schoolSettingsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, role, avatar_url")
      .eq("id", user.id)
      .single<ProfileData>(),
    supabase
      .from("sessions")
      .select("name")
      .eq("is_active", true)
      .single<SessionData>(),
    getSchoolSettings(),
  ]);

  const profile = profileResult.data;
  const activeSession = activeSessionResult.data;
  const schoolSettings = schoolSettingsResult.success ? schoolSettingsResult.data : null;

  return (
    <DashboardLayoutClient
      user={{
        id: user.id,
        name: profile?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: profile?.role || "operator",
        avatarUrl: profile?.avatar_url,
      }}
      currentSession={activeSession?.name || "No Active Session"}
      schoolSettings={{
        name: schoolSettings?.school_name || "EHS School",
        tagline: schoolSettings?.tagline || "Management System",
        logoUrl: schoolSettings?.logo_url || null,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}

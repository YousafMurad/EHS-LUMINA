// Auth Helpers - Authentication utility functions
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Role } from "./roles";

// Type for profile data from Supabase
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
}

// Get current authenticated user
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Get current user with profile (includes role)
export async function getCurrentUserWithProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  // Fetch profile with role
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  const profile = profileData as ProfileData | null;
  
  return { user, profile };
}

// Require authentication - redirects to login if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

// Require specific role
export async function requireRole(allowedRoles: string[]) {
  const result = await getCurrentUserWithProfile();
  
  if (!result) {
    redirect("/login");
  }
  
  const { profile } = result;
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }
  
  return result;
}

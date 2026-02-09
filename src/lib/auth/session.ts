// Session Management - Session utilities
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Get current session
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Session error:", error.message);
    return null;
  }
  
  return session;
}

// Check if session is valid
export async function isSessionValid() {
  const session = await getSession();
  return !!session;
}

// Refresh session
export async function refreshSession() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) {
    console.error("Refresh session error:", error.message);
    return null;
  }
  
  return data.session;
}

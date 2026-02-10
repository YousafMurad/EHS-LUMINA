// Session Queries - Academic session data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getSessions() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getCurrentSession() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
}

export async function getSessionById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getSessionOptions() {
  const sessions = await getSessions();

  return sessions.map((session: any) => ({
    value: session.id,
    label: session.name,
  }));
}

// Alias for getCurrentSession - used in fee structures
export const getActiveSession = getCurrentSession;

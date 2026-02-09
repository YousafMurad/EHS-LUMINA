// Promotions Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface PromotionFilters {
  session_id?: string;
  from_class_id?: string;
  to_class_id?: string;
  page?: number;
  limit?: number;
}

export async function getPromotions(filters: PromotionFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { session_id, from_class_id, to_class_id, page = 1, limit = 20 } = filters;

  let query = supabase
    .from("promotions")
    .select(`
      *,
      students(id, name, registration_no),
      from_class:classes!promotions_from_class_id_fkey(id, name),
      to_class:classes!promotions_to_class_id_fkey(id, name),
      from_session:sessions!promotions_from_session_id_fkey(id, name),
      to_session:sessions!promotions_to_session_id_fkey(id, name)
    `, { count: "exact" })
    .order("created_at", { ascending: false });

  if (session_id) {
    query = query.eq("session_id", session_id);
  }

  if (from_class_id) {
    query = query.eq("from_class_id", from_class_id);
  }

  if (to_class_id) {
    query = query.eq("to_class_id", to_class_id);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    promotions: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getPromotionStats() {
  const supabase = await createServerSupabaseClient();

  // Get current session
  const { data: currentSession } = await supabase
    .from("sessions")
    .select("id")
    .eq("is_active", true)
    .single();

  if (!currentSession) {
    return {
      totalPromoted: 0,
      thisSession: 0,
      pendingStudents: 0,
    };
  }

  // Get promotions count for current session
  const { count: thisSession } = await supabase
    .from("promotions")
    .select("*", { count: "exact", head: true })
    .eq("session_id", currentSession.id);

  // Get total promotions
  const { count: totalPromoted } = await supabase
    .from("promotions")
    .select("*", { count: "exact", head: true });

  // Get active students count (potential for promotion)
  const { count: pendingStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  return {
    totalPromoted: totalPromoted || 0,
    thisSession: thisSession || 0,
    pendingStudents: pendingStudents || 0,
  };
}

export async function getStudentsForPromotion(classId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      id, name, registration_no, photo_url,
      sections(id, name)
    `)
    .eq("class_id", classId)
    .eq("status", "active")
    .order("name");

  if (error) throw error;

  return data || [];
}

export async function getClassProgressionMap() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("classes")
    .select("id, name, grade_level, next_class_id")
    .eq("is_active", true)
    .order("grade_level");

  if (error) throw error;

  return data || [];
}

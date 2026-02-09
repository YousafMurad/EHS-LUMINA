// Student Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface StudentFilters {
  search?: string;
  class_id?: string;
  section_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getStudents(filters: StudentFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { search, class_id, section_id, status = "active", page = 1, limit = 20 } = filters;

  let query = supabase
    .from("students")
    .select(`
      *,
      classes(id, name),
      sections(id, name)
    `, { count: "exact" })
    .eq("status", status)
    .order("name");

  if (search) {
    query = query.or(`name.ilike.%${search}%,registration_no.ilike.%${search}%,father_name.ilike.%${search}%`);
  }

  if (class_id) {
    query = query.eq("class_id", class_id);
  }

  if (section_id) {
    query = query.eq("section_id", section_id);
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    students: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getStudentById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      classes(id, name, grade_level),
      sections(id, name),
      family_members(*),
      promotions(
        *,
        from_class:classes!from_class_id(name),
        to_class:classes!to_class_id(name)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getStudentsByClass(classId: string) {
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

export async function getStudentsBySection(sectionId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("students")
    .select("id, name, registration_no, photo_url")
    .eq("section_id", sectionId)
    .eq("status", "active")
    .order("name");

  if (error) throw error;

  return data || [];
}

export async function getStudentStats() {
  const supabase = await createServerSupabaseClient();

  const { count: total } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: newThisMonth } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  const { data: byClass } = await supabase
    .from("students")
    .select("class_id, classes(name)")
    .eq("status", "active");

  // Count by class
  const classCounts: Record<string, number> = {};
  (byClass || []).forEach((s: any) => {
    const className = s.classes?.name || "Unknown";
    classCounts[className] = (classCounts[className] || 0) + 1;
  });

  return {
    total: total || 0,
    newThisMonth: newThisMonth || 0,
    byClass: classCounts,
  };
}

export async function getOldStudents(filters: StudentFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { search, page = 1, limit = 20 } = filters;

  let query = supabase
    .from("students")
    .select(`
      *,
      classes(id, name),
      sections(id, name)
    `, { count: "exact" })
    .in("status", ["left", "completed"])
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,registration_no.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    students: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

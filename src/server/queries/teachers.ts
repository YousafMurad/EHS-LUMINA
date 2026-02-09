// Teacher Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface TeacherFilters {
  search?: string;
  contract_type?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export async function getTeachers(filters: TeacherFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { search, contract_type, is_active = true, page = 1, limit = 20 } = filters;

  let query = supabase
    .from("teachers")
    .select(`
      *,
      sections(id, name, classes(name))
    `, { count: "exact" })
    .eq("is_active", is_active)
    .order("name");

  if (search) {
    query = query.or(`name.ilike.%${search}%,employee_code.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  if (contract_type) {
    query = query.eq("contract_type", contract_type);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    teachers: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getTeacherById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("teachers")
    .select(`
      *,
      sections(id, name, classes(id, name)),
      salary_history(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getTeacherOptions() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("teachers")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return (data || []).map((teacher) => ({
    value: teacher.id,
    label: teacher.name,
  }));
}

export async function getTeacherStats() {
  const supabase = await createServerSupabaseClient();

  const { count: total } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { data: byType } = await supabase
    .from("teachers")
    .select("contract_type")
    .eq("is_active", true);

  const typeCounts: Record<string, number> = {};
  (byType || []).forEach((t) => {
    typeCounts[t.contract_type] = (typeCounts[t.contract_type] || 0) + 1;
  });

  return {
    total: total || 0,
    byContractType: typeCounts,
  };
}

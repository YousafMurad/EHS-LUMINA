// Operator/User Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface OperatorFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export async function getOperators(filters: OperatorFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { search, role, is_active = true, page = 1, limit = 20 } = filters;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("is_active", is_active)
    .order("name");

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq("role", role);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    operators: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getOperatorById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      user_permissions(permission)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getOperatorPermissions(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("user_permissions")
    .select("permission")
    .eq("user_id", userId);

  if (error) throw error;

  return (data || []).map((p) => p.permission);
}

export async function getRolePermissions(role: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("role", role);

  if (error) throw error;

  return (data || []).map((p) => p.permission);
}

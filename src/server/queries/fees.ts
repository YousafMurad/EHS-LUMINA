// Fee Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface FeeFilters {
  student_id?: string;
  class_id?: string;
  status?: "pending" | "paid" | "partial" | "overdue";
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
}

export async function getStudentFees(studentId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("student_fees")
    .select(`
      *,
      payments(*)
    `)
    .eq("student_id", studentId)
    .order("fee_year", { ascending: false })
    .order("fee_month", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getFeesDue(filters: FeeFilters = {}) {
  const supabase = await createServerSupabaseClient();
  const { class_id, status = "pending", page = 1, limit = 20 } = filters;

  let query = supabase
    .from("student_fees")
    .select(`
      *,
      students(id, name, registration_no, class_id, section_id,
        classes(name),
        sections(name)
      )
    `, { count: "exact" })
    .eq("status", status)
    .order("due_date");

  if (class_id) {
    query = query.eq("students.class_id", class_id);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    fees: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getFeeStructures(sessionId?: string) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("fee_structures")
    .select(`
      *,
      classes(id, name, grade_level),
      sessions(id, name)
    `)
    .order("classes(grade_level)");

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getFeeStructureById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("fee_structures")
    .select(`
      *,
      classes(id, name, grade_level),
      sessions(id, name, start_date, end_date)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getFeeStats() {
  const supabase = await createServerSupabaseClient();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Total collected this month
  const { data: collected } = await supabase
    .from("payments")
    .select("amount")
    .gte("payment_date", `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`);

  const totalCollected = (collected || []).reduce((sum, p) => sum + p.amount, 0);

  // Total pending
  const { data: pending } = await supabase
    .from("student_fees")
    .select("amount")
    .eq("status", "pending");

  const totalPending = (pending || []).reduce((sum, f) => sum + f.amount, 0);

  // Total overdue
  const { data: overdue } = await supabase
    .from("student_fees")
    .select("amount")
    .eq("status", "pending")
    .lt("due_date", new Date().toISOString());

  const totalOverdue = (overdue || []).reduce((sum, f) => sum + f.amount, 0);

  // Count students with pending fees
  const { count: totalStudents } = await supabase
    .from("student_fees")
    .select("student_id", { count: "exact", head: true })
    .eq("status", "pending");

  return {
    totalCollected,
    totalPending,
    totalOverdue,
    totalStudents: totalStudents || 0,
    collectionRate: totalPending > 0 
      ? Math.round((totalCollected / (totalCollected + totalPending)) * 100) 
      : 100,
  };
}

export async function getPaymentHistory(filters: {
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
} = {}) {
  const supabase = await createServerSupabaseClient();
  const { from_date, to_date, page = 1, limit = 20 } = filters;

  let query = supabase
    .from("payments")
    .select(`
      *,
      students(id, name, registration_no)
    `, { count: "exact" })
    .order("payment_date", { ascending: false });

  if (from_date) {
    query = query.gte("payment_date", from_date);
  }

  if (to_date) {
    query = query.lte("payment_date", to_date);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    payments: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

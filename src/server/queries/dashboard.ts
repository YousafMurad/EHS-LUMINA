// Dashboard Queries - Dashboard statistics data
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  // Total students
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Total teachers
  const { count: totalTeachers } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Total classes
  const { count: totalClasses } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Total sections
  const { count: totalSections } = await supabase
    .from("sections")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Fee stats for current month
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  interface AmountRow { amount: number }

  const { data: feeCollectedData } = await supabase
    .from("payments")
    .select("amount")
    .gte("payment_date", monthStart.toISOString());

  const feeCollected = (feeCollectedData || []) as AmountRow[];
  const totalFeeCollected = feeCollected.reduce((sum, p) => sum + p.amount, 0);

  const { data: feePendingData } = await supabase
    .from("student_fees")
    .select("amount")
    .eq("status", "pending");

  const feePending = (feePendingData || []) as AmountRow[];
  const totalFeePending = feePending.reduce((sum, f) => sum + f.amount, 0);

  return {
    totalStudents: totalStudents || 0,
    totalTeachers: totalTeachers || 0,
    totalClasses: totalClasses || 0,
    totalSections: totalSections || 0,
    feeCollectedThisMonth: totalFeeCollected,
    totalFeePending: totalFeePending,
  };
}

export async function getRecentActivity(limit: number = 10) {
  const supabase = await createServerSupabaseClient();

  // Get recent payments
  const { data: recentPayments } = await supabase
    .from("payments")
    .select(`
      id, amount, payment_date,
      students(name)
    `)
    .order("payment_date", { ascending: false })
    .limit(limit);

  // Get recent student admissions
  const { data: recentAdmissions } = await supabase
    .from("students")
    .select("id, name, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  // Combine and format activities
  const activities = [
    ...(recentPayments || []).map((p: any) => ({
      id: `payment-${p.id}`,
      description: `Fee payment of Rs. ${p.amount} received from ${p.students?.name}`,
      timestamp: p.payment_date,
      type: "success" as const,
    })),
    ...(recentAdmissions || []).map((s: any) => ({
      id: `admission-${s.id}`,
      description: `New student ${s.name} admitted`,
      timestamp: s.created_at,
      type: "info" as const,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return activities;
}

export async function getStudentsByClassChart() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("students")
    .select(`
      class_id,
      classes(name, grade_level)
    `)
    .eq("status", "active");

  const classCounts: Record<string, { name: string; count: number; grade: number }> = {};
  
  (data || []).forEach((student: any) => {
    const classId = student.class_id;
    if (!classCounts[classId]) {
      classCounts[classId] = {
        name: student.classes?.name || "Unknown",
        count: 0,
        grade: student.classes?.grade_level || 0,
      };
    }
    classCounts[classId].count++;
  });

  return Object.values(classCounts).sort((a, b) => a.grade - b.grade);
}

export async function getFeeCollectionTrend(months: number = 6) {
  const supabase = await createServerSupabaseClient();

  interface AmountRow { amount: number }

  const results = [];
  const currentDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);

    const { data } = await supabase
      .from("payments")
      .select("amount")
      .gte("payment_date", monthDate.toISOString())
      .lt("payment_date", nextMonth.toISOString());

    const payments = (data || []) as AmountRow[];
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    results.push({
      month: monthDate.toLocaleString("default", { month: "short" }),
      year: monthDate.getFullYear(),
      amount: total,
    });
  }

  return results;
}

// Fee Actions - Server actions for fee management
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
export interface CreateFeeStructureData {
  name: string;
  class_id: string;
  session_id: string;
  monthly_fee: number;
  admission_fee: number;
  security_fee: number;
  registration_fee: number;
  miscellaneous_fee?: number;
  board_registration_fee?: number;
  board_admission_fee?: number;
}
export async function createFeeStructure(data: CreateFeeStructureData) {
  await requireAuth();
  
  const canCreate = await hasPermission(PERMISSIONS.FEES_STRUCTURE);
  if (!canCreate) {
    return { error: "You don't have permission to create fee structures" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: feeStructure, error } = await supabase
    .from("fee_structures")
    .insert(data as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/fees/structures");
  return { success: true, data: feeStructure };
}
export interface CollectFeeData {
  student_id: string;
  amount: number;
  payment_method: "cash" | "bank" | "online";
  fee_month: string;
  fee_year: number;
  remarks?: string;
  receipt_no?: string;
}
export async function collectFee(data: CollectFeeData) {
  await requireAuth();
  
  const canCollect = await hasPermission(PERMISSIONS.FEES_COLLECT);
  if (!canCollect) {
    return { error: "You don't have permission to collect fees" };
  }
  const supabase = await createServerSupabaseClient();
  // Generate receipt number
  const date = new Date();
  const { count } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-01`);
  const receipt_no = `RCP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}-${((count || 0) + 1).toString().padStart(5, "0")}`;
  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      ...data,
      receipt_no,
      payment_date: new Date().toISOString(),
    } as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  // Update student_fees status
  await supabase
    .from("student_fees")
    .update({ status: "paid", paid_amount: data.amount, paid_at: new Date().toISOString() } as any)
    .eq("student_id", data.student_id)
    .eq("fee_month", data.fee_month)
    .eq("fee_year", data.fee_year);
  revalidatePath("/fees");
  revalidatePath(`/students/${data.student_id}/fees`);
  return { success: true, data: payment };
}
export async function applyDiscount(
  studentId: string,
  discountType: string,
  discountValue: number,
  isPercentage: boolean = false
) {
  await requireAuth();
  
  const canDiscount = await hasPermission(PERMISSIONS.FEES_DISCOUNT);
  if (!canDiscount) {
    return { error: "You don't have permission to apply discounts" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: discount, error } = await supabase
    .from("student_discounts")
    .insert({
      student_id: studentId,
      discount_type: discountType,
      discount_value: discountValue,
      is_percentage: isPercentage,
      is_active: true,
    } as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/students/${studentId}/fees`);
  return { success: true, data: discount };
}
export async function generateMonthlyFees(sessionId: string, month: number, year: number) {
  await requireAuth();
  
  const canManage = await hasPermission(PERMISSIONS.FEES_STRUCTURE);
  if (!canManage) {
    return { error: "You don't have permission to generate fees" };
  }
  const supabase = await createServerSupabaseClient();
  // Get all active students with their fee structures
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select(`
      id,
      class_id,
      fee_structures!inner(monthly_fee)
    `)
    .eq("status", "active")
    .eq("fee_structures.session_id", sessionId);
  if (studentsError) {
    return { error: studentsError.message };
  }
  // Generate fee records
  const feeRecords = (students || []).map((student: any) => ({
    student_id: student.id,
    fee_month: month,
    fee_year: year,
    amount: student.fee_structures[0]?.monthly_fee || 0,
    status: "pending",
    due_date: new Date(year, month, 10).toISOString(),
  }));
  const { error } = await supabase.from("student_fees").insert(feeRecords as any);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/fees");
  return { success: true, count: feeRecords.length };
}

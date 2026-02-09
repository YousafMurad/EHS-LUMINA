// Promotion Actions - Server actions for student promotions
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
export interface PromoteStudentData {
  student_id: string;
  from_class_id: string;
  from_section_id: string;
  to_class_id: string;
  to_section_id: string;
  session_id: string;
  remarks?: string;
}
export async function promoteStudent(data: PromoteStudentData) {
  await requireAuth();
  
  const canPromote = await hasPermission(PERMISSIONS.PROMOTIONS_SINGLE);
  if (!canPromote) {
    return { error: "You don't have permission to promote students" };
  }
  const supabase = await createServerSupabaseClient();
  // Start transaction-like operation
  // 1. Create promotion record
  const { error: promotionError } = await supabase.from("promotions").insert({
    student_id: data.student_id,
    from_class_id: data.from_class_id,
    from_section_id: data.from_section_id,
    to_class_id: data.to_class_id,
    to_section_id: data.to_section_id,
    session_id: data.session_id,
    remarks: data.remarks,
    promoted_at: new Date().toISOString(),
  } as any);
  if (promotionError) {
    return { error: promotionError.message };
  }
  // 2. Update student record
  const { error: updateError } = await supabase
    .from("students")
    .update({
      class_id: data.to_class_id,
      section_id: data.to_section_id,
    } as any)
    .eq("id", data.student_id);
  if (updateError) {
    return { error: updateError.message };
  }
  revalidatePath("/students");
  revalidatePath(`/students/${data.student_id}`);
  revalidatePath("/promotions");
  return { success: true };
}
export async function bulkPromote(
  fromClassId: string,
  toClassId: string,
  sessionId: string,
  studentIds?: string[]
) {
  await requireAuth();
  
  const canBulkPromote = await hasPermission(PERMISSIONS.PROMOTIONS_BULK);
  if (!canBulkPromote) {
    return { error: "You don't have permission to perform bulk promotions" };
  }
  const supabase = await createServerSupabaseClient();
  // Get students to promote
  let query = supabase
    .from("students")
    .select("id, class_id, section_id")
    .eq("class_id", fromClassId)
    .eq("status", "active");
  if (studentIds && studentIds.length > 0) {
    query = query.in("id", studentIds);
  }
  const { data: studentsData, error: fetchError } = await query;
  if (fetchError) {
    return { error: fetchError.message };
  }
  const students = (studentsData || []) as { id: string; class_id: string; section_id: string }[];
  if (students.length === 0) {
    return { error: "No students found to promote" };
  }
  // Get sections of target class
  const { data: sections } = await supabase
    .from("sections")
    .select("id")
    .eq("class_id", toClassId)
    .eq("is_active", true)
    .limit(1);
  const defaultSectionId = (sections as { id: string }[] | null)?.[0]?.id;
  if (!defaultSectionId) {
    return { error: "Target class has no active sections" };
  }
  // Create promotion records
  const promotionRecords = students.map((student) => ({
    student_id: student.id,
    from_class_id: student.class_id,
    from_section_id: student.section_id,
    to_class_id: toClassId,
    to_section_id: defaultSectionId,
    session_id: sessionId,
    promoted_at: new Date().toISOString(),
  }));
  const { error: promotionError } = await supabase
    .from("promotions")
    .insert(promotionRecords as any);
  if (promotionError) {
    return { error: promotionError.message };
  }
  // Update all students
  const { error: updateError } = await supabase
    .from("students")
    .update({
      class_id: toClassId,
      section_id: defaultSectionId,
    } as any)
    .in("id", students.map((s) => s.id));
  if (updateError) {
    return { error: updateError.message };
  }
  revalidatePath("/students");
  revalidatePath("/promotions");
  return { success: true, count: students.length };
}
export async function demoteStudent(data: PromoteStudentData) {
  await requireAuth();
  
  const canPromote = await hasPermission(PERMISSIONS.PROMOTIONS_SINGLE);
  if (!canPromote) {
    return { error: "You don't have permission to demote students" };
  }
  const supabase = await createServerSupabaseClient();
  // Create demotion record (same as promotion but marked as demotion)
  const { error: promotionError } = await supabase.from("promotions").insert({
    student_id: data.student_id,
    from_class_id: data.from_class_id,
    from_section_id: data.from_section_id,
    to_class_id: data.to_class_id,
    to_section_id: data.to_section_id,
    session_id: data.session_id,
    remarks: data.remarks,
    is_demotion: true,
    promoted_at: new Date().toISOString(),
  } as any);
  if (promotionError) {
    return { error: promotionError.message };
  }
  // Update student record
  const { error: updateError } = await supabase
    .from("students")
    .update({
      class_id: data.to_class_id,
      section_id: data.to_section_id,
    } as any)
    .eq("id", data.student_id);
  if (updateError) {
    return { error: updateError.message };
  }
  revalidatePath("/students");
  revalidatePath(`/students/${data.student_id}`);
  revalidatePath("/promotions");
  return { success: true };
}

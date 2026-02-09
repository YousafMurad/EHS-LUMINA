// Teacher Class Assignments Actions
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

export interface AssignmentData {
  teacher_id: string;
  class_id: string;
  section_id?: string;
  subject_id?: string;
  is_class_teacher?: boolean;
  can_mark_attendance?: boolean;
}

// Get all teachers with their assignments
export async function getTeachersWithAssignments() {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data: teachers, error } = await supabase
    .from("teachers")
    .select(`
      id,
      name,
      employee_code,
      email,
      phone,
      is_active,
      teacher_class_assignments (
        id,
        class_id,
        section_id,
        subject_id,
        is_class_teacher,
        can_mark_attendance,
        is_active,
        classes:class_id (id, name),
        sections:section_id (id, name),
        subjects:subject_id (id, name, code)
      )
    `)
    .eq("is_active", true)
    .order("name");

  if (error) {
    return { error: error.message };
  }

  return { success: true, data: teachers };
}

// Get assignments for a specific teacher
export async function getTeacherAssignments(teacherId: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("teacher_class_assignments")
    .select(`
      id,
      class_id,
      section_id,
      subject_id,
      is_class_teacher,
      can_mark_attendance,
      is_active,
      assigned_at,
      classes:class_id (id, name, grade_level),
      sections:section_id (id, name),
      subjects:subject_id (id, name, code)
    `)
    .eq("teacher_id", teacherId)
    .eq("is_active", true)
    .order("assigned_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Assign teacher to class/section
export async function assignTeacherToClass(data: AssignmentData) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Check for existing assignment
  const { data: existing } = await supabase
    .from("teacher_class_assignments")
    .select("id")
    .eq("teacher_id", data.teacher_id)
    .eq("class_id", data.class_id)
    .eq("section_id", data.section_id || null)
    .eq("subject_id", data.subject_id || null)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("teacher_class_assignments")
      .update({
        is_class_teacher: data.is_class_teacher || false,
        can_mark_attendance: data.can_mark_attendance ?? true,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from("teacher_class_assignments")
      .insert({
        teacher_id: data.teacher_id,
        class_id: data.class_id,
        section_id: data.section_id || null,
        subject_id: data.subject_id || null,
        is_class_teacher: data.is_class_teacher || false,
        can_mark_attendance: data.can_mark_attendance ?? true,
        is_active: true,
      } as never);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/teachers");
  revalidatePath("/teachers/assignments");
  return { success: true };
}

// Remove teacher assignment
export async function removeTeacherAssignment(assignmentId: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("teacher_class_assignments")
    .update({ is_active: false })
    .eq("id", assignmentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teachers");
  revalidatePath("/teachers/assignments");
  return { success: true };
}

// Delete assignment permanently
export async function deleteTeacherAssignment(assignmentId: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("teacher_class_assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teachers");
  revalidatePath("/teachers/assignments");
  return { success: true };
}

// Get all subjects
export async function getSubjects() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Create subject
export async function createSubject(name: string, code: string, description?: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name,
      code: code.toUpperCase(),
      description,
    } as never)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings/subjects");
  return { success: true, data };
}

// Get teachers who can mark attendance for a specific class/section
export async function getTeachersForAttendance(classId: string, sectionId?: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("teacher_class_assignments")
    .select(`
      id,
      teacher_id,
      is_class_teacher,
      teachers:teacher_id (id, name, employee_code)
    `)
    .eq("class_id", classId)
    .eq("can_mark_attendance", true)
    .eq("is_active", true);

  if (sectionId) {
    query = query.or(`section_id.eq.${sectionId},section_id.is.null`);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Bulk assign teacher to multiple classes
export async function bulkAssignTeacher(
  teacherId: string,
  assignments: { class_id: string; section_id?: string; subject_id?: string }[]
) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const insertData = assignments.map((a) => ({
    teacher_id: teacherId,
    class_id: a.class_id,
    section_id: a.section_id || null,
    subject_id: a.subject_id || null,
    can_mark_attendance: true,
    is_active: true,
  }));

  const { error } = await supabase
    .from("teacher_class_assignments")
    .upsert(insertData as never[], {
      onConflict: "teacher_id,class_id,section_id,subject_id",
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teachers");
  revalidatePath("/teachers/assignments");
  return { success: true };
}

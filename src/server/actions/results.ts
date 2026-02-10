// Results Actions - Server actions for exam results management
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

export interface ResultData {
  student_id: string;
  session_id: string;
  exam_type_id: string;
  subject_id: string;
  class_id: string;
  section_id: string;
  total_marks: number;
  obtained_marks: number;
  grade?: string;
  remarks?: string;
  is_absent?: boolean;
}

export interface BulkResultData {
  session_id: string;
  exam_type_id: string;
  subject_id: string;
  class_id: string;
  section_id: string;
  total_marks: number;
  results: {
    student_id: string;
    obtained_marks: number;
    is_absent?: boolean;
    remarks?: string;
  }[];
}

// Calculate grade based on percentage
function calculateGrade(obtained: number, total: number): string {
  const percentage = (obtained / total) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

// Check if deadline is open for result submission
export async function checkResultDeadline(
  sessionId: string,
  examTypeId: string,
  classId: string,
  subjectId?: string
) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  // Check for specific deadline first
  let { data: deadline } = await supabase
    .from("result_deadlines")
    .select("*")
    .eq("session_id", sessionId)
    .eq("exam_type_id", examTypeId)
    .eq("class_id", classId)
    .eq("is_open", true)
    .lte("start_date", now)
    .gte("end_date", now)
    .single();

  // If no specific class deadline, check for general exam deadline
  if (!deadline) {
    const { data: generalDeadline } = await supabase
      .from("result_deadlines")
      .select("*")
      .eq("session_id", sessionId)
      .eq("exam_type_id", examTypeId)
      .is("class_id", null)
      .eq("is_open", true)
      .lte("start_date", now)
      .gte("end_date", now)
      .single();
    
    deadline = generalDeadline;
  }

  return {
    success: true,
    data: {
      isOpen: !!deadline,
      deadline,
    },
  };
}

// Submit single result
export async function submitResult(data: ResultData) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Check deadline
  const deadlineCheck = await checkResultDeadline(
    data.session_id,
    data.exam_type_id,
    data.class_id,
    data.subject_id
  );

  if (!deadlineCheck.data?.isOpen) {
    return { error: "Result submission deadline has passed or is not open yet" };
  }

  // Calculate grade
  const grade = data.grade || calculateGrade(data.obtained_marks, data.total_marks);

  // Check for existing result
  const { data: existing } = await supabase
    .from("student_results")
    .select("id, is_locked")
    .eq("student_id", data.student_id)
    .eq("session_id", data.session_id)
    .eq("exam_type_id", data.exam_type_id)
    .eq("subject_id", data.subject_id)
    .single();

  if (existing?.is_locked) {
    return { error: "This result has been locked and cannot be modified" };
  }

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("student_results")
      .update({
        total_marks: data.total_marks,
        obtained_marks: data.obtained_marks,
        grade,
        remarks: data.remarks,
        is_absent: data.is_absent || false,
        submitted_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from("student_results")
      .insert({
        ...data,
        grade,
        is_absent: data.is_absent || false,
        submitted_by: user?.id,
      } as never);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/results");
  revalidatePath("/teachers/results");
  return { success: true };
}

// Submit results in bulk
export async function submitBulkResults(data: BulkResultData) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Check deadline
  const deadlineCheck = await checkResultDeadline(
    data.session_id,
    data.exam_type_id,
    data.class_id,
    data.subject_id
  );

  if (!deadlineCheck.data?.isOpen) {
    return { error: "Result submission deadline has passed or is not open yet" };
  }

  // Prepare records
  const records = data.results.map((r) => ({
    student_id: r.student_id,
    session_id: data.session_id,
    exam_type_id: data.exam_type_id,
    subject_id: data.subject_id,
    class_id: data.class_id,
    section_id: data.section_id,
    total_marks: data.total_marks,
    obtained_marks: r.obtained_marks,
    grade: r.is_absent ? "AB" : calculateGrade(r.obtained_marks, data.total_marks),
    remarks: r.remarks,
    is_absent: r.is_absent || false,
    submitted_by: user?.id,
  }));

  // Upsert results
  const { error } = await supabase
    .from("student_results")
    .upsert(records as never[], {
      onConflict: "student_id,session_id,exam_type_id,subject_id",
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/results");
  revalidatePath("/teachers/results");
  return { success: true };
}

// Get results for a class/section/exam
export async function getResults(
  sessionId: string,
  examTypeId?: string,
  classId?: string,
  sectionId?: string,
  subjectId?: string
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("student_results")
    .select(`
      id,
      total_marks,
      obtained_marks,
      grade,
      remarks,
      is_absent,
      is_locked,
      created_at,
      updated_at,
      students:student_id (id, name, registration_no, photo_url),
      exam_types:exam_type_id (id, name, code),
      subjects:subject_id (id, name, code),
      classes:class_id (id, name),
      sections:section_id (id, name)
    `)
    .eq("session_id", sessionId);

  if (examTypeId) query = query.eq("exam_type_id", examTypeId);
  if (classId) query = query.eq("class_id", classId);
  if (sectionId) query = query.eq("section_id", sectionId);
  if (subjectId) query = query.eq("subject_id", subjectId);

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Get student's all results
export async function getStudentResults(studentId: string, sessionId?: string) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("student_results")
    .select(`
      id,
      total_marks,
      obtained_marks,
      grade,
      remarks,
      is_absent,
      created_at,
      sessions:session_id (id, name),
      exam_types:exam_type_id (id, name, code, weightage),
      subjects:subject_id (id, name, code),
      classes:class_id (id, name)
    `)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Lock results (prevent further modifications)
export async function lockResults(
  sessionId: string,
  examTypeId: string,
  classId?: string,
  subjectId?: string
) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("student_results")
    .update({ is_locked: true, updated_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .eq("exam_type_id", examTypeId);

  if (classId) query = query.eq("class_id", classId);
  if (subjectId) query = query.eq("subject_id", subjectId);

  const { error } = await query;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/results");
  return { success: true };
}

// Unlock results (admin only)
export async function unlockResults(
  sessionId: string,
  examTypeId: string,
  classId?: string,
  subjectId?: string
) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("student_results")
    .update({ is_locked: false, updated_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .eq("exam_type_id", examTypeId);

  if (classId) query = query.eq("class_id", classId);
  if (subjectId) query = query.eq("subject_id", subjectId);

  const { error } = await query;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/results");
  return { success: true };
}

// Create result submission deadline
export async function createResultDeadline(data: {
  session_id: string;
  exam_type_id: string;
  class_id?: string;
  subject_id?: string;
  start_date: string;
  end_date: string;
}) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("result_deadlines")
    .upsert({
      session_id: data.session_id,
      exam_type_id: data.exam_type_id,
      class_id: data.class_id || null,
      subject_id: data.subject_id || null,
      start_date: data.start_date,
      end_date: data.end_date,
      is_open: true,
      created_by: user?.id,
    } as never, {
      onConflict: "session_id,exam_type_id,class_id,subject_id",
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/results/deadlines");
  return { success: true };
}

// Get all deadlines
export async function getResultDeadlines(sessionId?: string) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("result_deadlines")
    .select(`
      id,
      start_date,
      end_date,
      is_open,
      created_at,
      sessions:session_id (id, name),
      exam_types:exam_type_id (id, name, code),
      classes:class_id (id, name),
      subjects:subject_id (id, name, code)
    `)
    .order("end_date", { ascending: false });

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Toggle deadline open/close
export async function toggleDeadline(deadlineId: string, isOpen: boolean) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("result_deadlines")
    .update({ is_open: isOpen, updated_at: new Date().toISOString() })
    .eq("id", deadlineId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/results/deadlines");
  return { success: true };
}

// Get exam types
export async function getExamTypes() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("exam_types")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Create exam type
export async function createExamType(name: string, code: string, weightage: number, description?: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("exam_types")
    .insert({
      name,
      code: code.toUpperCase(),
      weightage,
      description,
    } as never)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Get result report card for a student
export async function getStudentReportCard(studentId: string, sessionId: string) {
  const supabase = await createServerSupabaseClient();

  // Get student info
  const { data: student } = await supabase
    .from("students")
    .select(`
      id,
      name,
      registration_no,
      father_name,
      photo_url,
      date_of_birth,
      classes:class_id (id, name),
      sections:section_id (id, name)
    `)
    .eq("id", studentId)
    .single();

  // Get all results for the session
  const { data: results } = await supabase
    .from("student_results")
    .select(`
      id,
      total_marks,
      obtained_marks,
      grade,
      remarks,
      is_absent,
      exam_types:exam_type_id (id, name, code, weightage),
      subjects:subject_id (id, name, code)
    `)
    .eq("student_id", studentId)
    .eq("session_id", sessionId);

  // Get session info
  const { data: session } = await supabase
    .from("sessions")
    .select("id, name, start_date, end_date")
    .eq("id", sessionId)
    .single();

  // Calculate totals and percentages
  const totalObtained = results?.reduce((sum, r) => sum + (r.is_absent ? 0 : r.obtained_marks), 0) || 0;
  const totalMarks = results?.reduce((sum, r) => sum + r.total_marks, 0) || 0;
  const percentage = totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0;
  const overallGrade = calculateGrade(totalObtained, totalMarks);

  return {
    success: true,
    data: {
      student,
      session,
      results,
      summary: {
        totalObtained,
        totalMarks,
        percentage,
        overallGrade,
        totalSubjects: results?.length || 0,
      },
    },
  };
}

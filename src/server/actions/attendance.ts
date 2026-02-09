// Attendance Actions - Server actions for attendance management
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type AttendanceType = "full_day" | "half_day" | "absent";

export interface MarkAttendanceData {
  student_id: string;
  section_id: string;
  date: string;
  status: AttendanceStatus;
  attendance_type?: AttendanceType;
  remarks?: string;
}

export interface BulkAttendanceData {
  section_id: string;
  date: string;
  attendance: {
    student_id: string;
    status: AttendanceStatus;
    attendance_type?: AttendanceType;
    remarks?: string;
  }[];
}

// Get attendance for a section on a specific date
export async function getSectionAttendance(sectionId: string, date: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      id,
      student_id,
      status,
      attendance_type,
      left_early,
      left_at,
      remarks,
      marked_by,
      created_at,
      students:student_id (id, name, registration_no, photo_url)
    `)
    .eq("section_id", sectionId)
    .eq("date", date);

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Mark attendance for a single student
export async function markStudentAttendance(data: MarkAttendanceData) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Check if attendance already exists
  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("student_id", data.student_id)
    .eq("section_id", data.section_id)
    .eq("date", data.date)
    .single();

  if (existing) {
    // Update existing attendance
    const { error } = await supabase
      .from("attendance")
      .update({
        status: data.status,
        attendance_type: data.attendance_type || (data.status === "absent" ? "absent" : "full_day"),
        remarks: data.remarks,
        marked_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new attendance
    const { error } = await supabase
      .from("attendance")
      .insert({
        student_id: data.student_id,
        section_id: data.section_id,
        date: data.date,
        status: data.status,
        attendance_type: data.attendance_type || (data.status === "absent" ? "absent" : "full_day"),
        remarks: data.remarks,
        marked_by: user?.id,
      } as never);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Mark attendance in bulk for a section
export async function markBulkAttendance(data: BulkAttendanceData) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Delete existing attendance for the date/section
  await supabase
    .from("attendance")
    .delete()
    .eq("section_id", data.section_id)
    .eq("date", data.date);

  // Insert new attendance records
  const records = data.attendance.map((a) => ({
    student_id: a.student_id,
    section_id: data.section_id,
    date: data.date,
    status: a.status,
    attendance_type: a.attendance_type || (a.status === "absent" ? "absent" : "full_day"),
    remarks: a.remarks,
    marked_by: user?.id,
  }));

  const { error } = await supabase
    .from("attendance")
    .insert(records as never[]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Update attendance to half day (when student leaves early)
export async function markHalfDay(attendanceId: string, leftAt?: string) {
  const { user } = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("attendance")
    .update({
      attendance_type: "half_day",
      left_early: true,
      left_at: leftAt || null,
      marked_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attendanceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Get attendance summary for a student
export async function getStudentAttendanceSummary(studentId: string, startDate?: string, endDate?: string) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  // Calculate summary
  const total = data?.length || 0;
  const present = data?.filter((a) => a.status === "present").length || 0;
  const absent = data?.filter((a) => a.status === "absent").length || 0;
  const late = data?.filter((a) => a.status === "late").length || 0;
  const halfDay = data?.filter((a) => a.attendance_type === "half_day").length || 0;
  const fullDay = data?.filter((a) => a.attendance_type === "full_day").length || 0;

  const percentage = total > 0 ? Math.round(((present + late + halfDay * 0.5) / total) * 100) : 0;

  return {
    success: true,
    data: {
      records: data,
      summary: {
        total,
        present,
        absent,
        late,
        halfDay,
        fullDay,
        percentage,
      },
    },
  };
}

// Get attendance report for a class/section
export async function getAttendanceReport(
  classId: string,
  sectionId?: string,
  month?: number,
  year?: number
) {
  const supabase = await createServerSupabaseClient();

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  // Get first and last day of the month
  const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(targetYear, targetMonth, 0).toISOString().split("T")[0];

  // Get students in the class/section
  let studentsQuery = supabase
    .from("students")
    .select("id, name, registration_no, section_id")
    .eq("status", "active");

  if (sectionId) {
    studentsQuery = studentsQuery.eq("section_id", sectionId);
  } else {
    // Get all sections for the class
    const { data: sections } = await supabase
      .from("sections")
      .select("id")
      .eq("class_id", classId)
      .eq("is_active", true);

    if (sections && sections.length > 0) {
      studentsQuery = studentsQuery.in(
        "section_id",
        sections.map((s) => s.id)
      );
    }
  }

  const { data: students, error: studentsError } = await studentsQuery;

  if (studentsError) {
    return { error: studentsError.message };
  }

  // Get attendance records
  const studentIds = students?.map((s) => s.id) || [];
  
  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .in("student_id", studentIds)
    .gte("date", startDate)
    .lte("date", endDate);

  if (attendanceError) {
    return { error: attendanceError.message };
  }

  // Build report per student
  const report = students?.map((student) => {
    const studentAttendance = attendance?.filter((a) => a.student_id === student.id) || [];
    const present = studentAttendance.filter((a) => a.status === "present").length;
    const absent = studentAttendance.filter((a) => a.status === "absent").length;
    const late = studentAttendance.filter((a) => a.status === "late").length;
    const halfDay = studentAttendance.filter((a) => a.attendance_type === "half_day").length;
    const total = studentAttendance.length;

    return {
      student,
      attendance: {
        present,
        absent,
        late,
        halfDay,
        total,
        percentage: total > 0 ? Math.round(((present + late + halfDay * 0.5) / total) * 100) : 0,
      },
    };
  });

  return {
    success: true,
    data: {
      month: targetMonth,
      year: targetYear,
      startDate,
      endDate,
      report,
    },
  };
}

// Get classes/sections teacher can mark attendance for
export async function getTeacherAttendanceClasses(userId: string) {
  const supabase = await createServerSupabaseClient();

  // First get teacher record
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (!teacher) {
    // Try by email
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { data: teacherByEmail } = await supabase
        .from("teachers")
        .select("id")
        .eq("email", user.email)
        .eq("is_active", true)
        .single();
      
      if (!teacherByEmail) {
        return { success: true, data: [] };
      }
      
      // Get assignments for this teacher
      const { data: assignments } = await supabase
        .from("teacher_class_assignments")
        .select(`
          id,
          class_id,
          section_id,
          is_class_teacher,
          classes:class_id (id, name, grade_level),
          sections:section_id (id, name)
        `)
        .eq("teacher_id", teacherByEmail.id)
        .eq("can_mark_attendance", true)
        .eq("is_active", true);

      return { success: true, data: assignments || [] };
    }
    return { success: true, data: [] };
  }

  // Get assignments for this teacher
  const { data: assignments, error } = await supabase
    .from("teacher_class_assignments")
    .select(`
      id,
      class_id,
      section_id,
      is_class_teacher,
      classes:class_id (id, name, grade_level),
      sections:section_id (id, name)
    `)
    .eq("teacher_id", teacher.id)
    .eq("can_mark_attendance", true)
    .eq("is_active", true);

  if (error) {
    return { error: error.message };
  }

  return { success: true, data: assignments || [] };
}

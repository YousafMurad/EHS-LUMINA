// API Route for Marking Attendance
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface AttendanceRecord {
  student_id: string;
  status: "present" | "absent" | "late" | "excused" | "half_day";
  remarks?: string | null;
}

interface MarkAttendanceRequest {
  sectionId: string;
  date: string;
  attendance: AttendanceRecord[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's role and verify they're a teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["teacher", "admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json(
        { message: "Only teachers and admins can mark attendance" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: MarkAttendanceRequest = await request.json();
    const { sectionId, date, attendance } = body;

    if (!sectionId || !date || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json(
        { message: "Missing required fields: sectionId, date, attendance" },
        { status: 400 }
      );
    }

    // If teacher, verify they own this section
    if (profile.role === "teacher") {
      // Get teacher record - first try by user_id, then by email
      let teacherId: string | null = null;
      
      // Try to find by user_id first
      const { data: teacherByUserId } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (teacherByUserId) {
        teacherId = teacherByUserId.id;
      } else {
        // Fallback to email lookup
        const { data: teacherByEmail } = await supabase
          .from("teachers")
          .select("id")
          .eq("email", user.email)
          .eq("is_active", true)
          .single();
        
        if (teacherByEmail) {
          teacherId = teacherByEmail.id;
        }
      }

      if (!teacherId) {
        return NextResponse.json(
          { message: "Teacher record not found" },
          { status: 404 }
        );
      }

      // Verify section is assigned to this teacher via teacher_class_assignments
      const { data: assignment } = await supabase
        .from("teacher_class_assignments")
        .select("id")
        .eq("section_id", sectionId)
        .eq("teacher_id", teacherId)
        .eq("is_active", true)
        .single();

      if (!assignment) {
        return NextResponse.json(
          { message: "You are not authorized to mark attendance for this section" },
          { status: 403 }
        );
      }
    }

    // Delete existing attendance for this section and date (to allow re-marking)
    await supabase
      .from("attendance")
      .delete()
      .eq("section_id", sectionId)
      .eq("date", date);

    // Insert new attendance records
    const attendanceRecords = attendance.map((record) => ({
      student_id: record.student_id,
      section_id: sectionId,
      date: date,
      status: record.status,
      remarks: record.remarks || null,
      marked_by: user.id,
      created_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("attendance")
      .insert(attendanceRecords);

    if (insertError) {
      console.error("Error inserting attendance:", insertError);
      return NextResponse.json(
        { message: "Failed to save attendance: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Attendance marked for ${attendance.length} students`,
      recordsCreated: attendance.length,
    });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

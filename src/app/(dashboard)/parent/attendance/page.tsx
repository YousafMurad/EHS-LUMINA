// Parent Attendance View - View child's attendance records
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AttendanceView } from "./attendance-view";

export const dynamic = "force-dynamic";

async function getParentData(parentId: string) {
  const supabase = await createServerSupabaseClient();

  // Get children
  const { data: children } = await supabase
    .from("parent_students")
    .select(`
      id,
      students:student_id (
        id,
        registration_no,
        name,
        photo_url,
        classes:class_id (id, name),
        sections:section_id (id, name)
      )
    `)
    .eq("parent_id", parentId);

  // Cast through unknown: Supabase postgrest-js infers FK joins as arrays,
  // but single FK relations return single objects at runtime
  return { children: (children || []) as unknown as Array<{
    id: string;
    students: {
      id: string;
      registration_no: string;
      name: string;
      photo_url: string | null;
      classes: { id: string; name: string } | null;
      sections: { id: string; name: string } | null;
    } | null;
  }> };
}

// Helper to normalize student data
function getStudent(students: unknown): { id: string } | null {
  if (!students) return null;
  if (Array.isArray(students)) return students[0] || null;
  return students as { id: string };
}

export default async function ParentAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; month?: string; year?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const data = await getParentData(user.id);

  // Get attendance data if student is selected
  let attendanceData = null;
  const firstStudent = data.children[0] ? getStudent(data.children[0].students) : null;
  const selectedStudentId = params.studentId || firstStudent?.id;
  
  if (selectedStudentId) {
    const currentDate = new Date();
    const month = params.month ? parseInt(params.month) : currentDate.getMonth() + 1;
    const year = params.year ? parseInt(params.year) : currentDate.getFullYear();

    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", selectedStudentId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    const present = attendance?.filter(a => a.status === "present").length || 0;
    const absent = attendance?.filter(a => a.status === "absent").length || 0;
    const late = attendance?.filter(a => a.status === "late").length || 0;
    const halfDay = attendance?.filter(a => a.attendance_type === "half_day").length || 0;
    const total = attendance?.length || 0;

    attendanceData = {
      records: attendance || [],
      summary: {
        present,
        absent,
        late,
        halfDay,
        total,
        percentage: total > 0 ? Math.round(((present + late + halfDay * 0.5) / total) * 100) : 0,
      },
      month,
      year,
    };
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500">View your child&apos;s attendance records</p>
      </div>

      <AttendanceView 
        childrenData={data.children}
        selectedStudentId={selectedStudentId || null}
        attendanceData={attendanceData}
      />
    </div>
  );
}

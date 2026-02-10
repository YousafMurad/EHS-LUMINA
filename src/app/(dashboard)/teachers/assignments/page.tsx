// Teacher Assignments Page - Manage teacher-class assignments
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssignmentsManager } from "./assignments-manager";

export const dynamic = "force-dynamic";

async function getAssignmentData() {
  const supabase = await createServerSupabaseClient();

  // Get all teachers - teachers table has name directly
  const { data: teachers, error: teachersError } = await supabase
    .from("teachers")
    .select(`
      id,
      name,
      email,
      employee_code
    `)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (teachersError) {
    console.error("Error fetching teachers:", teachersError);
  }

  // Get all classes
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, name, grade_level")
    .eq("is_active", true)
    .order("grade_level", { ascending: true });

  if (classesError) {
    console.error("Error fetching classes:", classesError);
  }

  // Get all sections
  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("id, name, class_id, capacity")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
  }

  // Get all subjects (if table exists)
  let subjects: { id: string; name: string; code: string }[] = [];
  const { data: subjectsData, error: subjectsError } = await supabase
    .from("subjects")
    .select("id, name, code")
    .order("name", { ascending: true });

  if (!subjectsError && subjectsData) {
    subjects = subjectsData;
  }

  // Get existing assignments (if table exists)
  let assignments: {
    id: string;
    teacher_id: string;
    class_id: string;
    section_id: string | null;
    subject_id: string | null;
    is_class_teacher: boolean;
    created_at: string;
    classes: { id: string; name: string } | null;
    sections: { id: string; name: string } | null;
    subjects: { id: string; name: string; code: string } | null;
  }[] = [];
  
  const { data: assignmentsData, error: assignmentsError } = await supabase
    .from("teacher_class_assignments")
    .select(`
      id,
      teacher_id,
      class_id,
      section_id,
      subject_id,
      is_class_teacher,
      created_at,
      classes:class_id (id, name),
      sections:section_id (id, name),
      subjects:subject_id (id, name, code)
    `)
    .order("created_at", { ascending: false });

  if (!assignmentsError && assignmentsData) {
    assignments = assignmentsData as unknown as typeof assignments;
  }

  console.log("Teachers found:", teachers?.length || 0);
  console.log("Classes found:", classes?.length || 0);

  return {
    teachers: teachers || [],
    classes: classes || [],
    sections: sections || [],
    subjects: subjects,
    assignments: assignments,
  };
}

export default async function TeacherAssignmentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["super_admin", "admin", "operator"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const data = await getAssignmentData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Assignments</h1>
        <p className="text-gray-500">Assign teachers to classes and sections for attendance</p>
      </div>

      <AssignmentsManager 
        teachers={data.teachers}
        classes={data.classes}
        sections={data.sections}
        subjects={data.subjects}
        assignments={data.assignments}
      />
    </div>
  );
}

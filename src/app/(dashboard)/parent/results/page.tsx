// Parent Results View - View child's exam results
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResultsView } from "./results-view";

export const dynamic = "force-dynamic";

// Helper to normalize student data
function getStudent(students: unknown): { id: string } | null {
  if (!students) return null;
  if (Array.isArray(students)) return students[0] || null;
  return students as { id: string };
}

async function getParentData(parentId: string, studentId?: string) {
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

  // Get sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, name, is_current")
    .order("start_date", { ascending: false });

  // Get results for selected student
  let results = null;
  const firstStudent = children?.[0] ? getStudent(children[0].students) : null;
  const selectedStudentId = studentId || firstStudent?.id;

  if (selectedStudentId) {
    const { data: studentResults } = await supabase
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
        exam_types:exam_type_id (id, name, code),
        subjects:subject_id (id, name, code),
        classes:class_id (id, name)
      `)
      .eq("student_id", selectedStudentId)
      .order("created_at", { ascending: false });

    results = studentResults || [];
  }

  return { 
    children: children || [], 
    sessions: sessions || [],
    results,
    selectedStudentId,
  };
}

export default async function ParentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; sessionId?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const data = await getParentData(user.id, params.studentId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-500">View your child&apos;s exam results and grades</p>
      </div>

      <ResultsView 
        childrenData={data.children}
        sessions={data.sessions}
        results={data.results}
        selectedStudentId={data.selectedStudentId || null}
        selectedSessionId={params.sessionId}
      />
    </div>
  );
}

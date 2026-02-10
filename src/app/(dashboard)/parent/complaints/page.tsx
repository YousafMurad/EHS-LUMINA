// Parent Complaints/Suggestions Page - Submit and view feedback
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ComplaintsForm } from "./complaints-form";

export const dynamic = "force-dynamic";

async function getParentComplaints(parentId: string) {
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
        classes:class_id (id, name)
      )
    `)
    .eq("parent_id", parentId);

  // Get complaints/suggestions
  const { data: complaints } = await supabase
    .from("suggestions_complaints")
    .select(`
      id,
      type,
      subject,
      message,
      status,
      response,
      responded_at,
      responded_by,
      created_at,
      students:student_id (id, name)
    `)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false });

  // Cast through unknown: Supabase postgrest-js infers FK joins as arrays,
  // but single FK relations return single objects at runtime
  return {
    children: (children || []) as unknown as Array<{
      id: string;
      students: {
        id: string;
        registration_no: string;
        name: string;
        classes: { id: string; name: string } | null;
      };
    }>,
    complaints: (complaints || []) as unknown as Array<{
      id: string;
      type: "suggestion" | "complaint";
      subject: string;
      message: string;
      status: "pending" | "in_progress" | "resolved" | "closed";
      response: string | null;
      responded_at: string | null;
      responded_by: string | null;
      created_at: string;
      students: { id: string; name: string } | null;
    }>,
  };
}

export default async function ParentComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const data = await getParentComplaints(user.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500">Submit suggestions or complaints to the school</p>
      </div>

      <ComplaintsForm 
        childrenData={data.children}
        complaints={data.complaints}
        defaultStudentId={params.studentId}
        parentId={user.id}
      />
    </div>
  );
}

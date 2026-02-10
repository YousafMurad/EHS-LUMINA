// Feedback Management Page - View and respond to parent feedback
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FeedbackManager } from "./feedback-manager";

export const dynamic = "force-dynamic";

async function getFeedbackData(status?: string) {
  const supabase = await createServerSupabaseClient();

  // Get all feedback
  let query = supabase
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
      parent:parent_id (id, name, email, phone),
      student:student_id (id, name, registration_no, classes:class_id (id, name))
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: feedback } = await query;

  // Get stats
  const { data: allFeedback } = await supabase
    .from("suggestions_complaints")
    .select("id, status, type");

  const stats = {
    total: allFeedback?.length || 0,
    pending: allFeedback?.filter(f => f.status === "pending").length || 0,
    inProgress: allFeedback?.filter(f => f.status === "in_progress").length || 0,
    resolved: allFeedback?.filter(f => f.status === "resolved").length || 0,
    suggestions: allFeedback?.filter(f => f.type === "suggestion").length || 0,
    complaints: allFeedback?.filter(f => f.type === "complaint").length || 0,
  };

  return {
    feedback: feedback || [],
    stats,
  };
}

export default async function FeedbackManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
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

  const params = await searchParams;
  const data = await getFeedbackData(params.status);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-gray-500">View and respond to parent suggestions and complaints</p>
      </div>

      <FeedbackManager 
        feedback={data.feedback}
        stats={data.stats}
        currentStatus={params.status || "all"}
      />
    </div>
  );
}

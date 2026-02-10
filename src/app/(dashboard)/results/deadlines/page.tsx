// Results Deadlines Page - Manage when teachers can submit results
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DeadlinesManager } from "./deadlines-manager";

export const dynamic = "force-dynamic";

async function getDeadlinesData() {
  const supabase = await createServerSupabaseClient();

  // Get all exam types
  const { data: examTypes } = await supabase
    .from("exam_types")
    .select("id, name, code, total_marks")
    .order("name", { ascending: true });

  // Get all classes
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, numeric_name")
    .eq("is_active", true)
    .order("numeric_name", { ascending: true });

  // Get current session
  const { data: currentSession } = await supabase
    .from("sessions")
    .select("id, name, is_current")
    .eq("is_current", true)
    .single();

  // Get all sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, name, is_current")
    .order("start_date", { ascending: false });

  // Get existing deadlines
  const { data: deadlines } = await supabase
    .from("result_deadlines")
    .select(`
      id,
      session_id,
      class_id,
      exam_type_id,
      start_date,
      end_date,
      is_open,
      created_at,
      sessions:session_id (id, name),
      classes:class_id (id, name),
      exam_types:exam_type_id (id, name, code)
    `)
    .order("created_at", { ascending: false });

  // Cast through unknown: Supabase postgrest-js infers FK joins as arrays,
  // but single FK relations return single objects at runtime
  return {
    examTypes: examTypes || [],
    classes: classes || [],
    sessions: sessions || [],
    currentSession,
    deadlines: (deadlines || []) as unknown as Array<{
      id: string;
      session_id: string;
      class_id: string;
      exam_type_id: string;
      start_date: string;
      end_date: string;
      is_open: boolean;
      created_at: string;
      sessions: { id: string; name: string } | null;
      classes: { id: string; name: string } | null;
      exam_types: { id: string; name: string; code: string } | null;
    }>,
  };
}

export default async function ResultsDeadlinesPage() {
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

  const data = await getDeadlinesData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Result Deadlines</h1>
        <p className="text-gray-500">Control when teachers can submit exam results</p>
      </div>

      <DeadlinesManager 
        examTypes={data.examTypes}
        classes={data.classes}
        sessions={data.sessions}
        currentSession={data.currentSession}
        deadlines={data.deadlines}
      />
    </div>
  );
}

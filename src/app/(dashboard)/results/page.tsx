// Results Page - View and manage student results
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileBarChart,
  Clock,
  BookOpen,
  Award,
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getResultsData() {
  const supabase = await createServerSupabaseClient();

  // Get current session
  const { data: currentSession } = await supabase
    .from("sessions")
    .select("id, name")
    .eq("is_current", true)
    .single();

  // Get exam types
  const { data: examTypes } = await supabase
    .from("exam_types")
    .select("id, name, code, total_marks")
    .order("name");

  // Get classes with result counts
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, numeric_name")
    .eq("is_active", true)
    .order("numeric_name");

  // Get result deadlines that are open
  const { data: openDeadlines } = await supabase
    .from("result_deadlines")
    .select(`
      id,
      start_date,
      end_date,
      is_open,
      classes:class_id (id, name),
      exam_types:exam_type_id (id, name)
    `)
    .eq("is_open", true);

  // Get recent results
  const { data: recentResults } = await supabase
    .from("student_results")
    .select(`
      id,
      total_marks,
      obtained_marks,
      grade,
      created_at,
      students:student_id (id, name, registration_no),
      classes:class_id (id, name),
      exam_types:exam_type_id (id, name),
      subjects:subject_id (id, name)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get stats
  const { count: totalResults } = await supabase
    .from("student_results")
    .select("id", { count: "exact", head: true });

  return {
    currentSession,
    examTypes: examTypes || [],
    classes: classes || [],
    openDeadlines: openDeadlines || [],
    recentResults: recentResults || [],
    totalResults: totalResults || 0,
  };
}

export default async function ResultsPage() {
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

  const data = await getResultsData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
          <p className="text-gray-500">
            {data.currentSession?.name || "No active session"} • View and manage student exam results
          </p>
        </div>
        <Link
          href="/results/deadlines"
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors w-fit"
        >
          <Clock size={18} />
          Manage Deadlines
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileBarChart className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.totalResults}</p>
              <p className="text-sm text-gray-500">Total Results</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.openDeadlines.length}</p>
              <p className="text-sm text-gray-500">Open Deadlines</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.examTypes.length}</p>
              <p className="text-sm text-gray-500">Exam Types</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.classes.length}</p>
              <p className="text-sm text-gray-500">Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Deadlines */}
      {data.openDeadlines.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-3">Open for Submissions</h3>
          <div className="flex flex-wrap gap-2">
            {data.openDeadlines.map((deadline: any) => (
              <div key={deadline.id} className="px-3 py-2 bg-white rounded-lg border border-green-200 text-sm">
                <span className="font-medium text-green-800">
                  {deadline.classes?.name}
                </span>
                <span className="text-green-600 mx-2">•</span>
                <span className="text-green-700">{deadline.exam_types?.name}</span>
                <span className="text-green-500 text-xs ml-2">
                  until {new Date(deadline.end_date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link 
          href="/results/deadlines"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Clock size={24} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Result Deadlines</h3>
                <p className="text-sm text-gray-500">Control submission windows</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link 
          href="/results/submissions"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <FileBarChart size={24} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Results</h3>
                <p className="text-sm text-gray-500">Browse submitted results</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </Link>

        <Link 
          href="/reports/results"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <Award size={24} className="text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Result Reports</h3>
                <p className="text-sm text-gray-500">Generate class reports</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Results</h3>
          <Link 
            href="/results/submissions"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        
        {data.recentResults.length === 0 ? (
          <div className="p-8 text-center">
            <FileBarChart size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No results submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Student
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Class
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Exam
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Subject
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Marks
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentResults.map((result: any) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{result.students?.name}</p>
                        <p className="text-xs text-gray-500">{result.students?.registration_no}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {result.classes?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {result.exam_types?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {result.subjects?.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-gray-900">
                        {result.obtained_marks}/{result.total_marks}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.grade === "A+" || result.grade === "A"
                          ? "bg-green-100 text-green-700"
                          : result.grade === "B+" || result.grade === "B"
                          ? "bg-blue-100 text-blue-700"
                          : result.grade === "C+" || result.grade === "C"
                          ? "bg-yellow-100 text-yellow-700"
                          : result.grade === "D"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {result.grade || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

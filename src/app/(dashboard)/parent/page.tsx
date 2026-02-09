// Parent Dashboard - Overview of children
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface StudentData {
  id: string;
  registration_no: string;
  name: string;
  father_name: string;
  date_of_birth: string;
  gender: string;
  photo_url: string | null;
  status: string;
  classes: { id: string; name: string } | null;
  sections: { id: string; name: string } | null;
}

interface Complaint {
  id: string;
  type: string;
  status: string;
  created_at: string;
}

// Helper to normalize student data (Supabase may return object or array)
function getStudent(students: StudentData | StudentData[] | null): StudentData | null {
  if (!students) return null;
  if (Array.isArray(students)) return students[0] || null;
  return students;
}

async function getParentDashboardData(parentId: string) {
  const supabase = await createServerSupabaseClient();

  // Get children
  const { data: children } = await supabase
    .from("parent_students")
    .select(`
      id,
      relationship,
      is_primary,
      students:student_id (
        id,
        registration_no,
        name,
        father_name,
        date_of_birth,
        gender,
        photo_url,
        status,
        classes:class_id (id, name),
        sections:section_id (id, name)
      )
    `)
    .eq("parent_id", parentId);

  // Get attendance summary for this month
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const studentIds = children?.map(c => getStudent(c.students as unknown as StudentData | StudentData[] | null)?.id).filter(Boolean) || [];
  
  let attendanceSummary = { present: 0, absent: 0, total: 0 };
  if (studentIds.length > 0) {
    const { data: attendance } = await supabase
      .from("attendance")
      .select("id, status")
      .in("student_id", studentIds)
      .gte("date", startOfMonth.toISOString().split("T")[0])
      .lte("date", endOfMonth.toISOString().split("T")[0]);

    attendanceSummary = {
      present: attendance?.filter(a => a.status === "present").length || 0,
      absent: attendance?.filter(a => a.status === "absent").length || 0,
      total: attendance?.length || 0,
    };
  }

  // Get recent complaints/suggestions
  const { data: complaints } = await supabase
    .from("suggestions_complaints")
    .select("id, type, status, created_at")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get pending fee count
  const { data: pendingFees } = await supabase
    .from("student_fees")
    .select("id")
    .in("student_id", studentIds)
    .eq("status", "pending");

  return {
    children: children || [],
    attendanceSummary,
    complaints: complaints || [],
    pendingFeesCount: pendingFees?.length || 0,
  };
}

export default async function ParentDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getParentDashboardData(user.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-500">View your children&apos;s academic information</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.children.length}</p>
              <p className="text-sm text-gray-500">Children</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.attendanceSummary.total > 0 
                  ? Math.round((data.attendanceSummary.present / data.attendanceSummary.total) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-500">Attendance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.complaints.length}</p>
              <p className="text-sm text-gray-500">Feedback</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.pendingFeesCount}</p>
              <p className="text-sm text-gray-500">Pending Fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Children</h2>
        {data.children.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No children linked to your account yet.</p>
            <p className="text-sm text-gray-500 mt-1">Please contact the school administration.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {data.children.map((child) => {
              const student = getStudent(child.students as unknown as StudentData | StudentData[] | null);
              if (!student) return null;
              
              return (
                <div 
                  key={child.id} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {student.photo_url ? (
                        <Image 
                          src={student.photo_url} 
                          alt={student.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                          {student.name?.charAt(0) || "S"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                        <p className="text-sm text-gray-500">Reg: {student.registration_no}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {student.classes?.name || "No Class"}
                          </span>
                          {student.sections && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {student.sections.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        student.status === "active" 
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="border-t border-gray-100 bg-gray-50 p-3 grid grid-cols-3 gap-2">
                    <Link 
                      href={`/parent/attendance?studentId=${student.id}`}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-blue-600"
                    >
                      <Calendar size={18} />
                      <span className="text-xs">Attendance</span>
                    </Link>
                    <Link 
                      href={`/parent/results?studentId=${student.id}`}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-purple-600"
                    >
                      <FileText size={18} />
                      <span className="text-xs">Results</span>
                    </Link>
                    <Link 
                      href={`/parent/complaints?studentId=${student.id}`}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-green-600"
                    >
                      <MessageSquare size={18} />
                      <span className="text-xs">Feedback</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      {data.complaints.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Feedback</h3>
            <Link 
              href="/parent/complaints"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {data.complaints.map((complaint: Complaint) => (
              <div key={complaint.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    complaint.type === "suggestion" 
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {complaint.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  complaint.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : complaint.status === "in_progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {complaint.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          href="/parent/attendance"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <Calendar size={24} className="mb-3" />
          <h3 className="font-semibold">Attendance</h3>
          <p className="text-sm text-blue-100 mt-1">View attendance records</p>
        </Link>
        <Link 
          href="/parent/results"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <FileText size={24} className="mb-3" />
          <h3 className="font-semibold">Results</h3>
          <p className="text-sm text-purple-100 mt-1">Check exam results</p>
        </Link>
        <Link 
          href="/parent/complaints"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <MessageSquare size={24} className="mb-3" />
          <h3 className="font-semibold">Feedback</h3>
          <p className="text-sm text-green-100 mt-1">Submit suggestions</p>
        </Link>
        <Link 
          href="/parent/profile"
          className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <Users size={24} className="mb-3" />
          <h3 className="font-semibold">Profile</h3>
          <p className="text-sm text-gray-300 mt-1">Manage your account</p>
        </Link>
      </div>
    </div>
  );
}

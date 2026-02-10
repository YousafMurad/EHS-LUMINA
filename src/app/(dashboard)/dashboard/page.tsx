// Main Dashboard Page - Professional Overview with Role-Based Content
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  DollarSign,
  UserCheck,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Receipt,
  FileText,
  ChevronRight,
} from "lucide-react";
import { TeacherDashboard } from "./teacher-dashboard";
import { OperatorDashboard } from "./operator-dashboard";
import { ParentDashboard } from "./parent-dashboard";

// Type definitions
interface PaymentData {
  amount: number;
}

interface StudentFeeData {
  amount: number;
  paid_amount: number | null;
}

interface SessionData {
  name: string;
}

interface ProfileData {
  name: string;
  role: string;
}

type UserRole = "super_admin" | "admin" | "accountant" | "teacher" | "operator" | "student" | "parent";

// Get user profile
async function getUserProfile(): Promise<{ name: string; role: UserRole }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { name: "User", role: "operator" };
  }

  const { data } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single<ProfileData>();

  return {
    name: data?.name || user.email?.split("@")[0] || "User",
    role: (data?.role as UserRole) || "operator",
  };
}

// Get dashboard statistics
async function getDashboardStats(role: UserRole) {
  const supabase = await createServerSupabaseClient();

  // Get counts in parallel
  const [
    studentsResult,
    teachersResult,
    classesResult,
    sectionsResult,
    activeSessionResult,
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sections").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sessions").select("*").eq("is_active", true).single(),
  ]);

  // Get fee stats
  const [totalCollectedResult, totalPendingResult, overdueResult] = await Promise.all([
    supabase.from("payments").select("amount"),
    supabase
      .from("student_fees")
      .select("amount, paid_amount")
      .in("status", ["pending", "partial"]),
    supabase
      .from("student_fees")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("due_date", new Date().toISOString().split("T")[0]),
  ]);

  // Calculate totals with proper typing
  const payments = (totalCollectedResult.data || []) as PaymentData[];
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  
  const fees = (totalPendingResult.data || []) as StudentFeeData[];
  const totalPending = fees.reduce((sum, f) => sum + (Number(f.amount) - Number(f.paid_amount || 0)), 0);
  
  const session = activeSessionResult.data as SessionData | null;

  return {
    totalStudents: studentsResult.count || 0,
    totalTeachers: teachersResult.count || 0,
    totalClasses: classesResult.count || 0,
    totalSections: sectionsResult.count || 0,
    activeSession: session?.name || "No Active Session",
    totalCollected,
    totalPending,
    overdueCount: overdueResult.count || 0,
    showFinancials: ["super_admin", "admin", "accountant"].includes(role),
    showTeacherStats: ["super_admin", "admin"].includes(role),
  };
}

// Get teacher-specific dashboard data
async function getTeacherDashboardData(userId: string, userEmail: string) {
  const supabase = await createServerSupabaseClient();

  // First, try to find teacher by user_id (linked auth account)
  let { data: teacher } = await supabase
    .from("teachers")
    .select("id, employee_code, name")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  // If not found by user_id, try by email
  if (!teacher) {
    const { data: teacherByEmail } = await supabase
      .from("teachers")
      .select("id, employee_code, name")
      .eq("email", userEmail)
      .eq("is_active", true)
      .single();
    
    teacher = teacherByEmail;
  }

  if (!teacher) {
    return null;
  }

  // Get class/section assignments from teacher_class_assignments table
  const { data: assignments } = await supabase
    .from("teacher_class_assignments")
    .select(`
      id,
      class_id,
      section_id,
      is_class_teacher,
      can_mark_attendance,
      classes:class_id (id, name),
      sections:section_id (id, name, capacity)
    `)
    .eq("teacher_id", teacher.id)
    .eq("is_active", true);

  // Today's date for attendance queries
  const todayDate = new Date().toISOString().split("T")[0];

  // Build sections data from assignments
  const assignedSections = await Promise.all(
    (assignments || []).map(async (assignment) => {
      const classData = assignment.classes as unknown as { id: string; name: string } | null;
      const sectionData = assignment.sections as unknown as { id: string; name: string; capacity: number | null } | null;
      
      // If section is assigned, get students from that section
      // If only class is assigned, get all students from that class
      let studentsQuery = supabase
        .from("students")
        .select("id, name, registration_no, photo_url", { count: "exact" })
        .eq("status", "active")
        .order("name");
      
      if (sectionData?.id) {
        studentsQuery = studentsQuery.eq("section_id", sectionData.id);
      } else if (classData?.id) {
        studentsQuery = studentsQuery.eq("class_id", classData.id);
      }

      const { data: students, count } = await studentsQuery;

      // Get today's attendance
      let attendanceQuery = supabase
        .from("attendance")
        .select("student_id, status, date, remarks")
        .eq("date", todayDate);
      
      if (sectionData?.id) {
        attendanceQuery = attendanceQuery.eq("section_id", sectionData.id);
      }

      const { data: todayAttendance } = await attendanceQuery;

      // Create a unique section ID for UI purposes
      const uiSectionId = sectionData?.id || `class-${classData?.id}`;
      const sectionName = sectionData?.name || "All Sections";
      
      return {
        id: uiSectionId,
        assignmentId: assignment.id,
        name: sectionName,
        className: classData?.name || "Unknown",
        classId: classData?.id || "",
        sectionId: sectionData?.id || null,
        studentCount: count || 0,
        capacity: sectionData?.capacity || null,
        isClassTeacher: assignment.is_class_teacher,
        canMarkAttendance: assignment.can_mark_attendance,
        students: (students || []).map((s) => ({
          id: s.id,
          name: s.name,
          registration_no: s.registration_no,
          photo_url: s.photo_url,
        })),
        todayAttendance: (todayAttendance || []).map((a) => ({
          student_id: a.student_id,
          status: a.status as "present" | "absent" | "late" | "excused" | "half_day",
          date: a.date,
          remarks: a.remarks,
        })),
        attendanceMarked: (todayAttendance || []).length > 0,
      };
    })
  );

  // Calculate total students
  const totalStudents = assignedSections.reduce((sum, s) => sum + s.studentCount, 0);

  // Get current session
  const { data: session } = await supabase
    .from("sessions")
    .select("name")
    .eq("is_active", true)
    .single();

  return {
    teacher: {
      id: teacher.id,
      name: teacher.name,
      employeeCode: teacher.employee_code,
    },
    assignedSections,
    totalStudents,
    currentSession: session?.name || "No Active Session",
  };
}

// Get parent-specific dashboard data
async function getParentDashboardData(userId: string, userEmail: string, userName: string) {
  const supabase = await createServerSupabaseClient();
  
  // Get linked students via parent_students table
  const { data: linkedStudents } = await supabase
    .from("parent_students")
    .select(`
      student_id,
      relationship,
      is_primary,
      students (
        id,
        name,
        registration_no,
        father_name,
        status,
        photo_url,
        section_id,
        sections (
          id,
          name,
          class_id,
          classes (
            id,
            name
          )
        )
      )
    `)
    .eq("parent_id", userId);

  // If no linked students, return empty data
  if (!linkedStudents || linkedStudents.length === 0) {
    const { data: session } = await supabase
      .from("sessions")
      .select("name")
      .eq("is_active", true)
      .single();

    return {
      parentName: userName,
      children: [],
      attendanceSummary: {},
      feeInfo: {},
      currentSession: session?.name || "No Active Session",
    };
  }

  // Format children data
  const children = linkedStudents.map((link) => {
    const student = link.students as unknown as {
      id: string;
      name: string;
      registration_no: string;
      father_name: string;
      status: string;
      photo_url: string | null;
      sections: {
        id: string;
        name: string;
        classes: { id: string; name: string } | null;
      } | null;
    } | null;
    const section = student?.sections;
    const classInfo = section?.classes;

    return {
      id: student?.id || "",
      name: student?.name || "Unknown",
      registrationNo: student?.registration_no || "N/A",
      className: classInfo?.name || "N/A",
      sectionName: section?.name || "N/A",
      photoUrl: student?.photo_url,
      fatherName: student?.father_name,
      status: student?.status || "active",
    };
  });

  // Get attendance summary for each child
  const attendanceSummary: Record<string, {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendancePercentage: number;
  }> = {};

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];

  for (const child of children) {
    if (!child.id) continue;

    const { data: attendance } = await supabase
      .from("attendance")
      .select("status, date")
      .eq("student_id", child.id)
      .gte("date", startOfMonth);

    const totalDays = attendance?.length || 0;
    const presentDays = attendance?.filter((a) => a.status === "present" || a.status === "half_day").length || 0;
    const absentDays = attendance?.filter((a) => a.status === "absent").length || 0;
    const lateDays = attendance?.filter((a) => a.status === "late").length || 0;

    attendanceSummary[child.id] = {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
    };
  }

  // Get fee info for each child
  const feeInfo: Record<string, {
    totalFees: number;
    paidAmount: number;
    pendingAmount: number;
    lastPaymentDate?: string;
  }> = {};

  for (const child of children) {
    if (!child.id) continue;

    // Get student fees
    const { data: fees } = await supabase
      .from("student_fees")
      .select("amount, paid_amount, status")
      .eq("student_id", child.id);

    // Get last payment
    const { data: lastPayment } = await supabase
      .from("payments")
      .select("payment_date")
      .eq("student_id", child.id)
      .order("payment_date", { ascending: false })
      .limit(1)
      .single();

    const totalFees = fees?.reduce((sum, f) => sum + Number(f.amount || 0), 0) || 0;
    const paidAmount = fees?.reduce((sum, f) => sum + Number(f.paid_amount || 0), 0) || 0;

    feeInfo[child.id] = {
      totalFees,
      paidAmount,
      pendingAmount: totalFees - paidAmount,
      lastPaymentDate: lastPayment?.payment_date,
    };
  }

  // Get current session
  const { data: session } = await supabase
    .from("sessions")
    .select("name")
    .eq("is_active", true)
    .single();

  return {
    parentName: userName,
    children,
    attendanceSummary,
    feeInfo,
    currentSession: session?.name || "No Active Session",
  };
}

// Get operator-specific dashboard data
async function getOperatorDashboardData(userName: string) {
  const supabase = await createServerSupabaseClient();

  // Get current date info for queries
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  // Get basic counts
  const [studentsResult, classesResult, sectionsResult, activeSessionResult] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sections").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sessions").select("name").eq("is_active", true).single(),
  ]);

  // Get admissions today and this month
  const [admissionsTodayResult, admissionsMonthResult] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth),
  ]);

  // Get fee collection stats
  const [collectedTodayResult, collectedMonthResult, pendingFeesResult, overdueResult] = await Promise.all([
    supabase
      .from("payments")
      .select("amount")
      .gte("payment_date", startOfToday.split("T")[0]),
    supabase
      .from("payments")
      .select("amount")
      .gte("payment_date", startOfMonth.split("T")[0]),
    supabase
      .from("student_fees")
      .select("amount, paid_amount")
      .in("status", ["pending", "partial"]),
    supabase
      .from("student_fees")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("due_date", today.toISOString().split("T")[0]),
  ]);

  // Calculate totals
  const collectedToday = (collectedTodayResult.data || []).reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );
  const collectedThisMonth = (collectedMonthResult.data || []).reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );
  const pendingFees = (pendingFeesResult.data || []).reduce(
    (sum, f) => sum + (Number(f.amount || 0) - Number(f.paid_amount || 0)),
    0
  );

  // Get recent admissions (last 7 days)
  const { data: recentAdmissions } = await supabase
    .from("students")
    .select(`
      id,
      registration_no,
      name,
      admission_date,
      sections:section_id (
        name,
        classes:class_id (name)
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get students with pending fees
  const { data: studentPendingFees } = await supabase
    .from("student_fees")
    .select(`
      id,
      amount,
      paid_amount,
      due_date,
      status,
      students:student_id (
        id,
        registration_no,
        name,
        sections:section_id (
          name,
          classes:class_id (name)
        )
      )
    `)
    .in("status", ["pending", "partial"])
    .order("due_date", { ascending: true })
    .limit(10);

  const stats = {
    totalStudents: studentsResult.count || 0,
    newAdmissionsToday: admissionsTodayResult.count || 0,
    newAdmissionsThisMonth: admissionsMonthResult.count || 0,
    totalClasses: classesResult.count || 0,
    totalSections: sectionsResult.count || 0,
    pendingFees,
    collectedToday,
    collectedThisMonth,
    overdueCount: overdueResult.count || 0,
  };

  // Format recent admissions for display
  const formattedAdmissions = (recentAdmissions || []).map((student) => {
    const section = student.sections as unknown as { name: string; classes: { name: string } | null } | null;
    return {
      id: student.id,
      registrationNo: student.registration_no || "N/A",
      name: student.name,
      className: section?.classes?.name || "Unknown",
      sectionName: section?.name || "Unknown",
      admissionDate: student.admission_date || new Date().toISOString(),
    };
  });

  // Format pending fees for display
  const formattedPendingFees = (studentPendingFees || []).map((fee) => {
    const student = fee.students as unknown as { 
      id: string; 
      registration_no: string; 
      name: string;
      sections: { name: string; classes: { name: string } | null } | null;
    } | null;
    const dueDate = new Date(fee.due_date);
    const isOverdue = dueDate < today && fee.status !== "paid";

    return {
      id: student?.id || fee.id,
      registrationNo: student?.registration_no || "N/A",
      name: student?.name || "Unknown",
      className: student?.sections?.classes?.name 
        ? `${student.sections.classes.name} - ${student.sections.name}` 
        : "Unknown",
      pendingAmount: Number(fee.amount || 0) - Number(fee.paid_amount || 0),
      dueDate: fee.due_date,
      isOverdue,
    };
  });

  return {
    operatorName: userName,
    stats,
    recentAdmissions: formattedAdmissions,
    pendingFees: formattedPendingFees,
    currentSession: activeSessionResult.data?.name || "No Active Session",
  };
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userProfile = await getUserProfile();

  // If user is a teacher, show the teacher dashboard
  if (userProfile.role === "teacher" && user?.id) {
    const teacherData = await getTeacherDashboardData(user.id, user.email || "");
    
    // Always show teacher dashboard for teacher role, even if no teacher record found
    // In that case, show empty state
    const teacherInfo = teacherData?.teacher || {
      id: user.id,
      name: userProfile.name,
      employeeCode: "N/A",
    };

    return (
      <div className="p-6 lg:p-8">
        <TeacherDashboard
          teacher={teacherInfo}
          assignedSections={teacherData?.assignedSections || []}
          totalStudents={teacherData?.totalStudents || 0}
          currentSession={teacherData?.currentSession || "No Active Session"}
        />
      </div>
    );
  }

  // If user is an operator, show the operator dashboard
  if (userProfile.role === "operator") {
    const operatorData = await getOperatorDashboardData(userProfile.name);
    
    return (
      <div className="p-6 lg:p-8">
        <OperatorDashboard
          operatorName={operatorData.operatorName}
          stats={operatorData.stats}
          recentAdmissions={operatorData.recentAdmissions}
          pendingFees={operatorData.pendingFees}
          currentSession={operatorData.currentSession}
        />
      </div>
    );
  }

  // If user is a parent, show the parent dashboard
  if (userProfile.role === "parent" && user?.id) {
    const parentData = await getParentDashboardData(user.id, user.email || "", userProfile.name);
    
    return (
      <div className="p-6 lg:p-8">
        <ParentDashboard
          parentName={parentData.parentName}
          childrenData={parentData.children}
          attendanceSummary={parentData.attendanceSummary}
          feeInfo={parentData.feeInfo}
          currentSession={parentData.currentSession}
        />
      </div>
    );
  }

  // Regular dashboard for other roles
  const stats = await getDashboardStats(userProfile.role);
  const collectionRate = stats.totalCollected + stats.totalPending > 0 
    ? ((stats.totalCollected / (stats.totalCollected + stats.totalPending)) * 100).toFixed(1)
    : "0";

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₨ ${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₨ ${(amount / 1000).toFixed(0)}K`;
    }
    return `₨ ${amount.toLocaleString()}`;
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good Morning" : today.getHours() < 17 ? "Good Afternoon" : "Good Evening";
  
  // Role display name
  const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    accountant: "Accountant",
    teacher: "Teacher",
    operator: "Operator",
    student: "Student",
    parent: "Parent",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                {greeting}, {userProfile.name}! 👋
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                {userProfile.role === "teacher" 
                  ? "Welcome to your teacher portal. Manage your classes and students."
                  : userProfile.role === "student"
                  ? "Welcome to your student portal."
                  : "Here's what's happening at your school today."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <UserCheck size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="font-semibold text-slate-800">{roleLabels[userProfile.role]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Active Session</p>
                  <p className="font-semibold text-slate-800">{stats.activeSession}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Today</p>
                  <p className="font-semibold text-slate-800">
                    {today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Students Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Students</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-800 mt-2">{stats.totalStudents}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} /> +12%
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Users size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Teachers Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Teachers</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-800 mt-2">{stats.totalTeachers}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} /> Active
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
                <UserCheck size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Classes Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Classes</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-800 mt-2">{stats.totalClasses}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-xs text-slate-500">{stats.totalSections} sections</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Overdue Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Overdue Fees</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-800 mt-2">{stats.overdueCount}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <AlertTriangle size={12} /> Needs attention
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                <Clock size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column - 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Financial Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Financial Overview</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Current session fee collection status</p>
                  </div>
                  <Link 
                    href="/fees"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {/* Collection Rate Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Collection Rate</span>
                    <span className="text-lg font-bold text-emerald-600">{collectionRate}%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${collectionRate}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Financial Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={18} />
                        <span className="text-sm font-medium text-emerald-100">Total Collected</span>
                      </div>
                      <p className="text-3xl font-bold">{formatCurrency(stats.totalCollected)}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={18} />
                        <span className="text-sm font-medium text-rose-100">Total Pending</span>
                      </div>
                      <p className="text-3xl font-bold">{formatCurrency(stats.totalPending)}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={18} />
                        <span className="text-sm font-medium text-amber-100">Overdue</span>
                      </div>
                      <p className="text-3xl font-bold">{stats.overdueCount} <span className="text-lg font-normal">students</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Latest actions and updates</p>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { icon: CheckCircle, color: "emerald", title: "Fee Payment Received", desc: "Ahmad Khan (Class 5A) - ₨ 5,000", time: "5 mins ago" },
                  { icon: UserPlus, color: "blue", title: "New Student Registered", desc: "Maria Bibi enrolled in Class 3B", time: "30 mins ago" },
                  { icon: Clock, color: "amber", title: "Fee Reminder Sent", desc: "15 students with pending fees", time: "2 hours ago" },
                  { icon: GraduationCap, color: "violet", title: "New Section Created", desc: "Class 6 - Section C added", time: "5 hours ago" },
                  { icon: CheckCircle, color: "emerald", title: "Fee Payment Received", desc: "Hassan Ali (Class 8A) - ₨ 7,500", time: "8 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.color === "emerald" ? "bg-emerald-100 text-emerald-600" :
                        activity.color === "blue" ? "bg-blue-100 text-blue-600" :
                        activity.color === "amber" ? "bg-amber-100 text-amber-600" :
                        "bg-violet-100 text-violet-600"
                      }`}>
                        <activity.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">{activity.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{activity.desc}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
                <p className="text-sm text-slate-500 mt-0.5">Frequently used actions</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <Link
                  href="/students/new"
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <UserPlus size={28} />
                  <span className="text-sm font-semibold">Add Student</span>
                </Link>
                <Link
                  href="/fees/collection"
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <DollarSign size={28} />
                  <span className="text-sm font-semibold">Collect Fee</span>
                </Link>
                <Link
                  href="/certificates"
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <FileText size={28} />
                  <span className="text-sm font-semibold">Certificates</span>
                </Link>
                <Link
                  href="/reports"
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Receipt size={28} />
                  <span className="text-sm font-semibold">Reports</span>
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Important alerts</p>
                  </div>
                  <span className="flex items-center justify-center w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full">3</span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { type: "warning", title: "45 students have overdue fees", time: "Today" },
                  { type: "info", title: "Monthly report is ready", time: "Yesterday" },
                  { type: "success", title: "Backup completed successfully", time: "2 days ago" },
                ].map((notif, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notif.type === "warning" ? "bg-amber-500" :
                        notif.type === "info" ? "bg-blue-500" : "bg-emerald-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50">
                <button className="w-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Shortcuts */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
              <div className="relative">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight size={16} /> System Settings
                  </Link>
                  <Link
                    href="/operators"
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight size={16} /> Manage Users
                  </Link>
                  <Link
                    href="/sessions"
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight size={16} /> Academic Sessions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

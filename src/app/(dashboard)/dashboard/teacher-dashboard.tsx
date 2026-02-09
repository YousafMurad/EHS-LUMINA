// Teacher Dashboard - Attendance & Class Management View
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  UserCheck,
  UserX,
  Save,
  Loader2,
} from "lucide-react";

// Types
interface Student {
  id: string;
  name: string;
  registration_no: string;
  photo_url: string | null;
}

interface AttendanceRecord {
  student_id: string;
  status: "present" | "absent" | "late" | "excused" | "half_day";
  date: string;
  remarks?: string | null;
}

interface AssignedSection {
  id: string;
  assignmentId?: string;
  name: string;
  className: string;
  classId: string;
  sectionId?: string | null;
  studentCount: number;
  capacity: number | null;
  isClassTeacher?: boolean;
  canMarkAttendance?: boolean;
  students: Student[];
  todayAttendance: AttendanceRecord[];
  attendanceMarked: boolean;
}

interface TeacherInfo {
  id: string;
  name: string;
  employeeCode: string;
}

interface TeacherDashboardProps {
  teacher: TeacherInfo;
  assignedSections: AssignedSection[];
  totalStudents: number;
  currentSession: string;
}

// Attendance Status Button
function AttendanceButton({
  status,
  currentStatus,
  onClick,
  disabled,
}: {
  status: "present" | "absent" | "late" | "excused" | "half_day";
  currentStatus: "present" | "absent" | "late" | "excused" | "half_day" | null;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isActive = currentStatus === status;
  
  const statusConfig = {
    present: {
      icon: CheckCircle,
      label: "P",
      activeClass: "bg-green-500 text-white border-green-500",
      inactiveClass: "bg-white text-green-600 border-green-300 hover:bg-green-50",
    },
    absent: {
      icon: XCircle,
      label: "A",
      activeClass: "bg-red-500 text-white border-red-500",
      inactiveClass: "bg-white text-red-600 border-red-300 hover:bg-red-50",
    },
    late: {
      icon: Clock,
      label: "L",
      activeClass: "bg-yellow-500 text-white border-yellow-500",
      inactiveClass: "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50",
    },
    excused: {
      icon: AlertCircle,
      label: "E",
      activeClass: "bg-blue-500 text-white border-blue-500",
      inactiveClass: "bg-white text-blue-600 border-blue-300 hover:bg-blue-50",
    },
    half_day: {
      icon: Clock,
      label: "H",
      activeClass: "bg-orange-500 text-white border-orange-500",
      inactiveClass: "bg-white text-orange-600 border-orange-300 hover:bg-orange-50",
    },
  };

  const config = statusConfig[status];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all font-semibold text-sm ${
        isActive ? config.activeClass : config.inactiveClass
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    >
      {config.label}
    </button>
  );
}

// Section Attendance Card with expandable student list
function SectionAttendanceCard({
  section,
  onMarkAttendance,
  isSaving,
}: {
  section: AssignedSection;
  onMarkAttendance: (sectionId: string, attendance: Record<string, { status: "present" | "absent" | "late" | "excused" | "half_day"; remarks?: string }>) => void;
  isSaving: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, { status: "present" | "absent" | "late" | "excused" | "half_day"; remarks?: string }>>(() => {
    // Initialize from existing attendance
    const initial: Record<string, { status: "present" | "absent" | "late" | "excused" | "half_day"; remarks?: string }> = {};
    section.todayAttendance.forEach((record) => {
      initial[record.student_id] = { 
        status: record.status as "present" | "absent" | "late" | "excused" | "half_day", 
        remarks: record.remarks || undefined 
      };
    });
    return initial;
  });

  const presentCount = Object.values(attendance).filter((s) => s.status === "present").length;
  const absentCount = Object.values(attendance).filter((s) => s.status === "absent").length;
  const lateCount = Object.values(attendance).filter((s) => s.status === "late").length;
  const halfDayCount = Object.values(attendance).filter((s) => s.status === "half_day").length;
  const unmarkedCount = section.students.length - Object.keys(attendance).length;

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused" | "half_day") => {
    setAttendance((prev) => {
      const current = prev[studentId];
      if (current?.status === status) {
        // Remove if clicking same status - eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [studentId]: _removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [studentId]: { status, remarks: prev[studentId]?.remarks },
      };
    });
  };

  const markAllPresent = () => {
    const allPresent: Record<string, { status: "present" | "absent" | "late" | "excused" | "half_day"; remarks?: string }> = {};
    section.students.forEach((student) => {
      allPresent[student.id] = { status: "present" };
    });
    setAttendance(allPresent);
  };

  const handleSave = () => {
    onMarkAttendance(section.sectionId || section.id, attendance);
  };

  const hasChanges = JSON.stringify(attendance) !== JSON.stringify(
    section.todayAttendance.reduce((acc, r) => ({ ...acc, [r.student_id]: { status: r.status, remarks: r.remarks } }), {})
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {section.name?.charAt(0) || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {section.className} {section.sectionId ? `- Section ${section.name}` : ""}
                </h3>
                {section.isClassTeacher && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Class Teacher
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {section.studentCount} students • {section.attendanceMarked ? "✓ Attendance marked" : "⏳ Pending"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <CheckCircle size={14} /> {presentCount}
              </span>
              <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                <XCircle size={14} /> {absentCount}
              </span>
              {lateCount > 0 && (
                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Clock size={14} /> {lateCount}
                </span>
              )}
              {halfDayCount > 0 && (
                <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                  <Clock size={14} /> {halfDayCount} HD
                </span>
              )}
              {unmarkedCount > 0 && (
                <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                  <AlertCircle size={14} /> {unmarkedCount}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content - Student List */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Quick Actions */}
          <div className="p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllPresent}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                <UserCheck size={16} /> Mark All Present
              </button>
              <button
                type="button"
                onClick={() => setAttendance({})}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <UserX size={16} /> Clear All
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Legend:</span>{" "}
              <span className="text-green-600">P</span>=Present,{" "}
              <span className="text-red-600">A</span>=Absent,{" "}
              <span className="text-yellow-600">L</span>=Late,{" "}
              <span className="text-blue-600">E</span>=Excused,{" "}
              <span className="text-orange-600">H</span>=Half Day
            </div>
          </div>

          {/* Student List */}
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {section.students.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No students enrolled in this section</p>
              </div>
            ) : (
              section.students.map((student, index) => (
                <div
                  key={student.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                    {student.photo_url ? (
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${student.photo_url})` }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.registration_no}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AttendanceButton
                      status="present"
                      currentStatus={attendance[student.id]?.status || null}
                      onClick={() => handleStatusChange(student.id, "present")}
                      disabled={isSaving}
                    />
                    <AttendanceButton
                      status="absent"
                      currentStatus={attendance[student.id]?.status || null}
                      onClick={() => handleStatusChange(student.id, "absent")}
                      disabled={isSaving}
                    />
                    <AttendanceButton
                      status="late"
                      currentStatus={attendance[student.id]?.status || null}
                      onClick={() => handleStatusChange(student.id, "late")}
                      disabled={isSaving}
                    />
                    <AttendanceButton
                      status="excused"
                      currentStatus={attendance[student.id]?.status || null}
                      onClick={() => handleStatusChange(student.id, "excused")}
                      disabled={isSaving}
                    />
                    <AttendanceButton
                      status="half_day"
                      currentStatus={attendance[student.id]?.status || null}
                      onClick={() => handleStatusChange(student.id, "half_day")}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          {section.students.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {Object.keys(attendance).length} of {section.students.length} students marked
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  hasChanges
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Attendance
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TeacherDashboard({
  teacher,
  assignedSections,
  totalStudents,
  currentSession,
}: TeacherDashboardProps) {
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current date info
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });

  // Calculate attendance stats
  const sectionsWithAttendance = assignedSections.filter((s) => s.attendanceMarked).length;
  const pendingSections = assignedSections.length - sectionsWithAttendance;
  
  // Handle attendance save
  const handleMarkAttendance = async (
    sectionId: string,
    attendance: Record<string, { status: "present" | "absent" | "late" | "excused" | "half_day"; remarks?: string }>
  ) => {
    setSavingSection(sectionId);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          date: today.toISOString().split("T")[0],
          attendance: Object.entries(attendance).map(([studentId, data]) => ({
            student_id: studentId,
            status: data.status,
            remarks: data.remarks || null,
          })),
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Attendance saved for section successfully!`);
        // Refresh the page to update attendance data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">{dayName}, {dateStr}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Welcome, {teacher.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-blue-100 mt-2">
              {assignedSections.length > 0 
                ? `You have ${assignedSections.length} section${assignedSections.length > 1 ? "s" : ""} with ${totalStudents} students to manage today`
                : "No sections assigned yet"
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="text-xs text-blue-100">Employee ID</p>
              <p className="font-bold text-lg">{teacher.employeeCode}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="text-xs text-blue-100">Session</p>
              <p className="font-bold text-lg">{currentSession}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">My Sections</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{assignedSections.length}</p>
              <p className="text-xs text-gray-400 mt-1">Assigned to you</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              <p className="text-xs text-gray-400 mt-1">Under your care</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Attendance Done</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{sectionsWithAttendance}</p>
              <p className="text-xs text-green-500 mt-1">Sections marked today</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ClipboardCheck size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingSections}</p>
              <p className="text-xs text-yellow-500 mt-1">Sections to mark</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <ClipboardList size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Attendance</h2>
              <p className="text-sm text-gray-500">Mark attendance for your assigned sections</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>

        {/* Section Cards for Attendance */}
        {assignedSections.length > 0 ? (
          <div className="space-y-4">
            {assignedSections.map((section) => (
              <SectionAttendanceCard
                key={section.id}
                section={section}
                onMarkAttendance={handleMarkAttendance}
                isSaving={savingSection === section.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">No Sections Assigned</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You don&apos;t have any sections assigned to you yet. Please contact the administrator to get assigned to a section.
            </p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/students"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">View My Students</h4>
            <p className="text-sm text-gray-500">See all students in your assigned sections</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
        </Link>

        <Link
          href="/reports/attendance"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
            <ClipboardList size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">Attendance Reports</h4>
            <p className="text-sm text-gray-500">View past attendance records and trends</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}

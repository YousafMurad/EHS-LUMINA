// Attendance View Component - Client component for viewing attendance
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";

interface StudentData {
  id: string;
  registration_no: string;
  name: string;
  photo_url: string | null;
  classes: { id: string; name: string } | null;
  sections: { id: string; name: string } | null;
}

interface Child {
  id: string;
  students: StudentData | StudentData[] | null;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late";
  attendance_type: "full_day" | "half_day" | "absent" | null;
  left_early: boolean;
  left_at: string | null;
  remarks: string | null;
}

interface AttendanceData {
  records: AttendanceRecord[];
  summary: {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    total: number;
    percentage: number;
  };
  month: number;
  year: number;
}

interface AttendanceViewProps {
  childrenData: Child[];
  selectedStudentId: string | null;
  attendanceData: AttendanceData | null;
}

// Helper to normalize student data
function getStudent(students: StudentData | StudentData[] | null): StudentData | null {
  if (!students) return null;
  if (Array.isArray(students)) return students[0] || null;
  return students;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function AttendanceView({ childrenData, selectedStudentId, attendanceData }: AttendanceViewProps) {
  const router = useRouter();

  const currentDate = new Date();
  const month = attendanceData?.month || currentDate.getMonth() + 1;
  const year = attendanceData?.year || currentDate.getFullYear();

  const handleStudentChange = (studentId: string) => {
    router.push(`/parent/attendance?studentId=${studentId}&month=${month}&year=${year}`);
  };

  const handleMonthChange = (newMonth: number, newYear: number) => {
    router.push(`/parent/attendance?studentId=${selectedStudentId}&month=${newMonth}&year=${newYear}`);
  };

  const goToPrevMonth = () => {
    if (month === 1) {
      handleMonthChange(12, year - 1);
    } else {
      handleMonthChange(month - 1, year);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      handleMonthChange(1, year + 1);
    } else {
      handleMonthChange(month + 1, year);
    }
  };

  const selectedChild = childrenData.find((c) => {
    const student = getStudent(c.students);
    return student?.id === selectedStudentId;
  });

  // Generate calendar days
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const calendarDays = [];

  // Add empty cells for days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, record: null });
  }

  // Add days with attendance data
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = attendanceData?.records.find((r) => r.date === dateStr);
    calendarDays.push({ day, record: record || null });
  }

  const getStatusColor = (record: AttendanceRecord | null) => {
    if (!record) return "bg-gray-50 text-gray-400";
    if (record.status === "present") {
      if (record.attendance_type === "half_day") return "bg-yellow-100 text-yellow-700";
      return "bg-green-100 text-green-700";
    }
    if (record.status === "late") return "bg-blue-100 text-blue-700";
    if (record.status === "absent") return "bg-red-100 text-red-700";
    return "bg-gray-50 text-gray-400";
  };

  const getStatusIcon = (record: AttendanceRecord | null) => {
    if (!record) return null;
    if (record.status === "present") {
      if (record.attendance_type === "half_day") return <Clock size={14} />;
      return <CheckCircle size={14} />;
    }
    if (record.status === "late") return <AlertCircle size={14} />;
    if (record.status === "absent") return <XCircle size={14} />;
    return null;
  };

  if (childrenData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No children linked to your account.</p>
      </div>
    );
  }

  const selectedStudent = selectedChild ? getStudent(selectedChild.students) : null;

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      {childrenData.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Child
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {childrenData.map((child) => {
              const student = getStudent(child.students);
              if (!student) return null;
              return (
                <button
                  key={student.id}
                  onClick={() => handleStudentChange(student.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedStudentId === student.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.classes?.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Student Info */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {selectedStudent.photo_url ? (
              <Image
                src={selectedStudent.photo_url}
                alt={selectedStudent.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.name?.charAt(0) || "S"}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedStudent.classes?.name} - {selectedStudent.sections?.name}
              </p>
              <p className="text-xs text-gray-400">
                Reg: {selectedStudent.registration_no}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {attendanceData && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm text-green-100">Present</p>
            <p className="text-2xl font-bold">{attendanceData.summary.present}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
            <p className="text-sm text-red-100">Absent</p>
            <p className="text-2xl font-bold">{attendanceData.summary.absent}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm text-blue-100">Late</p>
            <p className="text-2xl font-bold">{attendanceData.summary.late}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <p className="text-sm text-yellow-100">Half Day</p>
            <p className="text-2xl font-bold">{attendanceData.summary.halfDay}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm text-purple-100">Attendance %</p>
            <p className="text-2xl font-bold">{attendanceData.summary.percentage}%</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Month Navigation */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[month - 1]} {year}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                  item.day ? getStatusColor(item.record) : ""
                }`}
              >
                {item.day && (
                  <>
                    <span className="font-medium">{item.day}</span>
                    {getStatusIcon(item.record)}
                    {item.record?.left_early && (
                      <span className="text-[10px] mt-0.5">Early</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 rounded"></span>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-100 rounded"></span>
              <span className="text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded"></span>
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-100 rounded"></span>
              <span className="text-gray-600">Half Day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      {attendanceData && attendanceData.records.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Detailed Records</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {attendanceData.records.map((record) => (
              <div key={record.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(record)}`}>
                    {getStatusIcon(record)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {record.remarks && (
                      <p className="text-sm text-gray-500">{record.remarks}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(record)}`}>
                    {record.attendance_type === "half_day" ? "Half Day" : record.status}
                  </span>
                  {record.left_early && record.left_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Left at {record.left_at}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

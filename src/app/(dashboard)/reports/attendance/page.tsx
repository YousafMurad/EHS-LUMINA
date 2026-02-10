// Attendance Reports Page
import { PageHeader } from "@/components/dashboard/page-header";
import { getClasses } from "@/server/queries/classes";
import { Calendar, Users, UserCheck, UserX, TrendingUp, Clock } from "lucide-react";
import { AttendanceReportsFilters } from "./attendance-reports-filters";
import { ExportButtons } from "../export-buttons";

interface AttendanceReportsPageProps {
  searchParams: Promise<{
    class_id?: string;
    month?: string;
    year?: string;
    type?: string;
  }>;
}

export default async function AttendanceReportsPage({ searchParams }: AttendanceReportsPageProps) {
  const params = await searchParams;
  
  const classes = await getClasses(true);

  type ClassType = { id: string; name: string };
  const classOptions = (classes as ClassType[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  // Mock attendance data
  const attendanceStats = {
    totalDays: 22,
    avgAttendance: 92.5,
    totalStudents: 850,
    presentToday: 785,
    absentToday: 65,
    lateArrivals: 23,
  };

  const classWiseAttendance = [
    { class: "Nursery", students: 83, present: 78, absent: 5, rate: 94 },
    { class: "KG", students: 96, present: 91, absent: 5, rate: 95 },
    { class: "Class 1", students: 108, present: 100, absent: 8, rate: 93 },
    { class: "Class 2", students: 103, present: 96, absent: 7, rate: 93 },
    { class: "Class 3", students: 95, present: 88, absent: 7, rate: 93 },
    { class: "Class 4", students: 88, present: 80, absent: 8, rate: 91 },
    { class: "Class 5", students: 80, present: 73, absent: 7, rate: 91 },
    { class: "Class 6", students: 74, present: 67, absent: 7, rate: 91 },
    { class: "Class 7", students: 68, present: 61, absent: 7, rate: 90 },
    { class: "Class 8", students: 57, present: 51, absent: 6, rate: 89 },
  ];

  const weeklyTrend = [
    { day: "Monday", present: 805, absent: 45, rate: 95 },
    { day: "Tuesday", present: 798, absent: 52, rate: 94 },
    { day: "Wednesday", present: 785, absent: 65, rate: 92 },
    { day: "Thursday", present: 792, absent: 58, rate: 93 },
    { day: "Friday", present: 770, absent: 80, rate: 91 },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance Reports"
        description="Track and analyze attendance patterns"
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Attendance Reports" },
        ]}
      >
        <ExportButtons />
      </PageHeader>

      {/* Filters */}
      <AttendanceReportsFilters
        classOptions={classOptions}
        currentFilters={{
          class_id: params.class_id || "",
          month: params.month || "",
          year: params.year || new Date().getFullYear().toString(),
          type: params.type || "daily",
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.totalDays}</p>
              <p className="text-xs text-gray-500">Working Days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.avgAttendance}%</p>
              <p className="text-xs text-gray-500">Avg Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.totalStudents}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.presentToday}</p>
              <p className="text-xs text-gray-500">Present Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.absentToday}</p>
              <p className="text-xs text-gray-500">Absent Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{attendanceStats.lateArrivals}</p>
              <p className="text-xs text-gray-500">Late Arrivals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Attendance Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Attendance</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FEE2E2"
                  strokeWidth="20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="20"
                  strokeDasharray={`${(attendanceStats.presentToday / attendanceStats.totalStudents) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round((attendanceStats.presentToday / attendanceStats.totalStudents) * 100)}%
                </span>
                <span className="text-xs text-gray-500">Present</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Present ({attendanceStats.presentToday})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-200"></div>
              <span className="text-sm text-gray-600">Absent ({attendanceStats.absentToday})</span>
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">This Week&apos;s Trend</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Present</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Absent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {weeklyTrend.map((row) => (
                  <tr key={row.day} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.day}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-medium">{row.present}</td>
                    <td className="px-4 py-3 text-center text-red-600 font-medium">{row.absent}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${
                              row.rate >= 95 ? "bg-green-500" :
                              row.rate >= 90 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${row.rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{row.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class-wise Attendance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Class-wise Attendance Today</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Present</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classWiseAttendance.map((row) => (
                <tr key={row.class} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.class}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{row.students}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">{row.present}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-medium">{row.absent}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[120px]">
                        <div
                          className={`h-full rounded-full ${
                            row.rate >= 95 ? "bg-green-500" :
                            row.rate >= 90 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${row.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[40px]">{row.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {classWiseAttendance.reduce((sum, row) => sum + row.students, 0)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-green-600">
                  {classWiseAttendance.reduce((sum, row) => sum + row.present, 0)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-red-600">
                  {classWiseAttendance.reduce((sum, row) => sum + row.absent, 0)}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {Math.round(classWiseAttendance.reduce((sum, row) => sum + row.rate, 0) / classWiseAttendance.length)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

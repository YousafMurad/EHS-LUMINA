// Student Reports Page - Enrollment and demographic reports
import { PageHeader } from "@/components/dashboard/page-header";
import { getClasses } from "@/server/queries/classes";
import { Users, UserPlus, UserMinus, TrendingUp } from "lucide-react";
import { StudentReportsFilters } from "./student-reports-filters";
import { ExportButtons } from "../export-buttons";

interface StudentReportsPageProps {
  searchParams: Promise<{
    class_id?: string;
    gender?: string;
    status?: string;
  }>;
}

export default async function StudentReportsPage({ searchParams }: StudentReportsPageProps) {
  const params = await searchParams;
  
  const classes = await getClasses(true);

  type ClassType = { id: string; name: string; student_count?: number };
  const classOptions = (classes as ClassType[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  // Mock data for reports
  const enrollmentStats = {
    totalStudents: 850,
    maleStudents: 480,
    femaleStudents: 370,
    newAdmissions: 120,
    withdrawals: 15,
    growthRate: 12.5,
  };

  const classWiseData = [
    { class: "Nursery", male: 45, female: 38, total: 83, sections: 2 },
    { class: "KG", male: 52, female: 44, total: 96, sections: 2 },
    { class: "Class 1", male: 58, female: 50, total: 108, sections: 3 },
    { class: "Class 2", male: 55, female: 48, total: 103, sections: 3 },
    { class: "Class 3", male: 50, female: 45, total: 95, sections: 2 },
    { class: "Class 4", male: 48, female: 40, total: 88, sections: 2 },
    { class: "Class 5", male: 45, female: 35, total: 80, sections: 2 },
    { class: "Class 6", male: 42, female: 32, total: 74, sections: 2 },
    { class: "Class 7", male: 40, female: 28, total: 68, sections: 2 },
    { class: "Class 8", male: 35, female: 22, total: 57, sections: 2 },
  ];

  return (
    <div>
      <PageHeader
        title="Student Reports"
        description="Enrollment statistics and demographic analysis"
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Student Reports" },
        ]}
      >
        <ExportButtons />
      </PageHeader>

      {/* Filters */}
      <StudentReportsFilters
        classOptions={classOptions}
        currentFilters={{
          class_id: params.class_id || "",
          gender: params.gender || "",
          status: params.status || "active",
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{enrollmentStats.totalStudents}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{enrollmentStats.maleStudents}</p>
              <p className="text-xs text-gray-500">Male Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{enrollmentStats.femaleStudents}</p>
              <p className="text-xs text-gray-500">Female Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{enrollmentStats.newAdmissions}</p>
              <p className="text-xs text-gray-500">New Admissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserMinus size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{enrollmentStats.withdrawals}</p>
              <p className="text-xs text-gray-500">Withdrawals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">+{enrollmentStats.growthRate}%</p>
              <p className="text-xs text-gray-500">Growth Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gender Distribution Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="20"
                  strokeDasharray={`${(enrollmentStats.maleStudents / enrollmentStats.totalStudents) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{enrollmentStats.totalStudents}</span>
                <span className="text-xs text-gray-500">Students</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-sm text-gray-600">Male ({Math.round((enrollmentStats.maleStudents / enrollmentStats.totalStudents) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span className="text-sm text-gray-600">Female ({Math.round((enrollmentStats.femaleStudents / enrollmentStats.totalStudents) * 100)}%)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Class-wise Enrollment</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Male</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Female</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Sections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classWiseData.map((row) => (
                  <tr key={row.class} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.class}</td>
                    <td className="px-4 py-3 text-center text-indigo-600">{row.male}</td>
                    <td className="px-4 py-3 text-center text-pink-600">{row.female}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">{row.total}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.sections}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-center font-bold text-indigo-600">
                    {classWiseData.reduce((sum, row) => sum + row.male, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-pink-600">
                    {classWiseData.reduce((sum, row) => sum + row.female, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900">
                    {classWiseData.reduce((sum, row) => sum + row.total, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-600">
                    {classWiseData.reduce((sum, row) => sum + row.sections, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

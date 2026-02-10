// Class Reports Page - Class strength and section analysis
import { PageHeader } from "@/components/dashboard/page-header";
import { getClasses } from "@/server/queries/classes";
import { getSections } from "@/server/queries/sections";
import { Building2, Users, BookOpen, TrendingUp, Award } from "lucide-react";
import { ExportButtons } from "../export-buttons";

export default async function ClassReportsPage() {
  const [classes, sections] = await Promise.all([
    getClasses(true),
    getSections(),
  ]);

  type ClassType = { id: string; name: string; display_order: number };
  type SectionType = { id: string; name: string; class_id: string; capacity: number };

  // Calculate statistics
  const totalClasses = (classes as ClassType[]).length;
  const totalSections = (sections as SectionType[]).length;
  
  // Group sections by class
  const sectionsByClass = (sections as SectionType[]).reduce((acc, section) => {
    if (!acc[section.class_id]) {
      acc[section.class_id] = [];
    }
    acc[section.class_id].push(section);
    return acc;
  }, {} as Record<string, SectionType[]>);

  // Mock class data with students
  const classData = (classes as ClassType[]).map((cls, index) => {
    const classSections = sectionsByClass[cls.id] || [];
    const totalCapacity = classSections.reduce((sum, s) => sum + (s.capacity || 40), 0);
    // Mock student count using deterministic calculation based on index
    const studentCount = Math.floor(totalCapacity * (0.75 + (index % 5) * 0.04));
    const occupancyRate = totalCapacity > 0 ? Math.round((studentCount / totalCapacity) * 100) : 0;
    
    return {
      id: cls.id,
      name: cls.name,
      displayOrder: cls.display_order,
      sectionCount: classSections.length,
      sections: classSections.map(s => s.name),
      capacity: totalCapacity,
      studentCount,
      occupancyRate,
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  const totalCapacity = classData.reduce((sum, cls) => sum + cls.capacity, 0);
  const totalStudents = classData.reduce((sum, cls) => sum + cls.studentCount, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Class Reports"
        description="Class strength and section analysis"
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Class Reports" },
        ]}
      >
        <ExportButtons />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalClasses}</p>
              <p className="text-xs text-gray-500">Total Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalSections}</p>
              <p className="text-xs text-gray-500">Total Sections</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalCapacity}</p>
              <p className="text-xs text-gray-500">Total Capacity</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{avgOccupancy}%</p>
              <p className="text-xs text-gray-500">Avg Occupancy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Class-wise Details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Class-wise Strength Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Sections</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Capacity</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Students</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Vacant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Occupancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classData.map((cls) => {
                const vacant = cls.capacity - cls.studentCount;
                return (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500">{cls.sections.join(", ") || "No sections"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {cls.sectionCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">{cls.capacity}</td>
                    <td className="px-6 py-4 text-center font-medium text-blue-600">{cls.studentCount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={vacant > 10 ? "text-green-600" : vacant > 0 ? "text-yellow-600" : "text-red-600"}>
                        {vacant}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[120px]">
                          <div
                            className={`h-full rounded-full ${
                              cls.occupancyRate >= 90 ? "bg-red-500" :
                              cls.occupancyRate >= 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(cls.occupancyRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[40px]">{cls.occupancyRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center font-bold text-purple-600">{totalSections}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">{totalCapacity}</td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">{totalStudents}</td>
                <td className="px-6 py-4 text-center font-bold text-green-600">{totalCapacity - totalStudents}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{avgOccupancy}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Section Capacity Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Section-wise Capacity Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classData.slice(0, 8).map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  cls.occupancyRate >= 90 ? "bg-red-100 text-red-700" :
                  cls.occupancyRate >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                }`}>
                  {cls.occupancyRate}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium text-gray-900">{cls.studentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-900">{cls.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sections</span>
                  <span className="font-medium text-gray-900">{cls.sectionCount}</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    cls.occupancyRate >= 90 ? "bg-red-500" :
                    cls.occupancyRate >= 70 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(cls.occupancyRate, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

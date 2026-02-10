// Promotions Page - Academic year promotions
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getPromotionStats, getClassProgressionMap } from "@/server/queries/promotions";
import { getSessions } from "@/server/queries/sessions";
import { getClasses } from "@/server/queries/classes";
import { ArrowUpDown, Users, GraduationCap, History, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function PromotionsPage() {
  const [stats, classes, sessions] = await Promise.all([
    getPromotionStats(),
    getClasses(true),
    getSessions(),
  ]);

  // Type the classes array
  type ClassType = { id: string; name: string; grade_level?: number; next_class_id?: string };
  const typedClasses = classes as ClassType[];

  return (
    <div>
      <PageHeader
        title="Student Promotions"
        description="Promote students to the next class or session"
        breadcrumbs={[{ label: "Promotions" }]}
      >
        <PageHeaderButton href="/promotions/history" icon={<History size={18} />} variant="secondary">
          View History
        </PageHeaderButton>
        <PageHeaderButton href="/promotions/bulk" icon={<ArrowUpDown size={18} />} variant="primary">
          Bulk Promotion
        </PageHeaderButton>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowUpDown size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPromoted}</p>
              <p className="text-sm text-gray-500">Total Promotions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.thisSession}</p>
              <p className="text-sm text-gray-500">This Session</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingStudents}</p>
              <p className="text-sm text-gray-500">Active Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Wise Promotion Cards */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Promote by Class</h2>
          <p className="text-sm text-gray-500">Select a class to promote students individually or in groups</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typedClasses.map((cls) => {
              const nextClass = typedClasses.find((c) => c.id === cls.next_class_id);
              return (
                <Link
                  key={cls.id}
                  href={`/promotions/class/${cls.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-900">{cls.name}</h3>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  {nextClass ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Promotes to:</span>
                      <span className="font-medium text-gray-700">{nextClass.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Final class (graduation)</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Bulk Promotion</h3>
          <p className="text-blue-100 text-sm mb-4">
            Promote all students from one class to the next in a single action. 
            Best for end-of-year promotions.
          </p>
          <Link
            href="/promotions/bulk"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-blue-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            <ArrowUpDown size={18} />
            Start Bulk Promotion
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Promotion History</h3>
          <p className="text-green-100 text-sm mb-4">
            View all past promotions, filter by session, class, or student. 
            Export records for documentation.
          </p>
          <Link
            href="/promotions/history"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            <History size={18} />
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}

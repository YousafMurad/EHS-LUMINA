// Classes List Page - View all classes
import { Plus, GraduationCap } from "lucide-react";
import { getClasses } from "@/server/queries/classes";
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { ClassesTable } from "./classes-table";

export default async function ClassesPage() {
  const classes = await getClasses(false); // Get all classes including inactive

  return (
    <div>
      <PageHeader
        title="Classes"
        description="Manage class levels and grades"
        breadcrumbs={[{ label: "Classes" }]}
        actions={
          <PageHeaderButton href="/classes/new" icon={<Plus size={18} />}>
            Add Class
          </PageHeaderButton>
        }
      />

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-500 mb-6">Create your first class to get started</p>
          <PageHeaderButton href="/classes/new" icon={<Plus size={18} />}>
            Create Class
          </PageHeaderButton>
        </div>
      ) : (
        <ClassesTable classes={classes} />
      )}
    </div>
  );
}

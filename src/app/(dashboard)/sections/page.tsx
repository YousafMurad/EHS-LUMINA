// Sections List Page
import { Plus, BookOpen } from "lucide-react";
import { getSections } from "@/server/queries/sections";
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { SectionsTable } from "./sections-table";

export default async function SectionsPage() {
  const sections = await getSections();

  return (
    <div>
      <PageHeader
        title="Sections"
        description="Manage class sections"
        breadcrumbs={[{ label: "Sections" }]}
        actions={
          <PageHeaderButton href="/sections/new" icon={<Plus size={18} />}>
            Add Section
          </PageHeaderButton>
        }
      />

      {sections.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Found</h3>
          <p className="text-gray-500 mb-6">Create your first section to get started</p>
          <PageHeaderButton href="/sections/new" icon={<Plus size={18} />}>
            Create Section
          </PageHeaderButton>
        </div>
      ) : (
        <SectionsTable sections={sections} />
      )}
    </div>
  );
}

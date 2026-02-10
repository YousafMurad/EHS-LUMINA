// Section Detail Page
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getSectionById } from "@/server/queries/sections";
import { notFound } from "next/navigation";
import { Pencil, Users, GraduationCap } from "lucide-react";

interface SectionDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Student {
  id: string;
  name: string;
  registration_no: string;
  photo_url?: string;
}

interface SectionData {
  id: string;
  name: string;
  capacity?: number;
  classes?: { id: string; name: string };
  teachers?: { id: string; name: string; phone?: string };
  students?: Student[];
}

export default async function SectionDetailPage({ params }: SectionDetailPageProps) {
  const { id } = await params;
  
  let section: SectionData;
  try {
    section = await getSectionById(id) as SectionData;
  } catch {
    notFound();
  }

  const students = section.students || [];

  return (
    <div>
      <PageHeader
        title={`Section ${section.name}`}
        description={section.classes?.name || ""}
        breadcrumbs={[
          { label: "Sections", href: "/sections" },
          { label: section.name },
        ]}
      >
        <PageHeaderButton
          href={`/sections/${id}/edit`}
          icon={<Pencil size={18} />}
        >
          Edit Section
        </PageHeaderButton>
      </PageHeader>

      {/* Section Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-semibold text-gray-900">{section.classes?.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Students</p>
              <p className="font-semibold text-gray-900">
                {students.length} / {section.capacity || "∞"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class Teacher</p>
              <p className="font-semibold text-gray-900">
                {section.teachers?.name || "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Students in this Section</h2>
          <PageHeaderButton href={`/students/new?section_id=${id}`} variant="primary">
            Add Student
          </PageHeaderButton>
        </div>
        
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No students in this section yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Reg. No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-semibold text-sm">
                            {student.name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.registration_no}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

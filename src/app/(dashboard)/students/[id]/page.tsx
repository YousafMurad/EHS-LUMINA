// Student Detail Page - View individual student
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getStudentById } from "@/server/queries/students";
import { notFound } from "next/navigation";
import { Pencil, CreditCard, Users, Award, User, Phone, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

interface PromotionRecord {
  id: string;
  from_class?: { name: string };
  to_class?: { name: string };
  promoted_at: string;
}

interface StudentData {
  id: string;
  name: string;
  registration_no: string;
  father_name: string;
  mother_name?: string;
  date_of_birth: string;
  gender: string;
  cnic?: string;
  blood_group?: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  address?: string;
  admission_date: string;
  status: string;
  photo_url?: string;
  classes?: { id: string; name: string };
  sections?: { id: string; name: string };
  promotions?: PromotionRecord[];
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  let student: StudentData;
  try {
    student = await getStudentById(id) as StudentData;
  } catch {
    notFound();
  }

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div>
      <PageHeader
        title={student.name}
        description={`Registration No: ${student.registration_no}`}
        breadcrumbs={[
          { label: "Students", href: "/students" },
          { label: student.name },
        ]}
      >
        <PageHeaderButton
          href={`/students/${id}/edit`}
          icon={<Pencil size={18} />}
        >
          Edit Student
        </PageHeaderButton>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <User size={20} className="text-gray-500" />
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-gray-500">Full Name</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Father&apos;s Name</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.father_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Mother&apos;s Name</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.mother_name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 font-medium text-gray-900">{formatDate(student.date_of_birth)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Gender</dt>
                  <dd className="mt-1 font-medium text-gray-900 capitalize">{student.gender}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">CNIC / B-Form</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.cnic || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Blood Group</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.blood_group || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <BookOpen size={20} className="text-gray-500" />
              <h2 className="font-semibold text-gray-900">Academic Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-gray-500">Class</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.classes?.name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Section</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.sections?.name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Admission Date</dt>
                  <dd className="mt-1 font-medium text-gray-900">{formatDate(student.admission_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700"
                        : student.status === "left"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <Phone size={20} className="text-gray-500" />
              <h2 className="font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.phone || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Emergency Contact</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.emergency_contact || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Address</dt>
                  <dd className="mt-1 font-medium text-gray-900">{student.address || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photo Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-blue-100">
                <span className="text-4xl font-bold text-blue-600">
                  {student.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 text-lg">{student.name}</h3>
              <p className="text-sm text-gray-500">{student.registration_no}</p>
              <p className="mt-2 text-sm font-medium text-blue-600">
                {student.classes?.name} {student.sections?.name && `- ${student.sections.name}`}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link
                href={`/students/${id}/fees`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CreditCard size={20} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">View Fee History</span>
              </Link>
              <Link
                href={`/students/${id}/family`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users size={20} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Family Members</span>
              </Link>
              <Link
                href={`/students/${id}/certificates`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Award size={20} className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Generate Certificate</span>
              </Link>
            </div>
          </div>

          {/* Promotion History */}
          {student.promotions && student.promotions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Promotion History</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {student.promotions.map((promo) => (
                    <div key={promo.id} className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <span className="text-gray-500">{promo.from_class?.name}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium text-gray-900">{promo.to_class?.name}</span>
                        <p className="text-xs text-gray-400">{formatDate(promo.promoted_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

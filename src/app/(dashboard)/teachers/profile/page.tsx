// Teacher Profile Page - View bio data and salary information
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  DollarSign,
  Briefcase,
  Clock,
  ArrowLeft,
  CreditCard,
  FileText,
  Building,
} from "lucide-react";
import { ProfileEditForm } from "./profile-edit-form";

export const dynamic = "force-dynamic";

async function getTeacherProfile(userId: string, userEmail: string) {
  const supabase = await createServerSupabaseClient();

  // Try to find teacher by user_id first
  const { data: teacher } = await supabase
    .from("teachers")
    .select(`
      *,
      salary_history (
        id,
        old_salary,
        new_salary,
        effective_date,
        created_at
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  let teacherResult = teacher;

  // If not found, try by email
  if (!teacherResult && userEmail) {
    const { data: teacherByEmail } = await supabase
      .from("teachers")
      .select(`
        *,
        salary_history (
          id,
          old_salary,
          new_salary,
          effective_date,
          created_at
        )
      `)
      .eq("email", userEmail)
      .eq("is_active", true)
      .single();

    if (teacherByEmail) {
      teacherResult = teacherByEmail;
    }
  }

  // If still not found, check if there's a profile entry and try to find teacher by matching profile name/email
  if (!teacherResult) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (profile) {
      const { data: teacherByProfileEmail } = await supabase
        .from("teachers")
        .select(`
          *,
          salary_history (
            id,
            old_salary,
            new_salary,
            effective_date,
            created_at
          )
        `)
        .eq("email", profile.email)
        .eq("is_active", true)
        .single();

      if (teacherByProfileEmail) {
        teacherResult = teacherByProfileEmail;
        // Update teacher record to link user_id for future lookups
        await supabase
          .from("teachers")
          .update({ user_id: userId } as Record<string, unknown>)
          .eq("id", teacherByProfileEmail.id);
      }
    }
  }

  return teacherResult;
}

export default async function TeacherProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teacher = await getTeacherProfile(user.id, user.email || "");

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            Your teacher profile has not been set up yet. Please contact the administrator.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">View your personal information and employment details</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-6">
          {teacher.photo_url ? (
            <Image
              src={teacher.photo_url}
              alt={teacher.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-xl object-cover border-4 border-white/30"
            />
          ) : (
            <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center text-4xl font-bold">
              {teacher.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{teacher.name}</h2>
            <p className="text-blue-100 flex items-center gap-2 mt-1">
              <Briefcase size={16} />
              {teacher.contract_type.charAt(0).toUpperCase() + teacher.contract_type.slice(1)} Teacher
            </p>
            <p className="text-blue-100 flex items-center gap-2 mt-1">
              <CreditCard size={16} />
              Employee Code: {teacher.employee_code}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<User size={18} />}
                  label="Full Name"
                  value={teacher.name}
                />
                <InfoItem
                  icon={<FileText size={18} />}
                  label="CNIC"
                  value={teacher.cnic}
                />
                <InfoItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value={teacher.email || "Not provided"}
                />
                <InfoItem
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={teacher.phone}
                />
                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={teacher.address || "Not provided"}
                  colSpan={2}
                />
              </div>
            </div>
          </div>

          {/* Qualification & Specialization */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-600" />
                Qualification Details
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<GraduationCap size={18} />}
                  label="Qualification"
                  value={teacher.qualification || "Not specified"}
                />
                <InfoItem
                  icon={<Building size={18} />}
                  label="Specialization"
                  value={teacher.specialization || "Not specified"}
                />
              </div>
            </div>
          </div>

          {/* Assigned Sections */}
          {teacher.sections && teacher.sections.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building size={18} className="text-blue-600" />
                  Assigned Sections
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {teacher.sections.map((section: { id: string; name: string; classes?: { name: string } }) => (
                    <span
                      key={section.id}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                    >
                      {section.classes?.name || "Unknown"} - Section {section.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Employment & Salary */}
        <div className="space-y-6">
          {/* Employment Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" />
                Employment Details
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Contract Type</span>
                <span className="font-medium text-gray-900 capitalize">{teacher.contract_type}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Joining Date</span>
                <span className="font-medium text-gray-900">{formatDate(teacher.joining_date)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {teacher.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Current Salary */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-green-100">Current Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(teacher.salary)}</p>
              </div>
            </div>
            <p className="text-sm text-green-100">Monthly compensation</p>
          </div>

          {/* Salary History */}
          {teacher.salary_history && teacher.salary_history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Salary History
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {teacher.salary_history
                  .sort((a: { effective_date: string }, b: { effective_date: string }) => 
                    new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
                  )
                  .slice(0, 5)
                  .map((history: { id: string; old_salary: number; new_salary: number; effective_date: string }) => (
                    <div key={history.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">
                          {formatDate(history.effective_date)}
                        </span>
                        <span className={`text-sm font-medium ${
                          history.new_salary > history.old_salary ? "text-green-600" : "text-red-600"
                        }`}>
                          {history.new_salary > history.old_salary ? "+" : ""}
                          {formatCurrency(history.new_salary - history.old_salary)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{formatCurrency(history.old_salary)}</span>
                        <span className="text-gray-300">→</span>
                        <span className="font-medium text-gray-900">{formatCurrency(history.new_salary)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Password Change Form */}
          <ProfileEditForm />
        </div>
      </div>

      {/* Agreement Terms if any */}
      {teacher.agreement_terms && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Contract Agreement Terms
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{teacher.agreement_terms}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Info Item Component
function InfoItem({
  icon,
  label,
  value,
  colSpan = 1,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colSpan?: number;
}) {
  return (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        {icon}
        {label}
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

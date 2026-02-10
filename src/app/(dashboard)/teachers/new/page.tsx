// Add New Teacher Page
import { ChevronRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { TeacherForm } from "../teacher-form";

export default function AddTeacherPage() {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
        <ChevronRight size={14} />
        <Link href="/teachers" className="hover:text-gray-700">Teachers</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Add New Teacher</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <UserPlus size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Teacher</h1>
          <p className="text-gray-500">Register a new teacher with login credentials</p>
        </div>
      </div>

      {/* Form */}
      <TeacherForm />
    </div>
  );
}

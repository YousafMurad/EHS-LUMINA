import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { FileText, Award, GraduationCap, Clock, CheckCircle, AlertCircle } from "lucide-react";

const certificateTypes = [
  {
    title: "School Leaving Certificate",
    description: "Issue SLC for students leaving the school",
    icon: FileText,
    href: "/certificates/slc",
    color: "bg-blue-100 text-blue-600",
    stats: { pending: 3, issued: 45 },
  },
  {
    title: "Character Certificate",
    description: "Generate character/conduct certificates",
    icon: Award,
    href: "/certificates/character",
    color: "bg-green-100 text-green-600",
    stats: { pending: 1, issued: 128 },
  },
  {
    title: "Result Card / Sanad",
    description: "Generate exam result cards and certificates",
    icon: GraduationCap,
    href: "/certificates/result-card",
    color: "bg-purple-100 text-purple-600",
    stats: { pending: 12, issued: 340 },
  },
];

const recentCertificates = [
  { id: 1, type: "SLC", student: "Ahmed Khan", class: "10th", date: "2025-06-05", status: "issued" },
  { id: 2, type: "Character", student: "Fatima Ali", class: "8th", date: "2025-06-04", status: "issued" },
  { id: 3, type: "Result Card", student: "Muhammad Usman", class: "9th", date: "2025-06-04", status: "pending" },
  { id: 4, type: "SLC", student: "Ayesha Begum", class: "10th", date: "2025-06-03", status: "pending" },
  { id: 5, type: "Character", student: "Bilal Ahmad", class: "7th", date: "2025-06-02", status: "issued" },
];

export default function CertificatesPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Certificates"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Certificates" },
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">513</p>
              <p className="text-sm text-gray-500">Total Issued</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">16</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Certificate Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Type Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificate Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificateTypes.map((cert) => {
            const Icon = cert.icon;
            return (
              <Link key={cert.href} href={cert.href}>
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-yellow-400 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cert.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{cert.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-orange-600">
                          <Clock size={14} />
                          {cert.stats.pending} pending
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} />
                          {cert.stats.issued} issued
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Certificates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Student</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Class</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cert.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{cert.student}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cert.class}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cert.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        cert.status === "issued"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {cert.status === "issued" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

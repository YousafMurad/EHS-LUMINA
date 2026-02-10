"use client";

import { useState } from "react";
import { Search, User, FileText, Printer, Download, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { CertificateHeader } from "@/components/certificates";

interface Student {
  id: string;
  name: string;
  fatherName: string;
  rollNo: string;
  class: string;
  section: string;
  admissionDate: string;
  dateOfBirth: string;
  hasPendingDues: boolean;
  pendingAmount?: number;
}

// Sample students data
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    fatherName: "Muhammad Khan",
    rollNo: "2024001",
    class: "10th",
    section: "A",
    admissionDate: "2020-04-15",
    dateOfBirth: "2008-03-12",
    hasPendingDues: false,
  },
  {
    id: "2",
    name: "Fatima Ali",
    fatherName: "Ali Hassan",
    rollNo: "2024015",
    class: "10th",
    section: "B",
    admissionDate: "2019-04-10",
    dateOfBirth: "2007-08-25",
    hasPendingDues: true,
    pendingAmount: 5000,
  },
  {
    id: "3",
    name: "Muhammad Usman",
    fatherName: "Usman Ghani",
    rollNo: "2024022",
    class: "9th",
    section: "A",
    admissionDate: "2021-04-12",
    dateOfBirth: "2009-11-05",
    hasPendingDues: false,
  },
];

export function SLCClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slcData, setSLCData] = useState({
    leavingDate: "",
    lastAttendanceDate: "",
    reason: "",
    conduct: "good",
    remarks: "",
  });

  const filteredStudents = sampleStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
  );

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSLCData({
      leavingDate: new Date().toISOString().split("T")[0],
      lastAttendanceDate: new Date().toISOString().split("T")[0],
      reason: "",
      conduct: "good",
      remarks: "",
    });
  };

  const handleGenerate = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    // Would trigger PDF generation here
    alert("SLC Generated Successfully! Print preview would open here.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Search Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Select Student</h3>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Student List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedStudent?.id === student.id
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      {student.class} - {student.section} | Roll: {student.rollNo}
                    </p>
                    {student.hasPendingDues && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                        <AlertCircle size={12} />
                        Pending dues: Rs. {student.pendingAmount?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filteredStudents.length === 0 && (
              <p className="text-center py-4 text-gray-500 text-sm">No students found</p>
            )}
          </div>
        </div>
      </div>

      {/* SLC Form */}
      <div className="lg:col-span-2">
        {selectedStudent ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generate SLC</h3>
                  <p className="text-sm text-gray-500">For {selectedStudent.name}</p>
                </div>
              </div>
              {selectedStudent.hasPendingDues && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                    <AlertCircle size={16} />
                    Clear pending dues before issuing SLC
                  </p>
                </div>
              )}
            </div>

            {/* Student Info Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Father&apos;s Name</p>
                  <p className="font-medium text-gray-900">{selectedStudent.fatherName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{selectedStudent.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admission Date</p>
                  <p className="font-medium text-gray-900">{selectedStudent.admissionDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Class</p>
                  <p className="font-medium text-gray-900">{selectedStudent.class} - {selectedStudent.section}</p>
                </div>
                <div>
                  <p className="text-gray-500">Roll Number</p>
                  <p className="font-medium text-gray-900">{selectedStudent.rollNo}</p>
                </div>
              </div>
            </div>

            {/* SLC Details Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Leaving</label>
                  <input
                    type="date"
                    value={slcData.leavingDate}
                    onChange={(e) => setSLCData({ ...slcData, leavingDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Attendance Date</label>
                  <input
                    type="date"
                    value={slcData.lastAttendanceDate}
                    onChange={(e) => setSLCData({ ...slcData, lastAttendanceDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                <select
                  value={slcData.reason}
                  onChange={(e) => setSLCData({ ...slcData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select reason...</option>
                  <option value="parents_request">On parent&apos;s request</option>
                  <option value="transfer">Transfer to another school</option>
                  <option value="completed">Completed education</option>
                  <option value="migration">Migration to another city</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conduct & Behavior</label>
                <select
                  value={slcData.conduct}
                  onChange={(e) => setSLCData({ ...slcData, conduct: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="excellent">Excellent</option>
                  <option value="very_good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="satisfactory">Satisfactory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                <textarea
                  value={slcData.remarks}
                  onChange={(e) => setSLCData({ ...slcData, remarks: e.target.value })}
                  rows={3}
                  placeholder="Any additional remarks..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedStudent.hasPendingDues || !slcData.reason}
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                {isGenerating ? "Generating..." : "Generate SLC"}
              </button>
              <button
                disabled={isGenerating || selectedStudent.hasPendingDues}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Printer size={18} />
                Print Preview
              </button>
              <button
                disabled={isGenerating || selectedStudent.hasPendingDues}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>

            {/* Certificate Preview */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Certificate Preview</h4>
              <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-inner">
                <CertificateHeader size="md" />
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900 underline">SCHOOL LEAVING CERTIFICATE</h2>
                  <p className="text-sm text-gray-600 mt-2">Serial No: SLC-{new Date().getFullYear()}-XXX</p>
                </div>
                <div className="mt-6 space-y-2 text-sm text-gray-700">
                  <p>This is to certify that <strong>{selectedStudent.name}</strong>, S/D/o <strong>{selectedStudent.fatherName}</strong>,</p>
                  <p>Roll No. <strong>{selectedStudent.rollNo}</strong>, was a bonafide student of this institution.</p>
                  <p>Date of Birth: <strong>{selectedStudent.dateOfBirth}</strong></p>
                  <p>Date of Admission: <strong>{selectedStudent.admissionDate}</strong></p>
                  <p>Class at the time of leaving: <strong>{selectedStudent.class} - {selectedStudent.section}</strong></p>
                  {slcData.leavingDate && <p>Date of Leaving: <strong>{slcData.leavingDate}</strong></p>}
                  {slcData.conduct && <p>Conduct: <strong>{slcData.conduct.replace("_", " ").toUpperCase()}</strong></p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Student</h3>
            <p className="text-gray-500">Search and select a student from the left panel to generate SLC</p>
          </div>
        )}

        {/* Recent SLCs */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recently Issued SLCs</h3>
          <div className="space-y-3">
            {[
              { student: "Zainab Fatima", class: "10th A", date: "2025-06-01", serial: "SLC-2025-045" },
              { student: "Hassan Ali", class: "10th B", date: "2025-05-28", serial: "SLC-2025-044" },
              { student: "Maryam Khan", class: "9th A", date: "2025-05-25", serial: "SLC-2025-043" },
            ].map((slc, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{slc.student}</p>
                    <p className="text-xs text-gray-500">{slc.class} • {slc.date}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500">{slc.serial}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

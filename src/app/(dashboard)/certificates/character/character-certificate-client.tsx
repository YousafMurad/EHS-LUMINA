"use client";

import { useState } from "react";
import { Search, User, Award, Printer, Download, CheckCircle, Loader2 } from "lucide-react";
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
}

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
  },
  {
    id: "2",
    name: "Fatima Ali",
    fatherName: "Ali Hassan",
    rollNo: "2024015",
    class: "8th",
    section: "B",
    admissionDate: "2021-04-10",
    dateOfBirth: "2009-08-25",
  },
  {
    id: "3",
    name: "Bilal Ahmad",
    fatherName: "Ahmad Shah",
    rollNo: "2024022",
    class: "7th",
    section: "A",
    admissionDate: "2022-04-12",
    dateOfBirth: "2010-11-05",
  },
];

export function CharacterCertificateClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [certData, setCertData] = useState({
    purpose: "",
    conduct: "excellent",
    attendance: "regular",
    academicPerformance: "good",
    participation: [] as string[],
    remarks: "",
    validUntil: "",
  });

  const filteredStudents = sampleStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
  );

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    const validDate = new Date();
    validDate.setMonth(validDate.getMonth() + 3);
    setCertData({
      purpose: "",
      conduct: "excellent",
      attendance: "regular",
      academicPerformance: "good",
      participation: [],
      remarks: "",
      validUntil: validDate.toISOString().split("T")[0],
    });
  };

  const toggleParticipation = (activity: string) => {
    setCertData((prev) => ({
      ...prev,
      participation: prev.participation.includes(activity)
        ? prev.participation.filter((a) => a !== activity)
        : [...prev.participation, activity],
    }));
  };

  const handleGenerate = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    alert("Character Certificate Generated Successfully!");
  };

  const participationOptions = [
    "Sports Activities",
    "Cultural Events",
    "Science Fair",
    "Quran Competition",
    "Debate Club",
    "Community Service",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Search Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Select Student</h3>
          
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
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Form */}
      <div className="lg:col-span-2">
        {selectedStudent ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Character Certificate</h3>
                <p className="text-sm text-gray-500">For {selectedStudent.name}</p>
              </div>
            </div>

            {/* Student Info */}
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
                  <p className="text-gray-500">Class</p>
                  <p className="font-medium text-gray-900">{selectedStudent.class} - {selectedStudent.section}</p>
                </div>
                <div>
                  <p className="text-gray-500">Roll Number</p>
                  <p className="font-medium text-gray-900">{selectedStudent.rollNo}</p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Certificate</label>
                <select
                  value={certData.purpose}
                  onChange={(e) => setCertData({ ...certData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select purpose...</option>
                  <option value="scholarship">Scholarship Application</option>
                  <option value="admission">Admission to Another Institution</option>
                  <option value="competition">Competition/Event Participation</option>
                  <option value="visa">Visa/Travel Purpose</option>
                  <option value="general">General Purpose</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conduct & Behavior</label>
                  <select
                    value={certData.conduct}
                    onChange={(e) => setCertData({ ...certData, conduct: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="satisfactory">Satisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendance</label>
                  <select
                    value={certData.attendance}
                    onChange={(e) => setCertData({ ...certData, attendance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="regular">Regular</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Performance</label>
                  <select
                    value={certData.academicPerformance}
                    onChange={(e) => setCertData({ ...certData, academicPerformance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="satisfactory">Satisfactory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra-curricular Participation</label>
                <div className="flex flex-wrap gap-2">
                  {participationOptions.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleParticipation(activity)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        certData.participation.includes(activity)
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={certData.validUntil}
                  onChange={(e) => setCertData({ ...certData, validUntil: e.target.value })}
                  className="max-w-xs w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Remarks</label>
                <textarea
                  value={certData.remarks}
                  onChange={(e) => setCertData({ ...certData, remarks: e.target.value })}
                  rows={3}
                  placeholder="Any additional remarks to include..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !certData.purpose}
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Award size={18} />}
                {isGenerating ? "Generating..." : "Generate Certificate"}
              </button>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                <Printer size={18} />
                Print Preview
              </button>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
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
                  <h2 className="text-xl font-bold text-gray-900 underline">CHARACTER CERTIFICATE</h2>
                </div>
                <div className="mt-6 space-y-3 text-sm text-gray-700">
                  <p>This is to certify that <strong>{selectedStudent.name}</strong>, S/D/o <strong>{selectedStudent.fatherName}</strong>,</p>
                  <p>is a bonafide student of this institution in Class <strong>{selectedStudent.class} - {selectedStudent.section}</strong>.</p>
                  <p className="mt-4">According to our records, his/her character and conduct has been <strong>{certData.conduct.replace("_", " ").toUpperCase()}</strong>.</p>
                  <p>Attendance: <strong>{certData.attendance.toUpperCase()}</strong></p>
                  <p>Academic Performance: <strong>{certData.academicPerformance.replace("_", " ").toUpperCase()}</strong></p>
                  {certData.participation.length > 0 && (
                    <p>Extra-curricular Activities: <strong>{certData.participation.join(", ")}</strong></p>
                  )}
                  {certData.purpose && <p className="mt-4 italic">This certificate is issued for: <strong>{certData.purpose.replace("_", " ")}</strong></p>}
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
            <p className="text-gray-500">Search and select a student to generate character certificate</p>
          </div>
        )}

        {/* Recent Certificates */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recently Issued</h3>
          <div className="space-y-3">
            {[
              { student: "Aisha Begum", class: "8th A", date: "2025-06-04", purpose: "Scholarship" },
              { student: "Owais Khan", class: "7th B", date: "2025-06-02", purpose: "Competition" },
              { student: "Sara Ali", class: "9th A", date: "2025-05-30", purpose: "General" },
            ].map((cert, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{cert.student}</p>
                    <p className="text-xs text-gray-500">{cert.class} • {cert.date}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{cert.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, User, GraduationCap, Printer, Download, FileText, Loader2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  fatherName: string;
  rollNo: string;
  class: string;
  section: string;
}

interface Subject {
  name: string;
  maxMarks: number;
  obtainedMarks: number;
}

const sampleStudents: Student[] = [
  { id: "1", name: "Ahmed Khan", fatherName: "Muhammad Khan", rollNo: "2024001", class: "10th", section: "A" },
  { id: "2", name: "Fatima Ali", fatherName: "Ali Hassan", rollNo: "2024015", class: "10th", section: "B" },
  { id: "3", name: "Muhammad Usman", fatherName: "Usman Ghani", rollNo: "2024022", class: "9th", section: "A" },
];

const defaultSubjects: Subject[] = [
  { name: "Quran", maxMarks: 100, obtainedMarks: 0 },
  { name: "Tajweed", maxMarks: 100, obtainedMarks: 0 },
  { name: "Hifz", maxMarks: 100, obtainedMarks: 0 },
  { name: "Islamic Studies", maxMarks: 100, obtainedMarks: 0 },
  { name: "Arabic", maxMarks: 100, obtainedMarks: 0 },
  { name: "Urdu", maxMarks: 100, obtainedMarks: 0 },
  { name: "English", maxMarks: 100, obtainedMarks: 0 },
  { name: "Mathematics", maxMarks: 100, obtainedMarks: 0 },
];

export function ResultCardClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [examType, setExamType] = useState("annual");
  const [session, setSession] = useState("2025-2026");
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);

  const filteredStudents = sampleStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
  );

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    // Reset marks when selecting new student
    setSubjects(defaultSubjects);
  };

  const updateMarks = (index: number, marks: number) => {
    setSubjects((prev) =>
      prev.map((subject, i) =>
        i === index ? { ...subject, obtainedMarks: Math.min(marks, subject.maxMarks) } : subject
      )
    );
  };

  const totalMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const obtainedMarks = subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
  const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : "0";

  const getGrade = (percent: number) => {
    if (percent >= 90) return { grade: "A+", label: "Outstanding" };
    if (percent >= 80) return { grade: "A", label: "Excellent" };
    if (percent >= 70) return { grade: "B", label: "Very Good" };
    if (percent >= 60) return { grade: "C", label: "Good" };
    if (percent >= 50) return { grade: "D", label: "Satisfactory" };
    if (percent >= 33) return { grade: "E", label: "Pass" };
    return { grade: "F", label: "Fail" };
  };

  const gradeInfo = getGrade(parseFloat(percentage));

  const handleGenerate = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    alert("Result Card Generated Successfully!");
  };

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

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.class} - {student.section} | Roll: {student.rollNo}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Exam Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
          <h3 className="font-semibold text-gray-900 mb-4">Exam Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="1st_term">First Term</option>
                <option value="mid_term">Mid Term</option>
                <option value="2nd_term">Second Term</option>
                <option value="annual">Annual Exam</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card Form */}
      <div className="lg:col-span-2">
        {selectedStudent ? (
          <div className="space-y-6">
            {/* Student Info Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  <GraduationCap size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-500">S/o {selectedStudent.fatherName}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Class</p>
                  <p className="font-semibold text-gray-900">{selectedStudent.class} - {selectedStudent.section}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Roll No</p>
                  <p className="font-semibold text-gray-900">{selectedStudent.rollNo}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Session</p>
                  <p className="font-semibold text-gray-900">{session}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Exam</p>
                  <p className="font-semibold text-gray-900">{examType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                </div>
              </div>
            </div>

            {/* Marks Entry */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Subject-wise Marks</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Subject</th>
                    <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Max Marks</th>
                    <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Obtained Marks</th>
                    <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subjects.map((subject, index) => {
                    const isPassing = subject.obtainedMarks >= subject.maxMarks * 0.33;
                    return (
                      <tr key={subject.name} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{subject.name}</td>
                        <td className="px-6 py-3 text-center text-gray-700">{subject.maxMarks}</td>
                        <td className="px-6 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={subject.maxMarks}
                            value={subject.obtainedMarks}
                            onChange={(e) => updateMarks(index, parseInt(e.target.value) || 0)}
                            className="w-20 px-3 py-1 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isPassing ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isPassing ? "Pass" : "Fail"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td className="px-6 py-3 font-bold text-gray-900">Total</td>
                    <td className="px-6 py-3 text-center font-bold text-gray-900">{totalMarks}</td>
                    <td className="px-6 py-3 text-center font-bold text-gray-900">{obtainedMarks}</td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          gradeInfo.grade !== "F" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Result Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Result Summary</h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-gray-500 text-sm">Grade: </span>
                      <span className="text-2xl font-bold text-gray-900">{gradeInfo.grade}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Remarks: </span>
                      <span className="font-semibold text-gray-900">{gradeInfo.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Percentage: </span>
                      <span className="font-semibold text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                    gradeInfo.grade !== "F" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {gradeInfo.grade !== "F" ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                {isGenerating ? "Generating..." : "Generate Result Card"}
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
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Student</h3>
            <p className="text-gray-500">Search and select a student to generate result card</p>
          </div>
        )}
      </div>
    </div>
  );
}

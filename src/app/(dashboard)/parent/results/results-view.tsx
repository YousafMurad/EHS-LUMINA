// Results View Component - Client component for viewing exam results
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  Award,
  BookOpen,
  User,
  AlertCircle,
} from "lucide-react";

interface StudentData {
  id: string;
  registration_no: string;
  name: string;
  photo_url: string | null;
  classes: { id: string; name: string } | null;
  sections: { id: string; name: string } | null;
}

interface Child {
  id: string;
  students: StudentData | StudentData[] | null;
}

interface Session {
  id: string;
  name: string;
  is_current: boolean;
}

interface Result {
  id: string;
  total_marks: number;
  obtained_marks: number;
  grade: string | null;
  remarks: string | null;
  is_absent: boolean;
  created_at: string;
  sessions: { id: string; name: string } | null;
  exam_types: { id: string; name: string; code: string } | null;
  subjects: { id: string; name: string; code: string } | null;
  classes: { id: string; name: string } | null;
}

interface ResultsViewProps {
  childrenData: Child[];
  sessions: Session[];
  results: Result[] | null;
  selectedStudentId: string | null;
  selectedSessionId?: string;
}

// Helper to normalize student data
function getStudent(students: StudentData | StudentData[] | null): StudentData | null {
  if (!students) return null;
  if (Array.isArray(students)) return students[0] || null;
  return students;
}

export function ResultsView({ 
  childrenData, 
  sessions, 
  results, 
  selectedStudentId,
  selectedSessionId,
}: ResultsViewProps) {
  const router = useRouter();
  const [sessionFilter, setSessionFilter] = useState(selectedSessionId || "all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");

  const handleStudentChange = (studentId: string) => {
    router.push(`/parent/results?studentId=${studentId}`);
  };

  const selectedChild = childrenData.find((c) => {
    const student = getStudent(c.students);
    return student?.id === selectedStudentId;
  });

  // Get unique exam types from results
  const examTypes = useMemo(() => {
    if (!results) return [];
    const types = new Map();
    results.forEach(r => {
      if (r.exam_types) {
        types.set(r.exam_types.id, r.exam_types);
      }
    });
    return Array.from(types.values());
  }, [results]);

  // Filter results
  const filteredResults = useMemo(() => {
    if (!results) return [];
    let filtered = results;
    
    if (sessionFilter !== "all") {
      filtered = filtered.filter(r => r.sessions?.id === sessionFilter);
    }
    if (examTypeFilter !== "all") {
      filtered = filtered.filter(r => r.exam_types?.id === examTypeFilter);
    }
    
    return filtered;
  }, [results, sessionFilter, examTypeFilter]);

  // Group results by exam type
  const groupedResults = useMemo(() => {
    const grouped: Record<string, Result[]> = {};
    filteredResults.forEach(result => {
      const key = result.exam_types?.name || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(result);
    });
    return grouped;
  }, [filteredResults]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    if (filteredResults.length === 0) return null;
    
    const totalMarks = filteredResults.reduce((sum, r) => sum + r.total_marks, 0);
    const obtainedMarks = filteredResults.reduce((sum, r) => sum + (r.is_absent ? 0 : r.obtained_marks), 0);
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    
    return {
      totalSubjects: filteredResults.length,
      totalMarks,
      obtainedMarks,
      percentage,
      absences: filteredResults.filter(r => r.is_absent).length,
    };
  }, [filteredResults]);

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-gray-100 text-gray-600";
    switch (grade.toUpperCase()) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-700";
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-700";
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-700";
      case "D":
        return "bg-orange-100 text-orange-700";
      case "F":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (childrenData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No children linked to your account.</p>
      </div>
    );
  }

  const selectedStudent = selectedChild ? getStudent(selectedChild.students) : null;

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      {childrenData.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Child
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {childrenData.map((child) => {
              const student = getStudent(child.students);
              if (!student) return null;
              return (
                <button
                  key={student.id}
                  onClick={() => handleStudentChange(student.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedStudentId === student.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.classes?.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Student Info */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {selectedStudent.photo_url ? (
              <Image
                src={selectedStudent.photo_url}
                alt={selectedStudent.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.name?.charAt(0) || "S"}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedStudent.classes?.name} - {selectedStudent.sections?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session
            </label>
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Sessions</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} {session.is_current && "(Current)"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type
            </label>
            <select
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Exam Types</option>
              {examTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      {overallStats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm text-purple-100">Subjects</p>
            <p className="text-2xl font-bold">{overallStats.totalSubjects}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm text-blue-100">Total Marks</p>
            <p className="text-2xl font-bold">{overallStats.totalMarks}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm text-green-100">Obtained</p>
            <p className="text-2xl font-bold">{overallStats.obtainedMarks}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <p className="text-sm text-amber-100">Percentage</p>
            <p className="text-2xl font-bold">{overallStats.percentage}%</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
            <p className="text-sm text-red-100">Absences</p>
            <p className="text-2xl font-bold">{overallStats.absences}</p>
          </div>
        </div>
      )}

      {/* Results by Exam Type */}
      {Object.keys(groupedResults).length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No results found for the selected filters.</p>
        </div>
      ) : (
        Object.entries(groupedResults).map(([examType, examResults]) => {
          const examTotal = examResults.reduce((sum, r) => sum + r.total_marks, 0);
          const examObtained = examResults.reduce((sum, r) => sum + (r.is_absent ? 0 : r.obtained_marks), 0);
          const examPercentage = examTotal > 0 ? Math.round((examObtained / examTotal) * 100) : 0;

          return (
            <div key={examType} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{examType}</h3>
                    <p className="text-sm text-gray-500">
                      {examResults.length} subject{examResults.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getPercentageColor(examPercentage)}`}>
                    {examPercentage}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {examObtained}/{examTotal}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {examResults.map((result) => {
                  const percentage = result.total_marks > 0 
                    ? Math.round((result.obtained_marks / result.total_marks) * 100) 
                    : 0;

                  return (
                    <div key={result.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {result.subjects?.name || "Unknown Subject"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {result.subjects?.code}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {result.is_absent ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={18} />
                            <span className="font-medium">Absent</span>
                          </div>
                        ) : (
                          <>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Marks</p>
                              <p className="font-semibold text-gray-900">
                                {result.obtained_marks}/{result.total_marks}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Percentage</p>
                              <p className={`font-semibold ${getPercentageColor(percentage)}`}>
                                {percentage}%
                              </p>
                            </div>
                          </>
                        )}
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getGradeColor(result.grade)}`}>
                          {result.grade || "N/A"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

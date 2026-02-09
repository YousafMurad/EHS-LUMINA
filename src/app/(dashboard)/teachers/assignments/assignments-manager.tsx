// Assignments Manager Component - Manage teacher-class assignments
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Trash2,
  Loader2,
  Search,
  CheckCircle,
  Star,
  X,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string | null;
  employee_code: string | null;
}

interface Class {
  id: string;
  name: string;
  grade_level: number;
}

interface Section {
  id: string;
  name: string;
  class_id: string;
  capacity: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Assignment {
  id: string;
  teacher_id: string;
  class_id: string;
  section_id: string | null;
  subject_id: string | null;
  is_class_teacher: boolean;
  created_at: string;
  classes: { id: string; name: string } | null;
  sections: { id: string; name: string } | null;
  subjects: { id: string; name: string; code: string } | null;
}

interface AssignmentsManagerProps {
  teachers: Teacher[];
  classes: Class[];
  sections: Section[];
  subjects: Subject[];
  assignments: Assignment[];
}

export function AssignmentsManager({
  teachers,
  classes,
  sections,
  subjects,
  assignments,
}: AssignmentsManagerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    isClassTeacher: false,
  });

  // Filter sections by selected class
  const filteredSections = useMemo(() => {
    if (!formData.classId) return [];
    return sections.filter((s) => s.class_id === formData.classId);
  }, [formData.classId, sections]);

  // Group assignments by teacher
  const teacherAssignments = useMemo(() => {
    const grouped: Record<string, Assignment[]> = {};
    assignments.forEach((a) => {
      if (!grouped[a.teacher_id]) grouped[a.teacher_id] = [];
      grouped[a.teacher_id].push(a);
    });
    return grouped;
  }, [assignments]);

  // Filter teachers by search
  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter((t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/teachers/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: formData.teacherId,
          classId: formData.classId,
          sectionId: formData.sectionId || null,
          subjectId: formData.subjectId || null,
          isClassTeacher: formData.isClassTeacher,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Assignment created successfully!");
        setFormData({
          teacherId: "",
          classId: "",
          sectionId: "",
          subjectId: "",
          isClassTeacher: false,
        });
        setShowModal(false);
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to create assignment");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;
    
    setDeletingId(assignmentId);
    try {
      const response = await fetch(`/api/teachers/assignments?id=${assignmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Assignment removed successfully!");
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to remove assignment");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const teacherAssigns = teacherAssignments[teacher.id] || [];
          const isSelected = selectedTeacher === teacher.id;

          return (
            <div
              key={teacher.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setSelectedTeacher(isSelected ? null : teacher.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                    {teacher.name?.charAt(0) || "T"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {teacher.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {teacher.employee_code || "No ID"}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {teacherAssigns.length}
                  </span>
                </div>
              </div>

              {/* Assignments List */}
              {isSelected && teacherAssigns.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2 max-h-64 overflow-y-auto">
                  {teacherAssigns.map((assign) => (
                    <div
                      key={assign.id}
                      className="bg-white p-3 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {assign.is_class_teacher && (
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {assign.classes?.name}
                            {assign.sections && ` - ${assign.sections.name}`}
                          </p>
                          {assign.subjects && (
                            <p className="text-xs text-gray-500">
                              {assign.subjects.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(assign.id);
                        }}
                        disabled={deletingId === assign.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        {deletingId === assign.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isSelected && teacherAssigns.length === 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-500">No assignments yet</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No teachers found.</p>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">New Assignment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher *
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.employee_code || "No ID"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value, sectionId: "" })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section (Optional)
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.classId}
                >
                  <option value="">All Sections</option>
                  {filteredSections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isClassTeacher}
                  onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Assign as Class Teacher
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Assignment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

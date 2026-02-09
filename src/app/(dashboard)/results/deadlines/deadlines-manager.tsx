// Deadlines Manager Component - Manage result submission windows
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  X,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

interface ExamType {
  id: string;
  name: string;
  code: string;
  total_marks: number;
}

interface Class {
  id: string;
  name: string;
  numeric_name: number;
}

interface Session {
  id: string;
  name: string;
  is_current: boolean;
}

interface Deadline {
  id: string;
  session_id: string;
  class_id: string;
  exam_type_id: string;
  start_date: string;
  end_date: string;
  is_open: boolean;
  created_at: string;
  sessions: { id: string; name: string } | null;
  classes: { id: string; name: string } | null;
  exam_types: { id: string; name: string; code: string } | null;
}

interface DeadlinesManagerProps {
  examTypes: ExamType[];
  classes: Class[];
  sessions: Session[];
  currentSession: Session | null;
  deadlines: Deadline[];
}

export function DeadlinesManager({
  examTypes,
  classes,
  sessions,
  currentSession,
  deadlines,
}: DeadlinesManagerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterSession, setFilterSession] = useState(currentSession?.id || "all");
  const [filterClass, setFilterClass] = useState("all");

  const [formData, setFormData] = useState({
    sessionId: currentSession?.id || "",
    classId: "",
    examTypeId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isOpen: true,
  });

  // Filter deadlines
  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      if (filterSession !== "all" && d.session_id !== filterSession) return false;
      if (filterClass !== "all" && d.class_id !== filterClass) return false;
      return true;
    });
  }, [deadlines, filterSession, filterClass]);

  // Check if deadline is active
  const isDeadlineActive = (deadline: Deadline) => {
    if (!deadline.is_open) return false;
    const now = new Date();
    const start = new Date(deadline.start_date);
    const end = new Date(deadline.end_date);
    return now >= start && now <= end;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/results/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Deadline created successfully!");
        setFormData({
          sessionId: currentSession?.id || "",
          classId: "",
          examTypeId: "",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          isOpen: true,
        });
        setShowModal(false);
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to create deadline");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (deadline: Deadline) => {
    setTogglingId(deadline.id);
    try {
      const response = await fetch("/api/results/deadlines/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deadline.id,
          isOpen: !deadline.is_open,
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Deadline ${deadline.is_open ? "closed" : "opened"} successfully!`);
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to toggle deadline");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (deadlineId: string) => {
    if (!confirm("Are you sure you want to delete this deadline?")) return;
    
    setDeletingId(deadlineId);
    try {
      const response = await fetch(`/api/results/deadlines?id=${deadlineId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Deadline deleted successfully!");
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to delete deadline");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (deadline: Deadline) => {
    const now = new Date();
    const start = new Date(deadline.start_date);
    const end = new Date(deadline.end_date);

    if (!deadline.is_open) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium flex items-center gap-1">
          <Pause size={12} />
          Closed
        </span>
      );
    }

    if (now < start) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Upcoming
        </span>
      );
    }

    if (now > end) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium flex items-center gap-1">
          <XCircle size={12} />
          Expired
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium flex items-center gap-1">
        <Play size={12} />
        Active
      </span>
    );
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

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Sessions</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.is_current && "(Current)"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Create Deadline
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">How Deadlines Work</h4>
            <p className="text-sm text-blue-700 mt-1">
              Teachers can only submit results for a class/exam when the deadline is open and within the date range.
              You can manually open or close deadlines at any time using the toggle button.
            </p>
          </div>
        </div>
      </div>

      {/* Deadlines Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Exam Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Class
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Session
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Date Range
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDeadlines.map((deadline) => (
                <tr key={deadline.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {deadline.exam_types?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {deadline.exam_types?.code}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{deadline.classes?.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{deadline.sessions?.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {new Date(deadline.start_date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        to {new Date(deadline.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(deadline)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(deadline)}
                        disabled={togglingId === deadline.id}
                        className={`p-2 rounded-lg transition-colors ${
                          deadline.is_open
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        } disabled:opacity-50`}
                        title={deadline.is_open ? "Close deadline" : "Open deadline"}
                      >
                        {togglingId === deadline.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : deadline.is_open ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(deadline.id)}
                        disabled={deletingId === deadline.id}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                        title="Delete deadline"
                      >
                        {deletingId === deadline.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeadlines.length === 0 && (
          <div className="p-8 text-center">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No deadlines found.</p>
            <p className="text-sm text-gray-400 mt-1">
              Create a deadline to allow teachers to submit results.
            </p>
          </div>
        )}
      </div>

      {/* Create Deadline Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Create Result Deadline</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session *
                  </label>
                  <select
                    value={formData.sessionId}
                    onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select session</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.is_current && "(Current)"}
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
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  value={formData.examTypeId}
                  onChange={(e) => setFormData({ ...formData, examTypeId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select exam type</option>
                  {examTypes.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.code}) - {e.total_marks} marks
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Open for submissions immediately
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
                      Create Deadline
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

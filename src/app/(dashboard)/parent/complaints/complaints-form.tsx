// Complaints Form Component - Submit and view feedback
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Child {
  id: string;
  students: {
    id: string;
    registration_no: string;
    name: string;
    classes: { id: string; name: string } | null;
  };
}

interface Complaint {
  id: string;
  type: "suggestion" | "complaint";
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  response: string | null;
  responded_at: string | null;
  responded_by: string | null;
  created_at: string;
  students: { id: string; name: string } | null;
}

interface ComplaintsFormProps {
  childrenData: Child[];
  complaints: Complaint[];
  defaultStudentId?: string;
  parentId: string;
}

export function ComplaintsForm({ 
  childrenData, 
  complaints, 
  defaultStudentId,
  parentId,
}: ComplaintsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Helper to normalize student data
  const getStudent = (students: unknown): { id: string } | null => {
    if (!students) return null;
    if (Array.isArray(students)) return students[0] || null;
    return students as { id: string };
  };

  const firstStudent = childrenData[0] ? getStudent(childrenData[0].students) : null;
  const [formData, setFormData] = useState({
    type: "suggestion" as "suggestion" | "complaint",
    studentId: defaultStudentId || firstStudent?.id || "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          studentId: formData.studentId,
          subject: formData.subject,
          message: formData.message,
          parentId,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Feedback submitted successfully!");
        setFormData({
          ...formData,
          subject: "",
          message: "",
        });
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to submit feedback");
      }
    } catch {
      setErrorMessage("An error occurred while submitting feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "in_progress":
        return <AlertCircle size={14} />;
      case "resolved":
        return <CheckCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "suggestion") {
      return <Lightbulb size={18} className="text-blue-600" />;
    }
    return <AlertCircle size={18} className="text-amber-600" />;
  };

  if (childrenData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No children linked to your account.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Submit Form */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-green-600" />
            Submit Feedback
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Share your suggestions or concerns with the school
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "suggestion" })}
                className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                  formData.type === "suggestion"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Lightbulb size={18} />
                <span className="font-medium">Suggestion</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "complaint" })}
                className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                  formData.type === "complaint"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <AlertCircle size={18} />
                <span className="font-medium">Complaint</span>
              </button>
            </div>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regarding Student
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a student</option>
              {childrenData.map((child) => {
                const student = getStudent(child.students) as { id: string; name?: string; classes?: { name: string } | null } | null;
                if (!student) return null;
                return (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.classes?.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief subject of your feedback"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={5}
              placeholder="Describe your suggestion or concern in detail..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      {/* Previous Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-purple-600" />
            Previous Feedback
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track the status of your submitted feedback
          </p>
        </div>

        {complaints.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-4">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      complaint.type === "suggestion" ? "bg-blue-100" : "bg-amber-100"
                    }`}>
                      {getTypeIcon(complaint.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{complaint.subject}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={12} />
                        {new Date(complaint.created_at).toLocaleDateString()}
                        {complaint.students && (
                          <span>• {complaint.students.name}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status.replace("_", " ")}
                    </span>
                    {expandedId === complaint.id ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedId === complaint.id && (
                  <div className="mt-4 pl-13 space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{complaint.message}</p>
                    </div>

                    {complaint.response && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">School Response:</p>
                        <p className="text-sm text-green-800">{complaint.response}</p>
                        {complaint.responded_at && (
                          <p className="text-xs text-green-600 mt-2">
                            Responded on {new Date(complaint.responded_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

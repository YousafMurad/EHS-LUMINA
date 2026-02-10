// Feedback Manager Component - View and respond to feedback
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Lightbulb,
  AlertCircle,
  Clock,
  CheckCircle,
  Send,
  Loader2,
  Filter,
  X,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Student {
  id: string;
  name: string;
  registration_no: string;
  classes: { id: string; name: string } | null;
}

interface Feedback {
  id: string;
  type: "suggestion" | "complaint";
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  response: string | null;
  responded_at: string | null;
  responded_by: string | null;
  created_at: string;
  parent: Parent | null;
  student: Student | null;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  suggestions: number;
  complaints: number;
}

interface FeedbackManagerProps {
  feedback: Feedback[];
  stats: Stats;
  currentStatus: string;
}

export function FeedbackManager({ feedback, stats, currentStatus }: FeedbackManagerProps) {
  const router = useRouter();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusFilter = (status: string) => {
    router.push(`/feedback${status !== "all" ? `?status=${status}` : ""}`);
  };

  const handleRespond = async () => {
    if (!selectedFeedback || !responseText.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/feedback/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId: selectedFeedback.id,
          response: responseText,
          status: newStatus || "resolved",
        }),
      });

      if (response.ok) {
        setSuccessMessage("Response submitted successfully!");
        setSelectedFeedback(null);
        setResponseText("");
        setNewStatus("");
        router.refresh();
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to submit response");
      }
    } catch {
      setErrorMessage("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, status: string) => {
    try {
      const response = await fetch("/api/feedback/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId,
          status,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch {
      setErrorMessage("Failed to update status");
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
      case "closed":
        return <XCircle size={14} />;
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <button
          onClick={() => handleStatusFilter("all")}
          className={`p-4 rounded-xl border transition-all ${
            currentStatus === "all"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-80">Total</p>
        </button>
        <button
          onClick={() => handleStatusFilter("pending")}
          className={`p-4 rounded-xl border transition-all ${
            currentStatus === "pending"
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-white border-gray-200 hover:border-yellow-300"
          }`}
        >
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm opacity-80">Pending</p>
        </button>
        <button
          onClick={() => handleStatusFilter("in_progress")}
          className={`p-4 rounded-xl border transition-all ${
            currentStatus === "in_progress"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white border-gray-200 hover:border-blue-300"
          }`}
        >
          <p className="text-2xl font-bold">{stats.inProgress}</p>
          <p className="text-sm opacity-80">In Progress</p>
        </button>
        <button
          onClick={() => handleStatusFilter("resolved")}
          className={`p-4 rounded-xl border transition-all ${
            currentStatus === "resolved"
              ? "bg-green-500 text-white border-green-500"
              : "bg-white border-gray-200 hover:border-green-300"
          }`}
        >
          <p className="text-2xl font-bold">{stats.resolved}</p>
          <p className="text-sm opacity-80">Resolved</p>
        </button>
        <div className="p-4 rounded-xl border border-gray-200 bg-blue-50">
          <p className="text-2xl font-bold text-blue-700">{stats.suggestions}</p>
          <p className="text-sm text-blue-600">Suggestions</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-amber-50">
          <p className="text-2xl font-bold text-amber-700">{stats.complaints}</p>
          <p className="text-sm text-amber-600">Complaints</p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {feedback.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No feedback found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {feedback.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === "suggestion" ? "bg-blue-100" : "bg-amber-100"
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900">{item.subject}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {(item.parent as any)?.name || "Unknown"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {item.student && (
                          <>
                            <span>•</span>
                            <span>Re: {(item.student as any)?.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {item.status !== "resolved" && item.status !== "closed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedback(item);
                          setNewStatus(item.status === "pending" ? "in_progress" : "resolved");
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Respond
                      </button>
                    )}
                    {expandedId === item.id ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="mt-4 pl-13 space-y-4">
                    {/* Parent Info */}
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{(item.parent as any)?.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {(item.parent as any)?.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} />
                              {(item.parent as any)?.email}
                            </span>
                          )}
                          {(item.parent as any)?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {(item.parent as any)?.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.student && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">{(item.student as any)?.name}</p>
                          <p className="text-xs text-gray-500">
                            {(item.student as any)?.classes?.name} • {(item.student as any)?.registration_no}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{item.message}</p>
                    </div>

                    {/* Response */}
                    {item.response && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-600 mb-2">Response</p>
                        <p className="text-green-800 whitespace-pre-wrap">{item.response}</p>
                        {item.responded_at && (
                          <p className="text-xs text-green-600 mt-2">
                            Responded on {new Date(item.responded_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quick Status Update */}
                    {item.status !== "resolved" && item.status !== "closed" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Quick Update:</span>
                        {item.status === "pending" && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, "in_progress")}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(item.id, "resolved")}
                          className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.id, "closed")}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Respond to Feedback</h3>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setResponseText("");
                  setNewStatus("");
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Original Message */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {selectedFeedback.subject}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedFeedback.message}</p>
              </div>

              {/* Response */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your response here..."
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["in_progress", "resolved", "closed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewStatus(status)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        newStatus === status
                          ? status === "resolved"
                            ? "bg-green-100 border-green-500 text-green-700"
                            : status === "in_progress"
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "bg-gray-100 border-gray-500 text-gray-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFeedback(null);
                    setResponseText("");
                    setNewStatus("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRespond}
                  disabled={isSubmitting || !responseText.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

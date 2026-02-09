// Bulk Promotion Form - Client Component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle, Users } from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  nextClassId?: string;
}

interface SessionOption {
  id: string;
  name: string;
  isActive: boolean;
}

interface BulkPromotionFormProps {
  classOptions: ClassOption[];
  sessionOptions: SessionOption[];
}

export function BulkPromotionForm({ classOptions, sessionOptions }: BulkPromotionFormProps) {
  const router = useRouter();
  const [fromClassId, setFromClassId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [sessionId, setSessionId] = useState(
    sessionOptions.find((s) => s.isActive)?.id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Auto-select next class when from class is selected
  const handleFromClassChange = (classId: string) => {
    setFromClassId(classId);
    const selectedClass = classOptions.find((c) => c.id === classId);
    if (selectedClass?.nextClassId) {
      setToClassId(selectedClass.nextClassId);
    } else {
      setToClassId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/promotions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_class_id: fromClassId,
          to_class_id: toClassId,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully promoted ${data.count} students.`,
        });
        setTimeout(() => {
          router.push("/promotions/history");
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to promote students.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fromClass = classOptions.find((c) => c.id === fromClassId);
  const toClass = classOptions.find((c) => c.id === toClassId);

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Session</h3>
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          >
            <option value="">Select Session</option>
            {sessionOptions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} {session.isActive && "(Current)"}
              </option>
            ))}
          </select>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Selection</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Class
              </label>
              <select
                value={fromClassId}
                onChange={(e) => handleFromClassChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Class</option>
                {classOptions.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <ArrowRight size={24} className="text-yellow-600" />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Class
              </label>
              <select
                value={toClassId}
                onChange={(e) => setToClassId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Class</option>
                {classOptions.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        {fromClass && toClass && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-start gap-3">
              <Users size={24} className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900">Promotion Preview</h3>
                <p className="text-blue-700 mt-1">
                  All active students from <strong>{fromClass.name}</strong> will be 
                  promoted to <strong>{toClass.name}</strong>.
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  This action cannot be undone. Please review carefully before proceeding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className={`rounded-xl border p-4 flex items-start gap-3 ${
            result.success 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            {result.success ? (
              <CheckCircle size={20} className="text-green-600 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
            )}
            <p className={result.success ? "text-green-800" : "text-red-800"}>
              {result.message}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !fromClassId || !toClassId || !sessionId}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Processing..." : "Promote Students"}
          </button>
        </div>
      </form>
    </div>
  );
}

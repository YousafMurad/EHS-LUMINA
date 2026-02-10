// Session Form Component - Create/Edit academic session
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Save, X } from "lucide-react";
import { createSession, updateSession } from "@/server/actions/sessions";

interface SessionFormProps {
  session?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
  };
}

export function SessionForm({ session }: SessionFormProps) {
  const router = useRouter();
  const isEditing = !!session;

  const [formData, setFormData] = useState({
    name: session?.name || "",
    start_date: session?.start_date || "",
    end_date: session?.end_date || "",
    is_active: session?.is_active || false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = isEditing
        ? await updateSession(session.id, formData)
        : await createSession(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/sessions");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Generate suggested name based on dates
  const generateName = () => {
    if (formData.start_date && formData.end_date) {
      const startYear = new Date(formData.start_date).getFullYear();
      const endYear = new Date(formData.end_date).getFullYear();
      setFormData((prev) => ({
        ...prev,
        name: `${startYear}-${endYear}`,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {isEditing ? "Edit Session" : "Session Details"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? "Update academic session information" : "Enter the academic year details"}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          {/* Session Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Name <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., 2025-2026"
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={generateName}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Auto Generate
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
            />
            <label htmlFor="is_active" className="cursor-pointer">
              <span className="font-medium text-gray-900">Set as Active Session</span>
              <p className="text-sm text-gray-500">
                This will be the default session for new admissions
              </p>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 font-medium text-sm transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? "Saving..." : isEditing ? "Update Session" : "Create Session"}
          </button>
        </div>
      </div>
    </form>
  );
}

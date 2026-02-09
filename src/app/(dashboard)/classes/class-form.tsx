// Class Form Component - Create/Edit class
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Save, X } from "lucide-react";
import { createClass, updateClass } from "@/server/actions/classes";

interface ClassFormProps {
  classItem?: {
    id: string;
    name: string;
    grade_level: number;
    description?: string;
    is_active: boolean;
  };
}

export function ClassForm({ classItem }: ClassFormProps) {
  const router = useRouter();
  const isEditing = !!classItem;

  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    grade_level: classItem?.grade_level || 1,
    description: classItem?.description || "",
    is_active: classItem?.is_active ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = isEditing
        ? await updateClass(classItem.id, formData)
        : await createClass(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/classes");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Predefined class options
  const classOptions = [
    { name: "Nursery", grade: 0 },
    { name: "Prep", grade: 1 },
    { name: "Class 1", grade: 2 },
    { name: "Class 2", grade: 3 },
    { name: "Class 3", grade: 4 },
    { name: "Class 4", grade: 5 },
    { name: "Class 5", grade: 6 },
    { name: "Class 6", grade: 7 },
    { name: "Class 7", grade: 8 },
    { name: "Class 8", grade: 9 },
    { name: "Class 9", grade: 10 },
    { name: "Class 10", grade: 11 },
    { name: "Class 11", grade: 12 },
    { name: "Class 12", grade: 13 },
  ];

  const selectPreset = (preset: { name: string; grade: number }) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      grade_level: preset.grade,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {isEditing ? "Edit Class" : "Class Details"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? "Update class information" : "Enter the class details"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Preset Selection */}
        {!isEditing && (
          <div className="px-6 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="flex flex-wrap gap-2">
              {classOptions.slice(0, 8).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    formData.name === preset.name
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Class 5"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="grade_level"
              value={formData.grade_level}
              onChange={handleChange}
              min={0}
              max={20}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Used for sorting and promotions (0 = Nursery, 1 = Prep, etc.)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description for this class..."
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
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
              <span className="font-medium text-gray-900">Active Class</span>
              <p className="text-sm text-gray-500">
                Inactive classes won&apos;t appear in selection dropdowns
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
            {isLoading ? "Saving..." : isEditing ? "Update Class" : "Create Class"}
          </button>
        </div>
      </div>
    </form>
  );
}

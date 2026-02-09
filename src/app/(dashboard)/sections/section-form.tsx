// Section Form Component - Create/Edit section
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Save, X } from "lucide-react";
import { createSection, updateSection } from "@/server/actions/sections";

interface ClassOption {
  id: string;
  name: string;
}

interface TeacherOption {
  id: string;
  name: string;
}

interface SectionFormProps {
  section?: {
    id: string;
    name: string;
    class_id: string;
    capacity?: number;
    teacher_id?: string;
    is_active: boolean;
  };
  classes: ClassOption[];
  teachers: TeacherOption[];
}

export function SectionForm({ section, classes, teachers }: SectionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = !!section;

  // Get class_id from URL if provided
  const urlClassId = searchParams.get("class_id");

  const [formData, setFormData] = useState({
    name: section?.name || "",
    class_id: section?.class_id || urlClassId || "",
    capacity: section?.capacity || "",
    teacher_id: section?.teacher_id || "",
    is_active: section?.is_active ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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

    const submitData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity as string) : undefined,
      teacher_id: formData.teacher_id || undefined,
    };

    try {
      const result = isEditing
        ? await updateSection(section.id, submitData)
        : await createSection(submitData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/sections");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Section name suggestions
  const sectionNames = ["A", "B", "C", "D", "E", "F", "Morning", "Evening", "Boys", "Girls"];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {isEditing ? "Edit Section" : "Section Details"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? "Update section information" : "Enter the section details"}
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
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Name <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {sectionNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, name }))}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      formData.name === name
                        ? "bg-green-100 border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Or enter custom name"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Capacity & Teacher Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
                placeholder="e.g., 40"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty for unlimited</p>
            </div>

            {/* Class Teacher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Teacher
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select teacher (optional)</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
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
              <span className="font-medium text-gray-900">Active Section</span>
              <p className="text-sm text-gray-500">
                Inactive sections won&apos;t appear in selection dropdowns
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
            {isLoading ? "Saving..." : isEditing ? "Update Section" : "Create Section"}
          </button>
        </div>
      </div>
    </form>
  );
}

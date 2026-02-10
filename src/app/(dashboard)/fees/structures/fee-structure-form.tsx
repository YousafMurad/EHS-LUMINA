// Fee Structure Form Component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, X, DollarSign } from "lucide-react";
import { createFeeStructure } from "@/server/actions/fees";

interface ClassOption {
  id: string;
  name: string;
}

interface SessionOption {
  id: string;
  name: string;
  is_active: boolean;
}

interface FeeStructureFormProps {
  structure?: {
    id: string;
    name: string;
    class_id: string;
    session_id: string;
    monthly_fee: number;
    admission_fee: number;
    security_fee: number;
    registration_fee: number;
    miscellaneous_fee?: number;
    board_registration_fee?: number;
    board_admission_fee?: number;
  };
  classes: ClassOption[];
  sessions: SessionOption[];
}

export function FeeStructureForm({ structure, classes, sessions }: FeeStructureFormProps) {
  const router = useRouter();
  const isEditing = !!structure;

  // Find active session
  const activeSession = sessions.find((s) => s.is_active);

  const [formData, setFormData] = useState({
    name: structure?.name || "",
    class_id: structure?.class_id || "",
    session_id: structure?.session_id || activeSession?.id || "",
    monthly_fee: structure?.monthly_fee?.toString() || "",
    admission_fee: structure?.admission_fee?.toString() || "",
    security_fee: structure?.security_fee?.toString() || "",
    registration_fee: structure?.registration_fee?.toString() || "",
    miscellaneous_fee: structure?.miscellaneous_fee?.toString() || "",
    board_registration_fee: structure?.board_registration_fee?.toString() || "",
    board_admission_fee: structure?.board_admission_fee?.toString() || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Calculate total
  const calculateTotal = () => {
    return (
      (parseFloat(formData.monthly_fee) || 0) +
      (parseFloat(formData.admission_fee) || 0) +
      (parseFloat(formData.security_fee) || 0) +
      (parseFloat(formData.registration_fee) || 0) +
      (parseFloat(formData.miscellaneous_fee) || 0)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const submitData = {
      name: formData.name || `Fee Structure - ${classes.find((c) => c.id === formData.class_id)?.name}`,
      class_id: formData.class_id,
      session_id: formData.session_id,
      monthly_fee: parseFloat(formData.monthly_fee) || 0,
      admission_fee: parseFloat(formData.admission_fee) || 0,
      security_fee: parseFloat(formData.security_fee) || 0,
      registration_fee: parseFloat(formData.registration_fee) || 0,
      miscellaneous_fee: parseFloat(formData.miscellaneous_fee) || undefined,
      board_registration_fee: parseFloat(formData.board_registration_fee) || undefined,
      board_admission_fee: parseFloat(formData.board_admission_fee) || undefined,
    };

    try {
      const result = await createFeeStructure(submitData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/fees/structures");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">Select class and session</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Name (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Structure Name (Optional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Regular Fee Structure"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Class & Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session <span className="text-red-500">*</span>
                </label>
                <select
                  name="session_id"
                  value={formData.session_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} {session.is_active ? "(Active)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Amounts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Fee Amounts</h2>
                <p className="text-sm text-gray-500">Configure monthly and one-time fees</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Monthly Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Fee <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                <input
                  type="number"
                  name="monthly_fee"
                  value={formData.monthly_fee}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            {/* One-time Fees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="admission_fee"
                    value={formData.admission_fee}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="security_fee"
                    value={formData.security_fee}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="registration_fee"
                    value={formData.registration_fee}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miscellaneous Fee
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="miscellaneous_fee"
                    value={formData.miscellaneous_fee}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Board Fees (Optional - for matric/inter classes) */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Board Fees (Optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Board Registration Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="board_registration_fee"
                      value={formData.board_registration_fee}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Board Admission Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="board_admission_fee"
                      value={formData.board_admission_fee}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4">Fee Summary</h3>
          <div className="space-y-2 text-blue-100">
            <div className="flex justify-between">
              <span>Monthly Fee</span>
              <span>{formatCurrency(formData.monthly_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Admission Fee</span>
              <span>{formatCurrency(formData.admission_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Fee</span>
              <span>{formatCurrency(formData.security_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Registration Fee</span>
              <span>{formatCurrency(formData.registration_fee)}</span>
            </div>
            {formData.miscellaneous_fee && (
              <div className="flex justify-between">
                <span>Miscellaneous</span>
                <span>{formatCurrency(formData.miscellaneous_fee)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-700 flex justify-between items-center">
            <span className="font-medium">Total (First Month)</span>
            <span className="text-2xl font-bold">{formatCurrency(calculateTotal().toString())}</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3">
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
            {isLoading ? "Saving..." : isEditing ? "Update Structure" : "Create Structure"}
          </button>
        </div>
      </div>
    </form>
  );
}

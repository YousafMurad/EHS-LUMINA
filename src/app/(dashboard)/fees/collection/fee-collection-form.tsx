// Fee Collection Form Component
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, CreditCard, DollarSign, FileText, Save, X, User } from "lucide-react";
import { collectFee } from "@/server/actions/fees";

interface StudentResult {
  id: string;
  name: string;
  registration_no: string;
  father_name: string;
  class_name: string;
  section_name: string;
  photo_url?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "bank", label: "Bank Transfer", icon: "🏦" },
  { value: "online", label: "Online Payment", icon: "📱" },
];

export function FeeCollectionForm() {
  const router = useRouter();
  const currentDate = new Date();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "cash",
    fee_month: (currentDate.getMonth() + 1).toString(),
    fee_year: currentDate.getFullYear().toString(),
    remarks: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ receipt_no: string } | null>(null);

  // Search students
  const searchStudents = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.students || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) searchStudents(searchQuery);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectStudent = (student: StudentResult) => {
    setSelectedStudent(student);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError("Please select a student");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await collectFee({
        student_id: selectedStudent.id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method as "cash" | "bank" | "online",
        fee_month: formData.fee_month,
        fee_year: parseInt(formData.fee_year),
        remarks: formData.remarks || undefined,
      }) as { error?: string; data?: { receipt_no: string } };

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.data) {
        setSuccess({ receipt_no: result.data.receipt_no });
      }
      setIsLoading(false);
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setFormData({
      amount: "",
      payment_method: "cash",
      fee_month: (currentDate.getMonth() + 1).toString(),
      fee_year: currentDate.getFullYear().toString(),
      remarks: "",
    });
    setSuccess(null);
    setError(null);
  };

  // Success state
  if (success) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">
              Fee collected from <span className="font-medium">{selectedStudent?.name}</span>
            </p>
            <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 mb-8">
              <p className="text-sm text-gray-500">Receipt Number</p>
              <p className="text-xl font-mono font-bold text-gray-900">{success.receipt_no}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => router.push(`/fees/memo?receipt=${success.receipt_no}`)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
              >
                <FileText size={18} />
                Print Receipt
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Collect Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Student Selection */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Student Information</h2>
                <p className="text-sm text-gray-500">Search and select the student</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {selectedStudent ? (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                {selectedStudent.photo_url ? (
                  <img
                    src={selectedStudent.photo_url}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.registration_no}</p>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.class_name} - {selectedStudent.section_name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or registration number..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                />
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {searchResults.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.registration_no} • {student.class_name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {isSearching && (
                  <p className="mt-2 text-sm text-gray-500">Searching...</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Payment Details</h2>
                <p className="text-sm text-gray-500">Enter the payment information</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rs.
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xl font-semibold"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, payment_method: method.value }))}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      formData.payment_method === method.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{method.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Month & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Month <span className="text-red-500">*</span>
                </label>
                <select
                  name="fee_month"
                  value={formData.fee_month}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="fee_year"
                  value={formData.fee_year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={2}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              />
            </div>
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
            disabled={isLoading || !selectedStudent}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium text-sm transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? "Processing..." : "Collect Payment"}
          </button>
        </div>
      </div>
    </form>
  );
}

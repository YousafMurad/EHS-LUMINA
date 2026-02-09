"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Lock,
  Camera
} from "lucide-react";
import { createTeacherWithAuth, uploadTeacherPhoto, type CreateTeacherWithAuthData } from "@/server/actions/teachers";

const contractTypes = [
  { value: "permanent", label: "Permanent" },
  { value: "contract", label: "Contract" },
  { value: "visiting", label: "Visiting" },
];

interface TeacherFormProps {
  teacher?: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    cnic: string;
    address?: string;
    photo_url?: string;
    qualification?: string;
    specialization?: string;
    joining_date: string;
    salary: number;
    contract_type: "permanent" | "contract" | "visiting";
    agreement_terms?: string;
  };
}

export function TeacherForm({ teacher }: TeacherFormProps) {
  const router = useRouter();
  const isEditing = !!teacher;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(teacher?.photo_url || null);

  const [formData, setFormData] = useState({
    // Personal Info
    name: teacher?.name || "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    cnic: teacher?.cnic || "",
    address: teacher?.address || "",
    
    // Auth Credentials (only for new teachers)
    loginEmail: teacher?.email || "", // Email for login (can be different from contact email)
    password: "",
    confirmPassword: "",
    createLogin: true, // Default to creating login credentials
    
    // Professional Info
    qualification: teacher?.qualification || "",
    specialization: teacher?.specialization || "",
    
    // Employment Info
    joining_date: teacher?.joining_date || new Date().toISOString().split("T")[0],
    salary: teacher?.salary?.toString() || "",
    contract_type: teacher?.contract_type || "permanent" as "permanent" | "contract" | "visiting",
    agreement_terms: teacher?.agreement_terms || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.cnic.trim()) {
      setError("CNIC is required");
      return false;
    }
    if (!formData.joining_date) {
      setError("Joining date is required");
      return false;
    }
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      setError("Valid salary is required");
      return false;
    }
    
    // Validate auth credentials for new teachers with login enabled
    if (!isEditing && formData.createLogin) {
      if (!formData.loginEmail.trim()) {
        setError("Login email is required for credentials");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.loginEmail)) {
        setError("Please enter a valid login email address");
        return false;
      }
      if (!formData.password) {
        setError("Password is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const teacherData: CreateTeacherWithAuthData = {
        name: formData.name,
        email: formData.email || formData.loginEmail || undefined,
        phone: formData.phone,
        cnic: formData.cnic,
        address: formData.address || undefined,
        qualification: formData.qualification || undefined,
        specialization: formData.specialization || undefined,
        joining_date: formData.joining_date,
        salary: parseFloat(formData.salary),
        contract_type: formData.contract_type,
        agreement_terms: formData.agreement_terms || undefined,
        // Auth credentials - use loginEmail for authentication
        createLogin: formData.createLogin && !isEditing,
        loginEmail: formData.createLogin && !isEditing ? formData.loginEmail : undefined,
        password: formData.createLogin && !isEditing ? formData.password : undefined,
      };

      const result = await createTeacherWithAuth(teacherData);

      if (result.error) {
        setError(result.error);
      } else {
        // Upload photo if selected
        if (photoFile && result.data?.id) {
          const photoResult = await uploadTeacherPhoto(result.data.id, photoFile);
          if (photoResult.error) {
            console.warn("Photo upload failed:", photoResult.error);
          }
        }
        router.push("/teachers");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-500">Basic details about the teacher</p>
          </div>
        </div>
        
        {/* Photo Upload and Basic Info Row */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors overflow-hidden bg-gray-50"
                onClick={() => document.getElementById('teacher-photo-input')?.click()}
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Teacher" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Camera size={32} />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}
              </div>
              {/* X button positioned outside overflow container */}
              {photoPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white z-10"
                >
                  ×
                </button>
              )}
            </div>
            <input
              id="teacher-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("Photo must be less than 5MB");
                    return;
                  }
                  setPhotoFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setPhotoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG</p>
          </div>

          {/* Name and Basic Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <Mail size={14} /> Contact Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <Phone size={14} /> Phone Number <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="03XX-XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <CreditCard size={14} /> CNIC <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Login Credentials - Only for new teachers */}
      {!isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lock size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Login Credentials</h3>
                <p className="text-sm text-gray-500">Allow teacher to login to the system</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="createLogin"
                checked={formData.createLogin}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="text-sm font-medium text-gray-700">Create login account</span>
            </label>
          </div>
          
          {formData.createLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Mail size={14} /> Login Email <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="loginEmail"
                  value={formData.loginEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="teacher@school.com"
                />
                <p className="text-xs text-gray-500 mt-1">This email will be used for login</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Re-enter password"
                />
              </div>
              
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  💡 Teacher will login using <strong>{formData.loginEmail || "the email above"}</strong> and password. 
                  They will have access to their assigned classes, attendance, and limited features based on teacher role.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Qualifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Qualifications</h3>
            <p className="text-sm text-gray-500">Educational background and expertise</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Highest Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="e.g., M.Ed, B.Sc, M.A."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization / Subjects
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="e.g., Mathematics, Science"
            />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
            <p className="text-sm text-gray-500">Contract and salary information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <Calendar size={14} /> Joining Date <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <DollarSign size={14} /> Monthly Salary (₨) <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="e.g., 35000"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Type <span className="text-red-500">*</span>
            </label>
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {contractTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agreement Terms / Special Conditions
            </label>
            <textarea
              name="agreement_terms"
              value={formData.agreement_terms}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              placeholder="Any special terms, conditions, or notes about the employment agreement..."
            />
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update Teacher" : "Add Teacher"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

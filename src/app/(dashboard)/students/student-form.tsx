// Student Form Component - Create/Edit student
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, X, Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { createStudent, updateStudent, findParentByCnic } from "@/server/actions/students";
import { uploadStudentPhoto } from "@/server/actions/upload";
import { ImageUpload } from "@/components/forms/image-upload";

interface ClassOption {
  id: string;
  name: string;
}

interface SectionOption {
  id: string;
  name: string;
}

interface StudentFormProps {
  student?: {
    id: string;
    name: string;
    father_name: string;
    mother_name?: string;
    father_cnic?: string;
    mother_cnic?: string;
    date_of_birth: string;
    gender: string;
    class_id: string;
    section_id?: string;
    admission_date: string;
    address?: string;
    phone?: string;
    email?: string;
    cnic?: string;
    blood_group?: string;
    emergency_contact?: string;
    photo_url?: string;
  };
  classes: ClassOption[];
  sections: Record<string, SectionOption[]>; // sections grouped by class_id
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

type GenderValue = "male" | "female" | "other";

export function StudentForm({ student, classes, sections }: StudentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = !!student;

  // Pre-fill from URL params if creating new
  const urlClassId = searchParams.get("class_id");
  const urlSectionId = searchParams.get("section_id");

  const [formData, setFormData] = useState({
    name: student?.name || "",
    father_name: student?.father_name || "",
    mother_name: student?.mother_name || "",
    father_cnic: student?.father_cnic || "",
    mother_cnic: student?.mother_cnic || "",
    date_of_birth: student?.date_of_birth?.split("T")[0] || "",
    gender: (student?.gender || "male") as GenderValue,
    class_id: student?.class_id || urlClassId || "",
    section_id: student?.section_id || urlSectionId || "",
    admission_date: student?.admission_date?.split("T")[0] || new Date().toISOString().split("T")[0],
    address: student?.address || "",
    phone: student?.phone || "",
    email: student?.email || "",
    cnic: student?.cnic || "",
    blood_group: student?.blood_group || "",
    emergency_contact: student?.emergency_contact || "",
  });

  // Parent credentials state (only for new students)
  const [parentCredentials, setParentCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    createAccount: true, // Default to creating parent account
  });
  
  // Existing parent state for sibling detection
  const [existingParent, setExistingParent] = useState<{
    id: string;
    email: string;
    name: string;
    childrenCount: number;
  } | null>(null);
  const [isSearchingParent, setIsSearchingParent] = useState(false);
  const [linkToExisting, setLinkToExisting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Search for existing parent when father/mother CNIC changes
  const searchParentByCnic = async (cnic: string) => {
    if (!cnic || cnic.length < 13) {
      setExistingParent(null);
      return;
    }
    
    setIsSearchingParent(true);
    try {
      const result = await findParentByCnic(cnic);
      if (result.success && result.parent) {
        setExistingParent(result.parent);
        setLinkToExisting(true); // Auto-select linking if parent found
        setParentCredentials(prev => ({ ...prev, createAccount: false }));
      } else {
        setExistingParent(null);
      }
    } catch (err) {
      console.error("Error searching for parent:", err);
      setExistingParent(null);
    } finally {
      setIsSearchingParent(false);
    }
  };

  // Debounced search effect for father CNIC
  useEffect(() => {
    if (!isEditing && formData.father_cnic && formData.father_cnic.length >= 13) {
      const timer = setTimeout(() => {
        searchParentByCnic(formData.father_cnic);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.father_cnic, isEditing]);

  // Also search by mother CNIC if father's doesn't match
  useEffect(() => {
    if (!isEditing && !existingParent && formData.mother_cnic && formData.mother_cnic.length >= 13) {
      const timer = setTimeout(() => {
        searchParentByCnic(formData.mother_cnic);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.mother_cnic, isEditing, existingParent]);

  const [photoUrl, setPhotoUrl] = useState<string | undefined>(student?.photo_url);

  const handlePhotoUpload = async (file: File) => {
    if (!student?.id) {
      // For new students, we can't upload yet - store locally
      return { success: false, error: "Save the student first, then upload photo" };
    }
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadStudentPhoto(formData, student.id);
    if (result.success && result.url) {
      setPhotoUrl(result.url);
    }
    return result;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available sections for selected class - wrapped in useMemo
  const availableSections = useMemo(() => {
    return formData.class_id ? sections[formData.class_id] || [] : [];
  }, [formData.class_id, sections]);

  // Handle class change - reset section if not valid
  const handleClassChange = (newClassId: string) => {
    const newSections = sections[newClassId] || [];
    const currentSectionValid = newSections.some((s) => s.id === formData.section_id);
    
    setFormData((prev) => ({
      ...prev,
      class_id: newClassId,
      section_id: currentSectionValid ? prev.section_id : "",
    }));
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "class_id") {
      handleClassChange(value);
      return;
    }
    if (name === "gender") {
      setFormData((prev) => ({ ...prev, [name]: value as GenderValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Student name is required");
      setIsLoading(false);
      return;
    }
    if (!formData.father_name.trim()) {
      setError("Father name is required");
      setIsLoading(false);
      return;
    }
    if (!formData.class_id) {
      setError("Please select a class");
      setIsLoading(false);
      return;
    }
    // Section is now optional - no validation needed

    // Parent credentials validation (only for new students, and only if not linking to existing)
    if (!isEditing && parentCredentials.createAccount && !linkToExisting) {
      if (!parentCredentials.email.trim()) {
        setError("Parent email is required for login credentials");
        setIsLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentCredentials.email)) {
        setError("Please enter a valid email address for parent");
        setIsLoading(false);
        return;
      }
      if (!parentCredentials.password || parentCredentials.password.length < 6) {
        setError("Parent password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
      if (parentCredentials.password !== parentCredentials.confirmPassword) {
        setError("Parent passwords do not match");
        setIsLoading(false);
        return;
      }
    }

    const submitData = {
      ...formData,
      section_id: formData.section_id || undefined, // Convert empty string to undefined
      mother_name: formData.mother_name || undefined,
      father_cnic: formData.father_cnic || undefined,
      mother_cnic: formData.mother_cnic || undefined,
      address: formData.address || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      cnic: formData.cnic || undefined,
      blood_group: formData.blood_group || undefined,
      emergency_contact: formData.emergency_contact || undefined,
      // Include existing parent ID if linking to existing parent
      ...(!isEditing && linkToExisting && existingParent ? {
        existingParentId: existingParent.id,
      } : {}),
      // Include parent credentials if creating new student with new parent account
      ...(!isEditing && parentCredentials.createAccount && !linkToExisting ? {
        parentEmail: parentCredentials.email,
        parentPassword: parentCredentials.password,
      } : {}),
    };

    try {
      const result = isEditing
        ? await updateStudent(student.id, submitData)
        : await createStudent(submitData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/students");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Father & Mother Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    placeholder="Enter mother's name"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Father & Mother CNIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father&apos;s CNIC
                    {isSearchingParent && <span className="ml-2 text-xs text-blue-500">Checking...</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="father_cnic"
                      value={formData.father_cnic}
                      onChange={handleChange}
                      placeholder="00000-0000000-0"
                      maxLength={15}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    {existingParent && formData.father_cnic && (
                      <UserCheck size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for sibling tracking
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother&apos;s CNIC
                  </label>
                  <input
                    type="text"
                    name="mother_cnic"
                    value={formData.mother_cnic}
                    onChange={handleChange}
                    placeholder="00000-0000000-0"
                    maxLength={15}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Existing Parent Found Alert */}
              {!isEditing && existingParent && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <UserCheck className="text-green-600 mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        Existing parent found!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        <strong>{existingParent.name}</strong> ({existingParent.email}) already has {existingParent.childrenCount} child(ren) registered.
                      </p>
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={linkToExisting}
                          onChange={(e) => {
                            setLinkToExisting(e.target.checked);
                            setParentCredentials(prev => ({ ...prev, createAccount: !e.target.checked }));
                          }}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-green-800">
                          Link this student to existing parent account (no new credentials needed)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {GENDERS.map((g) => (
                      <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g.value}
                          checked={formData.gender === g.value}
                          onChange={handleChange}
                          className="w-4 h-4 text-yellow-500 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-gray-700">{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* CNIC & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNIC / B-Form
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="00000-0000000-0"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Academic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Class & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    disabled={!formData.class_id}
                  >
                    <option value="">
                      {formData.class_id 
                        ? availableSections.length > 0 
                          ? "Select section (optional)" 
                          : "No sections available"
                        : "Select class first"}
                    </option>
                    {availableSections.map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Emergency contact number"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Parent Login Credentials - Only for new students and not linking to existing */}
          {!isEditing && !linkToExisting && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Lock size={18} />
                  Parent Login Credentials
                </h2>
                <p className="text-sm text-indigo-100 mt-1">
                  Create login account for parent to access dashboard
                </p>
              </div>
              <div className="p-6 space-y-4">
                {/* Create Account Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parentCredentials.createAccount}
                    onChange={(e) => setParentCredentials({ ...parentCredentials, createAccount: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Create new parent login account
                  </span>
                </label>

                {parentCredentials.createAccount && (
                  <>
                    {/* Parent Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={parentCredentials.email}
                          onChange={(e) => setParentCredentials({ ...parentCredentials, email: e.target.value })}
                          placeholder="parent@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required={parentCredentials.createAccount}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Must be unique - no two students can share the same parent email
                      </p>
                    </div>

                    {/* Parent Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={parentCredentials.password}
                          onChange={(e) => setParentCredentials({ ...parentCredentials, password: e.target.value })}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required={parentCredentials.createAccount}
                          minLength={6}
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

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={parentCredentials.confirmPassword}
                          onChange={(e) => setParentCredentials({ ...parentCredentials, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required={parentCredentials.createAccount}
                          minLength={6}
                        />
                      </div>
                      {parentCredentials.password && parentCredentials.confirmPassword && 
                        parentCredentials.password !== parentCredentials.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Passwords do not match
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> These credentials will allow parents to log in and view their child&apos;s attendance, results, and submit feedback.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photo Upload Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Student Photo</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <ImageUpload
                value={photoUrl}
                onUpload={isEditing ? handlePhotoUpload : undefined}
                onChange={isEditing ? undefined : () => {}}
                placeholder={isEditing ? "Upload Photo" : "Save first"}
                shape="square"
                size="lg"
              />
              {!isEditing && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Save the student first to upload a photo
                </p>
              )}
            </div>
          </div>

          {/* Quick Info */}
          {isEditing && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-medium text-blue-900 mb-3">Editing Tips</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Class/section changes affect fee structure</li>
                <li>• Previous records are preserved in history</li>
                <li>• Photo can be updated from profile page</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
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
          {isLoading ? "Saving..." : isEditing ? "Update Student" : "Add Student"}
        </button>
      </div>
    </form>
  );
}

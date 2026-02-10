"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Building2, Phone, Mail, Globe, MapPin, Loader2, Check, ImageIcon, Upload, X, Camera } from "lucide-react";
import { uploadSchoolLogo } from "@/server/actions/upload";
import { getSchoolSettings, saveSchoolSettings, SchoolSettings } from "@/server/actions/settings";

export function GeneralSettingsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    tagline: "",
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    principalName: "",
    principalEmail: "",
    registrationNo: "",
    establishedYear: "",
  });

  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoSaved, setLogoSaved] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const result = await getSchoolSettings();
      if (result.success && result.data) {
        const settings = result.data;
        setFormData({
          schoolName: settings.school_name,
          tagline: settings.tagline,
          email: settings.email,
          phone: settings.phone,
          alternatePhone: settings.alternate_phone,
          website: settings.website,
          address: settings.address,
          city: settings.city,
          state: settings.state,
          country: settings.country,
          postalCode: settings.postal_code,
          principalName: settings.principal_name,
          principalEmail: settings.principal_email,
          registrationNo: settings.registration_no,
          establishedYear: settings.established_year,
        });
        if (settings.logo_url) {
          setLogoUrl(settings.logo_url);
          setLogoPreview(settings.logo_url);
        }
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  // Handle logo file selection - just preview, don't upload yet
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Logo file must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG");
      return;
    }

    setError(null);
    setLogoFile(file);
    setLogoSaved(false);
    setLogoLoadError(false);

    // Create local preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear logo selection - completely remove logo
  const handleClearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(undefined);
    setLogoSaved(false);
    setLogoLoadError(false);
    setHasChanges(true); // Mark as changed since we're removing the logo
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Save logo to server
  const handleSaveLogo = async () => {
    if (!logoFile) return;

    setIsUploadingLogo(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", logoFile);
      const result = await uploadSchoolLogo(formDataObj);
      
      if (result.success && result.url) {
        setLogoUrl(result.url);
        setLogoPreview(result.url);
        setLogoFile(null);
        setLogoSaved(true);
        // Also save to settings
        const saveResult = await saveSchoolSettings({ logo_url: result.url });
        if (!saveResult.success) {
          setLogoSaved(false);
          setError(saveResult.error || "Failed to save logo URL");
          return;
        }
        // Refresh the page to update sidebar logo
        router.refresh();
        setTimeout(() => setLogoSaved(false), 3000);
      } else {
        setError(result.error || "Failed to upload logo");
      }
    } catch {
      setError("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const settingsData: Partial<SchoolSettings> = {
      school_name: formData.schoolName,
      tagline: formData.tagline,
      email: formData.email,
      phone: formData.phone,
      alternate_phone: formData.alternatePhone,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postal_code: formData.postalCode,
      principal_name: formData.principalName,
      principal_email: formData.principalEmail,
      registration_no: formData.registrationNo,
      established_year: formData.establishedYear,
      logo_url: logoUrl || null,
    };

    const result = await saveSchoolSettings(settingsData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-yellow-500" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Success message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check size={18} />
          Settings saved successfully! Changes will be reflected across the application.
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* School Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
            <p className="text-sm text-gray-500">Basic details about your institution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline / Motto</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
            <input
              type="text"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ImageIcon size={20} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">School Logo</h3>
            <p className="text-sm text-gray-500">Your logo appears on documents, certificates, and the website</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          {/* Logo Preview Box */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors overflow-hidden bg-gray-50"
              >
                {isUploadingLogo ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={32} className="text-yellow-500 animate-spin" />
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                ) : logoPreview && !logoLoadError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="School Logo"
                    className="w-full h-full object-contain p-2"
                    onError={() => setLogoLoadError(true)}
                    onLoad={() => setLogoLoadError(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Camera size={32} />
                    <span className="text-xs text-center px-2">Click to upload</span>
                  </div>
                )}
              </div>
              
              {/* X button to clear - show when there's a valid image preview or a pending file */}
              {((logoPreview && !logoLoadError) || logoFile) && !isUploadingLogo && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearLogo();
                  }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white z-10"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleLogoSelect}
              className="hidden"
              disabled={isUploadingLogo}
            />
            
            {/* Status messages */}
            {logoSaved && (
              <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                <Check size={12} /> Logo saved successfully!
              </p>
            )}
            
            {/* Buttons container */}
            <div className="flex flex-col items-center gap-2 mt-3">
              {/* Save Logo Button - show when there's a new file to save */}
              {logoFile && !isUploadingLogo && (
                <button
                  type="button"
                  onClick={handleSaveLogo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium shadow-sm"
                >
                  <Save size={16} />
                  Save Logo
                </button>
              )}
              
              {/* Change/Upload button - always show unless uploading */}
              {!isUploadingLogo && !logoFile && (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Upload size={16} />
                  {logoPreview && !logoLoadError ? "Change Logo" : "Choose File"}
                </button>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              Upload your school logo. Recommended size: 200x200 pixels. Supported formats: PNG, JPG, SVG.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Maximum file size: 5MB. The logo will appear on:
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-500" /> Website header & sidebar
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-500" /> All certificates (SLC, Character, etc.)
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-500" /> Fee challans & receipts
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-500" /> Reports & official documents
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Phone size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-500">How people can reach you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <Mail size={14} /> Email Address
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <Globe size={14} /> Website
              </span>
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
            <input
              type="tel"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <MapPin size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <p className="text-sm text-gray-500">Physical location of the school</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Principal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Principal / Head of School</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="principalEmail"
              value={formData.principalEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        {hasChanges && !saved && (
          <span className="text-sm text-amber-600">You have unsaved changes</span>
        )}
      </div>
    </form>
  );
}

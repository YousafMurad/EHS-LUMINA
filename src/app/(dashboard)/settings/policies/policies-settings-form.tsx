"use client";

import { useState } from "react";
import { Save, Loader2, Calendar, GraduationCap, AlertTriangle, Clock } from "lucide-react";

export function PoliciesSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [policies, setPolicies] = useState({
    // Academic Year
    academicYearStart: "04", // April
    academicYearEnd: "03", // March
    
    // Promotion Policy
    minimumAttendance: 75,
    promotionPassPercentage: 33,
    graceMarks: 5,
    enableGraceMarks: true,
    maxSubjectsForGrace: 2,
    
    // Grading System
    gradingSystem: "percentage", // percentage, gpa, grades
    
    // Attendance Policy
    attendanceType: "daily", // daily, subject-wise
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    
    // Certificate Policy
    slcMinDays: 30, // Minimum days before issuing SLC
    requireFeeClearing: true,
    requireNocFromLibrary: true,
    
    // Data Retention
    dataRetentionYears: 10,
    archiveInactiveStudents: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setPolicies((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
    setSaved(false);
  };

  const toggleWorkingDay = (day: string) => {
    setPolicies((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const weekDays = [
    { key: "sunday", label: "Sun" },
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          System policies saved successfully!
        </div>
      )}

      {/* Academic Year Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Academic Year</h3>
            <p className="text-sm text-gray-500">Define your academic year period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year Starts</label>
            <select
              name="academicYearStart"
              value={policies.academicYearStart}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year Ends</label>
            <select
              name="academicYearEnd"
              value={policies.academicYearEnd}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Promotion Policy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Promotion Policy</h3>
            <p className="text-sm text-gray-500">Rules for student promotion</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Attendance (%)</label>
              <input
                type="number"
                name="minimumAttendance"
                value={policies.minimumAttendance}
                onChange={handleChange}
                min={0}
                max={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <p className="text-xs text-gray-500 mt-1">Required for promotion</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pass Percentage (%)</label>
              <input
                type="number"
                name="promotionPassPercentage"
                value={policies.promotionPassPercentage}
                onChange={handleChange}
                min={0}
                max={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum marks to pass</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grading System</label>
              <select
                name="gradingSystem"
                value={policies.gradingSystem}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="percentage">Percentage Based</option>
                <option value="gpa">GPA (4.0 Scale)</option>
                <option value="grades">Grade Letters (A-F)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                name="enableGraceMarks"
                checked={policies.enableGraceMarks}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="font-medium text-gray-900">Enable Grace Marks</span>
            </label>

            {policies.enableGraceMarks && (
              <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grace Marks</label>
                  <input
                    type="number"
                    name="graceMarks"
                    value={policies.graceMarks}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Subjects</label>
                  <input
                    type="number"
                    name="maxSubjectsForGrace"
                    value={policies.maxSubjectsForGrace}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Policy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Policy</h3>
            <p className="text-sm text-gray-500">Configure attendance tracking</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Type</label>
            <select
              name="attendanceType"
              value={policies.attendanceType}
              onChange={handleChange}
              className="max-w-xs w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="daily">Daily Attendance</option>
              <option value="subject-wise">Subject-wise Attendance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleWorkingDay(day.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    policies.workingDays.includes(day.key)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Policy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Certificate Policy</h3>
            <p className="text-sm text-gray-500">Requirements for certificate issuance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Days for SLC</label>
            <input
              type="number"
              name="slcMinDays"
              value={policies.slcMinDays}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <p className="text-xs text-gray-500 mt-1">Days student must wait after applying</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requireFeeClearing"
                checked={policies.requireFeeClearing}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <div>
                <span className="font-medium text-gray-900">Require Fee Clearing</span>
                <p className="text-xs text-gray-500">All dues must be cleared before issuing SLC</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requireNocFromLibrary"
                checked={policies.requireNocFromLibrary}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <div>
                <span className="font-medium text-gray-900">Require Library NOC</span>
                <p className="text-xs text-gray-500">Library clearance needed for SLC</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period (Years)</label>
            <input
              type="number"
              name="dataRetentionYears"
              value={policies.dataRetentionYears}
              onChange={handleChange}
              min={1}
              max={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <p className="text-xs text-gray-500 mt-1">How long to keep student records</p>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="archiveInactiveStudents"
                checked={policies.archiveInactiveStudents}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="font-medium text-gray-900">Auto-archive Inactive Students</span>
            </label>
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
          {isSubmitting ? "Saving..." : "Save Policies"}
        </button>
      </div>
    </form>
  );
}

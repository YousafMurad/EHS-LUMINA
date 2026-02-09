// Parent Dashboard - View children's information and attendance
"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Receipt,
  ChevronRight,
  User,
} from "lucide-react";

interface ChildInfo {
  id: string;
  name: string;
  registrationNo: string;
  className: string;
  sectionName: string;
  photoUrl?: string | null;
  fatherName?: string;
  status: string;
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}

interface FeeInfo {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  lastPaymentDate?: string;
}

interface ParentDashboardProps {
  parentName: string;
  children: ChildInfo[];
  attendanceSummary: Record<string, AttendanceSummary>;
  feeInfo: Record<string, FeeInfo>;
  currentSession: string;
}

export function ParentDashboard({
  parentName,
  children,
  attendanceSummary,
  feeInfo,
  currentSession,
}: ParentDashboardProps) {
  const [selectedChild, setSelectedChild] = useState<string | null>(
    children.length > 0 ? children[0].id : null
  );

  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Good Morning"
      : today.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  const currentChild = children.find((c) => c.id === selectedChild);
  const currentAttendance = selectedChild
    ? attendanceSummary[selectedChild]
    : null;
  const currentFees = selectedChild ? feeInfo[selectedChild] : null;

  const formatCurrency = (amount: number) => {
    return `₨ ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">{greeting}</p>
            <h1 className="text-2xl font-bold mt-1">{parentName}</h1>
            <p className="text-emerald-100 mt-1">
              {children.length} {children.length === 1 ? "child" : "children"}{" "}
              enrolled • {currentSession}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Calendar className="h-8 w-8 text-white/80" />
            <div>
              <p className="text-sm text-emerald-100">Today</p>
              <p className="font-semibold">
                {today.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Selector (if multiple children) */}
      {children.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Select Child
          </h2>
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedChild === child.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-emerald-300 text-gray-700"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{child.name}</p>
                  <p className="text-xs text-gray-500">
                    {child.className} - {child.sectionName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Child Info */}
      {currentChild && (
        <>
          {/* Student Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {currentChild.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentChild.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Registration No</p>
                    <p className="font-medium text-gray-900">
                      {currentChild.registrationNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="font-medium text-gray-900">
                      {currentChild.className}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Section</p>
                    <p className="font-medium text-gray-900">
                      {currentChild.sectionName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {currentChild.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Attendance Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">This Month</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {currentAttendance?.presentDays || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Days Present</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs text-gray-500">This Month</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {currentAttendance?.absentDays || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Days Absent</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Overall</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {currentAttendance?.attendancePercentage.toFixed(1) || "0"}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Attendance Rate</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xs text-gray-500">This Month</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {currentAttendance?.lateDays || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Days Late</p>
            </div>
          </div>

          {/* Fee Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  Fee Summary
                </h3>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Total Fees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(currentFees?.totalFees || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700">Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(currentFees?.paidAmount || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-700">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {formatCurrency(currentFees?.pendingAmount || 0)}
                  </p>
                </div>
              </div>
              {currentFees?.lastPaymentDate && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Last payment on{" "}
                  {new Date(currentFees.lastPaymentDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Attendance Progress */}
          {currentAttendance && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Attendance Progress
                </h3>
              </div>
              <div className="p-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                        {currentAttendance.attendancePercentage >= 75
                          ? "Good Standing"
                          : currentAttendance.attendancePercentage >= 50
                            ? "Needs Improvement"
                            : "Low Attendance"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-emerald-600">
                        {currentAttendance.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100">
                    <div
                      style={{
                        width: `${currentAttendance.attendancePercentage}%`,
                      }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        currentAttendance.attendancePercentage >= 75
                          ? "bg-emerald-500"
                          : currentAttendance.attendancePercentage >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="font-bold text-green-600">
                        {currentAttendance.presentDays}
                      </p>
                      <p className="text-gray-600">Present</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <p className="font-bold text-red-600">
                        {currentAttendance.absentDays}
                      </p>
                      <p className="text-gray-600">Absent</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <p className="font-bold text-yellow-600">
                        {currentAttendance.lateDays}
                      </p>
                      <p className="text-gray-600">Late</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-bold text-gray-600">
                        {currentAttendance.totalDays}
                      </p>
                      <p className="text-gray-600">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* No Children Message */}
      {children.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Children Linked
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your account is not linked to any students yet. Please contact the
            school administration to link your children&apos;s accounts.
          </p>
        </div>
      )}
    </div>
  );
}

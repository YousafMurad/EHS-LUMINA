"use client";

import { useState } from "react";
import { Search, Filter, Download, User, Clock, Activity, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

// Sample audit log data
const sampleLogs: AuditLog[] = [
  {
    id: "1",
    user: "Admin User",
    role: "super_admin",
    action: "CREATE",
    module: "Students",
    description: "Created new student: Ahmed Khan (Roll No: 2026001)",
    ipAddress: "192.168.1.100",
    timestamp: "2025-06-06T10:30:00",
    status: "success",
  },
  {
    id: "2",
    user: "Operator",
    role: "operator",
    action: "UPDATE",
    module: "Fees",
    description: "Collected fee payment Rs. 5,000 from Ahmed Khan",
    ipAddress: "192.168.1.101",
    timestamp: "2025-06-06T10:15:00",
    status: "success",
  },
  {
    id: "3",
    user: "Admin User",
    role: "admin",
    action: "DELETE",
    module: "Students",
    description: "Deleted student record: Test Student",
    ipAddress: "192.168.1.100",
    timestamp: "2025-06-06T09:45:00",
    status: "warning",
  },
  {
    id: "4",
    user: "System",
    role: "system",
    action: "LOGIN_FAILED",
    module: "Auth",
    description: "Failed login attempt for user: unknown@email.com",
    ipAddress: "203.45.67.89",
    timestamp: "2025-06-06T09:30:00",
    status: "error",
  },
  {
    id: "5",
    user: "Admin User",
    role: "super_admin",
    action: "UPDATE",
    module: "Settings",
    description: "Updated school general settings",
    ipAddress: "192.168.1.100",
    timestamp: "2025-06-06T09:00:00",
    status: "success",
  },
  {
    id: "6",
    user: "Operator",
    role: "operator",
    action: "CREATE",
    module: "Certificates",
    description: "Generated SLC for student: Fatima Ali",
    ipAddress: "192.168.1.101",
    timestamp: "2025-06-05T16:30:00",
    status: "success",
  },
  {
    id: "7",
    user: "Admin User",
    role: "admin",
    action: "UPDATE",
    module: "Teachers",
    description: "Updated teacher profile: Moulvi Sahab",
    ipAddress: "192.168.1.100",
    timestamp: "2025-06-05T15:00:00",
    status: "success",
  },
  {
    id: "8",
    user: "System",
    role: "system",
    action: "BACKUP",
    module: "System",
    description: "Automatic daily backup completed",
    ipAddress: "127.0.0.1",
    timestamp: "2025-06-05T00:00:00",
    status: "success",
  },
];

export function AuditLogsClient() {
  const [logs] = useState<AuditLog[]>(sampleLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const modules = ["all", "Students", "Teachers", "Fees", "Certificates", "Settings", "Auth", "System"];
  const actions = ["all", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGIN_FAILED", "BACKUP"];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === "all" || log.module === filterModule;
    const matchesAction = filterAction === "all" || log.action === filterAction;
    return matchesSearch && matchesModule && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-700";
      case "UPDATE":
        return "bg-blue-100 text-blue-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      case "LOGIN":
        return "bg-purple-100 text-purple-700";
      case "LOGIN_FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              <p className="text-sm text-gray-500">Total Actions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Today</p>
              <p className="text-sm text-gray-500">Last Activity</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter((l) => l.status === "error").length}
              </p>
              <p className="text-sm text-gray-500">Failed Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {modules.map((module) => (
                <option key={module} value={module}>
                  {module === "all" ? "All Modules" : module}
                </option>
              ))}
            </select>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action === "all" ? "All Actions" : action}
                </option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">User</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Module</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Description</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">IP Address</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Timestamp</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{log.user}</p>
                    <p className="text-xs text-gray-500">{log.role}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{log.module}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={log.description}>
                  {log.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ipAddress}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(log.timestamp)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * logsPerPage + 1} to{" "}
            {Math.min(currentPage * logsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-yellow-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

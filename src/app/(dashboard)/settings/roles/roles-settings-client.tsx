"use client";

import { useState } from "react";
import { Shield, Check, X, Save, Loader2, Info } from "lucide-react";

type Role = "super_admin" | "admin" | "operator";

interface Permission {
  key: string;
  label: string;
  description: string;
  category: string;
}

const permissions: Permission[] = [
  // Student Management
  { key: "students.view", label: "View Students", description: "View student list and details", category: "Students" },
  { key: "students.create", label: "Add Students", description: "Enroll new students", category: "Students" },
  { key: "students.edit", label: "Edit Students", description: "Modify student information", category: "Students" },
  { key: "students.delete", label: "Delete Students", description: "Remove students from system", category: "Students" },
  { key: "students.promote", label: "Promote Students", description: "Promote students to next class", category: "Students" },
  
  // Teacher Management
  { key: "teachers.view", label: "View Teachers", description: "View teacher list and details", category: "Teachers" },
  { key: "teachers.create", label: "Add Teachers", description: "Add new teachers", category: "Teachers" },
  { key: "teachers.edit", label: "Edit Teachers", description: "Modify teacher information", category: "Teachers" },
  { key: "teachers.delete", label: "Delete Teachers", description: "Remove teachers from system", category: "Teachers" },
  
  // Fee Management
  { key: "fees.view", label: "View Fees", description: "View fee records", category: "Fees" },
  { key: "fees.collect", label: "Collect Fees", description: "Accept fee payments", category: "Fees" },
  { key: "fees.structure", label: "Manage Structure", description: "Define fee amounts", category: "Fees" },
  { key: "fees.reports", label: "Fee Reports", description: "Generate fee reports", category: "Fees" },
  
  // Class & Section Management
  { key: "classes.view", label: "View Classes", description: "View class list", category: "Classes" },
  { key: "classes.manage", label: "Manage Classes", description: "Add/edit classes and sections", category: "Classes" },
  
  // Reports
  { key: "reports.students", label: "Student Reports", description: "Generate student reports", category: "Reports" },
  { key: "reports.financial", label: "Financial Reports", description: "Access financial reports", category: "Reports" },
  { key: "reports.export", label: "Export Reports", description: "Export data to Excel/PDF", category: "Reports" },
  
  // Certificates
  { key: "certificates.view", label: "View Certificates", description: "View generated certificates", category: "Certificates" },
  { key: "certificates.generate", label: "Generate Certificates", description: "Create SLC, character certificates", category: "Certificates" },
  
  // Settings
  { key: "settings.general", label: "General Settings", description: "Modify school settings", category: "Settings" },
  { key: "settings.fees", label: "Fee Settings", description: "Configure fee policies", category: "Settings" },
  { key: "settings.roles", label: "Role Settings", description: "Manage permissions", category: "Settings" },
  
  // Operators
  { key: "operators.view", label: "View Operators", description: "View operator list", category: "Operators" },
  { key: "operators.manage", label: "Manage Operators", description: "Add/edit operators", category: "Operators" },
];

const defaultPermissions: Record<Role, string[]> = {
  super_admin: permissions.map((p) => p.key), // All permissions
  admin: [
    "students.view", "students.create", "students.edit", "students.promote",
    "teachers.view", "teachers.create", "teachers.edit",
    "fees.view", "fees.collect", "fees.structure", "fees.reports",
    "classes.view", "classes.manage",
    "reports.students", "reports.financial", "reports.export",
    "certificates.view", "certificates.generate",
    "settings.general", "settings.fees",
    "operators.view",
  ],
  operator: [
    "students.view", "students.create", "students.edit",
    "teachers.view",
    "fees.view", "fees.collect",
    "classes.view",
    "reports.students",
    "certificates.view", "certificates.generate",
  ],
};

export function RolesSettingsClient() {
  const [rolePermissions, setRolePermissions] = useState(defaultPermissions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const roles: { key: Role; label: string; color: string }[] = [
    { key: "super_admin", label: "Super Admin", color: "bg-purple-100 text-purple-700" },
    { key: "admin", label: "Admin", color: "bg-blue-100 text-blue-700" },
    { key: "operator", label: "Operator", color: "bg-gray-100 text-gray-700" },
  ];

  const categories = [...new Set(permissions.map((p) => p.category))];

  const togglePermission = (role: Role, permissionKey: string) => {
    if (role === "super_admin") return; // Super admin always has all permissions
    
    setRolePermissions((prev) => {
      const current = prev[role];
      const updated = current.includes(permissionKey)
        ? current.filter((p) => p !== permissionKey)
        : [...current, permissionKey];
      return { ...prev, [role]: updated };
    });
    setSaved(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Role permissions saved successfully!
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info size={20} className="text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Role Permission Matrix</p>
          <p className="text-sm text-blue-700 mt-1">
            Configure what each role can access. Super Admin always has full access and cannot be modified.
            Changes will affect all users with the respective role.
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {roles.map((role) => (
          <div key={role.key} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-yellow-600" />
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                  {role.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rolePermissions[role.key].length} of {permissions.length} permissions
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(rolePermissions[role.key].length / permissions.length) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">Permission</th>
              {roles.map((role) => (
                <th key={role.key} className="px-6 py-4 text-center font-semibold text-gray-900">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <>
                <tr key={category} className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-3 font-semibold text-gray-700 text-sm">
                    {category}
                  </td>
                </tr>
                {permissions
                  .filter((p) => p.category === category)
                  .map((permission) => (
                    <tr key={permission.key} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{permission.label}</p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const hasPermission = rolePermissions[role.key].includes(permission.key);
                        const isDisabled = role.key === "super_admin";
                        
                        return (
                          <td key={role.key} className="px-6 py-3 text-center">
                            <button
                              onClick={() => togglePermission(role.key, permission.key)}
                              disabled={isDisabled}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                                hasPermission
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-400"
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
                            >
                              {hasPermission ? <Check size={16} /> : <X size={16} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}

// Fee Structures Page - Configure fee templates
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getFeeStructures } from "@/server/queries/fees";
import { getActiveSession } from "@/server/queries/sessions";
import { Plus, Settings, Pencil } from "lucide-react";
import Link from "next/link";

interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface FeeStructure {
  id: string;
  name: string;
  class_id: string;
  monthly_fee: number;
  admission_fee: number;
  security_fee: number;
  registration_fee: number;
  miscellaneous_fee: number;
  classes?: { name: string };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function FeeStructuresPage() {
  const activeSession = await getActiveSession() as unknown as Session | null;
  const structures = await getFeeStructures(activeSession?.id) as FeeStructure[];

  return (
    <div>
      <PageHeader
        title="Fee Structures"
        description="Configure fee templates for each class"
        breadcrumbs={[
          { label: "Fee Management", href: "/fees" },
          { label: "Fee Structures" },
        ]}
      >
        <PageHeaderButton href="/fees/structures/new" icon={<Plus size={18} />} variant="primary">
          Add Structure
        </PageHeaderButton>
      </PageHeader>

      {/* Session Info */}
      {activeSession && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Active Session: {activeSession.name}</p>
              <p className="text-sm text-blue-700">
                Fee structures shown below are for this session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Structures Grid */}
      {structures.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Settings size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No fee structures configured</p>
          <p className="text-gray-400 text-sm mt-1">Add fee structures for each class</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {structures.map((structure) => (
            <div
              key={structure.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{structure.classes?.name}</h3>
                    <p className="text-sm text-blue-200">{structure.name}</p>
                  </div>
                  <Link
                    href={`/fees/structures/${structure.id}/edit`}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Fee</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(structure.monthly_fee || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Admission Fee</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(structure.admission_fee || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(structure.security_fee || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(structure.registration_fee || 0)}
                  </span>
                </div>
                {structure.miscellaneous_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Miscellaneous</span>
                    <span className="font-medium text-gray-700">
                      {formatCurrency(structure.miscellaneous_fee)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total (First Month)</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(
                        (structure.monthly_fee || 0) +
                        (structure.admission_fee || 0) +
                        (structure.security_fee || 0) +
                        (structure.registration_fee || 0) +
                        (structure.miscellaneous_fee || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

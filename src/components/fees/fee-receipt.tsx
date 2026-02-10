"use client";

import { useSchoolInfo } from "@/hooks/useSchoolSettings";
import { Printer, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FeeReceiptProps {
  receiptNo: string;
  studentName: string;
  fatherName: string;
  className: string;
  sectionName: string;
  registrationNo: string;
  amount: number;
  paymentMethod: string;
  feeMonth: string;
  feeYear: number;
  paidDate: string;
  remarks?: string;
}

export function FeeReceipt({
  receiptNo,
  studentName,
  fatherName,
  className,
  sectionName,
  registrationNo,
  amount,
  paymentMethod,
  feeMonth,
  feeYear,
  paidDate,
  remarks,
}: FeeReceiptProps) {
  const { schoolInfo, isLoading } = useSchoolInfo();

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Action Buttons - Hidden in print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/fees/collection"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Fee Collection
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <Printer size={18} />
            Print Receipt
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border-2 print:border-gray-400">
        {/* Header with School Logo */}
        <div className="p-6 border-b-2 border-gray-300">
          <div className="flex items-start gap-4">
            {/* School Logo */}
            {schoolInfo?.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt={schoolInfo.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-blue-900">
                  {schoolInfo?.name?.substring(0, 3).toUpperCase() || "EHS"}
                </span>
              </div>
            )}

            {/* School Info */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{schoolInfo?.name || "EHS School"}</h1>
              {schoolInfo?.tagline && (
                <p className="text-sm text-gray-600 italic">{schoolInfo.tagline}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {schoolInfo?.address && <span>{schoolInfo.address}</span>}
              </div>
              <div className="text-xs text-gray-500">
                {schoolInfo?.phone && <span>Ph: {schoolInfo.phone}</span>}
                {schoolInfo?.email && <span className="ml-2">• {schoolInfo.email}</span>}
              </div>
            </div>

            {/* Receipt Title */}
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-900">FEE RECEIPT</h2>
              <p className="text-sm font-mono text-gray-600">{receiptNo}</p>
            </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6">
          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">Student Name</p>
              <p className="font-medium text-gray-900">{studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Father&apos;s Name</p>
              <p className="font-medium text-gray-900">{fatherName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Registration No</p>
              <p className="font-medium text-gray-900">{registrationNo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Class / Section</p>
              <p className="font-medium text-gray-900">{className} - {sectionName}</p>
            </div>
          </div>

          {/* Fee Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-gray-900">Fee for {feeMonth} {feeYear}</td>
                  <td className="py-2 text-right font-medium text-gray-900">₨ {amount.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <th className="text-left py-3 font-bold text-gray-900">Total Paid</th>
                  <th className="text-right py-3 font-bold text-green-600 text-lg">₨ {amount.toLocaleString()}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">{paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Date</p>
              <p className="font-medium text-gray-900">{paidDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            </div>
          </div>

          {remarks && (
            <div className="mb-6">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className="text-gray-700">{remarks}</p>
            </div>
          )}

          {/* Signature */}
          <div className="flex justify-between items-end pt-8 border-t border-dashed border-gray-300">
            <div className="text-center">
              <div className="w-40 border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-500">Student/Guardian</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-40 border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            This is a computer-generated receipt. Thank you for your payment!
          </p>
        </div>
      </div>
    </div>
  );
}

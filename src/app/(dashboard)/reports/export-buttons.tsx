"use client";

import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function ExportButtons({ onExportPDF, onExportExcel }: ExportButtonsProps) {
  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      // Default: show coming soon message
      alert("PDF Export coming soon!");
    }
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default: show coming soon message
      alert("Excel Export coming soon!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportPDF}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        <Download size={18} />
        Export PDF
      </button>
      <button
        onClick={handleExportExcel}
        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
      >
        <Download size={18} />
        Export Excel
      </button>
    </div>
  );
}

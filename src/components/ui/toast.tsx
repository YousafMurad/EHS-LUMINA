// Toast/Notification Component
"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({ id, type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${colors[type]}`}>
      <span className="text-lg">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>
  );
}

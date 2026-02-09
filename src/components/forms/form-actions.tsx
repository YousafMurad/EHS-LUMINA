// Form Actions Component - Submit/Cancel buttons
import { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
  align?: "left" | "right" | "center";
}

export function FormActions({ children, align = "right" }: FormActionsProps) {
  const alignments = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={`flex items-center gap-3 pt-6 border-t ${alignments[align]}`}>
      {children}
    </div>
  );
}

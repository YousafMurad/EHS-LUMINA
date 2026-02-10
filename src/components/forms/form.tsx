// Form Wrapper Component - Handles form state and submission
"use client";

import { ReactNode, FormEvent } from "react";

interface FormProps {
  children: ReactNode;
  onSubmit: (data: FormData) => void | Promise<void>;
  className?: string;
}

export function Form({ children, onSubmit, className = "" }: FormProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}

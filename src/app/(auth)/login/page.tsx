// Login Page - Authentication entry point
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/server/actions/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      const result = await signIn(formDataObj);

      // If we get a result with an error, show it
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      
      // If no error, the redirect will happen automatically
      // Keep loading state true to prevent UI flash
    } catch (err: unknown) {
      // Check if this is a Next.js redirect (NEXT_REDIRECT error)
      // These are expected and not actual errors
      if (err && typeof err === "object" && "digest" in err) {
        const digest = (err as { digest?: string }).digest;
        if (digest && digest.startsWith("NEXT_REDIRECT")) {
          // This is a redirect, not an error - do nothing
          return;
        }
      }
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium mb-6 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <div className="inline-flex w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl items-center justify-center shadow-lg mb-4">
          <span className="text-2xl font-bold text-blue-900">EHS</span>
        </div>
        <h1 className="text-2xl font-bold text-blue-900">EHS School</h1>
        <p className="text-gray-600">Management System</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Login Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail size={18} />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="current-password"
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </div>

      {/* Footer Text */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Having trouble signing in?{" "}
        <a href="#" className="text-blue-700 hover:text-blue-800 font-medium">
          Contact Support
        </a>
      </p>
    </div>
  );
}

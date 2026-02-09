// Forgot Password Page - Password recovery
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/server/actions/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await resetPassword(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-blue-800">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              try again
            </button>
          </p>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="inline-flex w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl items-center justify-center shadow-lg mb-4">
          <span className="text-xl font-bold text-blue-900">EHS</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-blue-700 hover:text-blue-800 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

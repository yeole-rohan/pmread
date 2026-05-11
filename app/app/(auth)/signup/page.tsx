"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/auth";
import { APIError } from "@/lib/types";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const billingParam = searchParams.get("billing") || "monthly";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrong = password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!passwordStrong) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, displayName || undefined);
      if (planParam === "pro" || planParam === "teams") {
        router.push(`/settings?upgrade=true&billing=${billingParam}&plan=${planParam}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof APIError ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Min 8 characters"
          />
          {password.length > 0 && (
            <div className={`mt-1 text-xs font-medium ${passwordStrong ? "text-green-600" : "text-red-500"}`}>
              {passwordStrong ? "Strong password" : `${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} needed`}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">
        By signing up you agree to our{" "}
        <Link href="/terms" className="text-[#7F77DD] hover:underline">
          Terms
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-[#7F77DD] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">PMRead</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your account</p>
        </div>
        <Suspense fallback={
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm h-64 animate-pulse" />
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}

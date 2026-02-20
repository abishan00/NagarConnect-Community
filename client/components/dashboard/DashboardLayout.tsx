"use client";

import Link from "next/link";
import { useGetUserQuery } from "@/redux/services/authApi";

export default function HomePage() {
  const { data, isLoading } = useGetUserQuery();

  const isLoggedIn = !!data?.user;

  if (isLoading) return null;

  return (
    <section className="min-h-screen bg-gray-50 pt-32">
      <div className="container text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Community Issue Reporting System
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Report local issues, track progress, and help your community grow
          stronger together.
        </p>

        <div className="flex justify-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Go to Dashboard
              </Link>

              <Link
                href="/profile"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition"
              >
                View Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Get Started Free
              </Link>

              <Link
                href="/auth/login"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

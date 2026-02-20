"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "@/redux/services/authApi";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset code sent to your email");
      localStorage.setItem("reset_email", email);
      router.push("/auth/reset-password");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <button
          onClick={() => router.push("/auth/login")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Enter your email to receive a reset code
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />
              <Mail
                size={18}
                className="absolute right-3 top-4 text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f7a4f] text-white py-3 rounded-lg font-semibold hover:bg-[#0c6641] transition"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

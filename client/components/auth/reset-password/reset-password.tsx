"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/services/authApi";

export default function ResetPassword() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resetCode = otp.join("");

    if (resetCode.length !== 6) {
      return toast.error("Enter complete 6 digit code");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      await resetPassword({
        resetCode,
        newPassword: password,
      }).unwrap();

      toast.success("Password reset successfully");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <button
          onClick={() => router.push("/auth/forgot-password")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Enter reset code and new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              />
            ))}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-600 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f7a4f] text-white py-3 rounded-lg font-semibold hover:bg-[#0c6641] transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

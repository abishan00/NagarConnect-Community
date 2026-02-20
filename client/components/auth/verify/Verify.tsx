"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { useActivateUserMutation } from "@/redux/services/authApi";

export default function Verify() {
  const router = useRouter();
  const [activate, { isLoading }] = useActivateUserMutation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
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

    const activation_token = localStorage.getItem("activation_token");

    if (!activation_token) {
      toast.error("Activation session expired");
      return;
    }

    const activation_code = otp.join("");

    if (activation_code.length !== 6) {
      toast.error("Enter complete 6 digit code");
      return;
    }

    try {
      await activate({
        activation_token,
        activation_code,
      }).unwrap();

      toast.success("Account verified successfully");
      localStorage.removeItem("activation_token");

      router.push("/auth/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid or expired code");

      // clear OTP on failure
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl text-center relative">
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center animate-[wiggle_1.5s_ease-in-out_infinite]">
            <ShieldCheck className="text-green-600" size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Account
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Enter the 6 digit verification code sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f7a4f] text-white py-3 rounded-lg font-semibold hover:bg-[#0c6641] transition cursor-pointer"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>

      {/* Add this in globals.css */}
      <style jsx global>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
}

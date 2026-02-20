"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Users,
  CheckCircle,
  Star,
  MessageSquare,
  TrendingUp,
  Shield,
  Clock,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/services/authApi";
import { ReactNode } from "react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full h-screen grid lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#24865f] to-[#05523c] text-white p-16">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">NagarConnect</h3>
                <p className="text-green-200 text-sm">
                  Issue Reporting Platform
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6">
              Building Stronger Communities Together
            </h1>

            <p className="text-green-100 text-lg mb-12">
              Join thousands of residents making a difference in their
              neighborhoods. Report issues, track progress, and collaborate with
              local authorities.
            </p>

            <div className="space-y-6">
              <Feature
                icon={<MessageSquare />}
                title="Easy Reporting"
                text="Submit community issues with photos and location details in seconds"
              />
              <Feature
                icon={<TrendingUp />}
                title="Track Progress"
                text="Monitor the status of your reports and see real-time updates"
              />
              <Feature
                icon={<Shield />}
                title="Secure Platform"
                text="Your data is protected with enterprise-grade security"
              />
              <Feature
                icon={<Clock />}
                title="24/7 Availability"
                text="Report issues anytime, day or night – we never close"
              />
              <Feature
                icon={<Target />}
                title="Priority System"
                text="Critical issues get fast-tracked for immediate attention"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between">
            <Stat icon={<Users />} value="2,500+" label="Active Users" />
            <Stat
              icon={<CheckCircle />}
              value="1,200+"
              label="Issues Resolved"
            />
            <Stat icon={<Star />} value="98%" label="Satisfaction Rate" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center bg-gray-100 p-8">
          <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>

            <p className="text-gray-500 text-sm mb-8">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-600 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-green-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0f7a4f] text-white py-3 rounded-lg font-semibold hover:bg-[#0c6641] transition"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-green-700 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              Secure & encrypted connection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: ReactNode;
  title: string;
  text: string;
}

function Feature({ icon, title, text }: FeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-green-200">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-green-200 text-sm">{text}</p>
      </div>
    </div>
  );
}

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="text-center">
      <div className="text-green-200 mx-auto mb-2">{icon}</div>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-green-200 text-sm">{label}</p>
    </div>
  );
}

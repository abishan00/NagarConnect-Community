"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  UserPlus,
  Clock,
  Lock,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRegistrationMutation } from "@/redux/services/authApi";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    citizenNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { isLoading }] = useRegistrationMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      citizenNumber,
      password,
      confirmPassword,
    } = formData;

    // Basic validations
    if (
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !phoneNumber ||
      !citizenNumber ||
      !password ||
      !confirmPassword
    ) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        citizenNumber,
        password,
        confirmPassword,
      }).unwrap();

      toast.success("Verification code sent to your email");

      localStorage.setItem("activation_token", res.activationToken);

      router.push("/auth/verify");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      <div className="w-full grid lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-between bg-[#0b6e4f] text-white p-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-white/10 rounded-full">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl leading-none">
                  Makola Community
                </h3>
                <p className="text-green-200 text-xs mt-1">
                  Issue Reporting Platform
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Join Our Growing Community
            </h1>
            <p className="text-green-100 text-lg mb-12">
              Become part of a movement that transforms neighborhoods. Your
              voice matters, and together we can create positive change in our
              community.
            </p>

            <div className="space-y-8">
              <Feature
                icon={<UserPlus size={20} />}
                title="Quick Registration"
                desc="Simple one-time setup to get you started in minutes"
              />
              <Feature
                icon={<Clock size={20} />}
                title="Instant Access"
                desc="Start reporting issues and tracking progress immediately"
              />
              <Feature
                icon={<Lock size={20} />}
                title="Privacy Protected"
                desc="Your personal information is secure and never shared"
              />
            </div>

            {/* How it works section */}
            <div className="mt-16 bg-black/10 p-8 rounded-xl border border-white/10">
              <p className="font-semibold mb-4 text-sm uppercase tracking-wider">
                How it works:
              </p>
              <ul className="space-y-4 text-sm text-green-50">
                <li className="flex gap-3 items-center">
                  <span className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                    1
                  </span>{" "}
                  Create your account with basic information
                </li>
                <li className="flex gap-3 items-center">
                  <span className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                    2
                  </span>{" "}
                  Verify your account via email
                </li>
                <li className="flex gap-3 items-center">
                  <span className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                    3
                  </span>{" "}
                  Start reporting and tracking community issues
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold">Join 2,500+ residents</h2>
            <p className="text-green-300">already making a difference</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 mb-10 text-sm">
              Join the community to report and track local issues
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  onChange={handleChange}
                />
                <Input
                  label="Lastname"
                  name="lastName"
                  placeholder="Enter your lastname"
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                placeholder="Enter your email address"
                onChange={handleChange}
              />

              <Input
                label="Address"
                name="address"
                placeholder="Enter your address"
                onChange={handleChange}
              />

              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                />
                <Input
                  label="Citizen Number"
                  name="citizenNumber"
                  placeholder="Enter your citizen number"
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                n
                className="w-full bg-[#00a669] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#008f5a] transition-all shadow-md mt-4"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#00a669] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 mt-8">
                  <Shield size={14} className="text-green-500" />
                  <span>Secure registration & data protection</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function Input({ label, name, placeholder, type = "text", onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#00a669] focus:ring-1 focus:ring-[#00a669] outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-base leading-none">{title}</h4>
        <p className="text-green-200 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

import { Users, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gray-100">
      <div className="container py-24 grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Building Stronger
            <br />
            <span className="text-green-600">Communities</span>
            <br />
            Together
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Report community issues, track progress, and collaborate with
            neighbors to create positive change. Your voice matters, and
            together we can build a better community.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/auth/register"
              className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition cursor-pointer inline-block"
            >
              Get Started Free
            </Link>

            <Link
              href="/about"
              className="border border-green-600 text-green-600 px-6 py-3 rounded-md font-medium hover:bg-green-50 transition cursor-pointer inline-block"
            >
              Learn More
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-12 grid grid-cols-4 gap-8 text-center">
            <div>
              <Users className="mx-auto text-green-600 mb-2" size={28} />
              <p className="text-xl font-semibold">1,247</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>

            <div>
              <AlertTriangle
                className="mx-auto text-green-600 mb-2"
                size={28}
              />
              <p className="text-xl font-semibold">339</p>
              <p className="text-sm text-gray-500">Issues Reported</p>
            </div>

            <div>
              <CheckCircle2 className="mx-auto text-green-600 mb-2" size={28} />
              <p className="text-xl font-semibold">220</p>
              <p className="text-sm text-gray-500">Issues Resolved</p>
            </div>

            <div>
              <TrendingUp className="mx-auto text-green-600 mb-2" size={28} />
              <p className="text-xl font-semibold">89%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="bg-green-200 p-8 rounded-2xl shadow-lg">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800">Street Light Broken</p>
            <p className="text-sm text-gray-500 mt-1">Main Road, Makola</p>

            <div className="mt-4 flex gap-3 text-xs font-medium">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                HIGH
              </span>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                IN PROGRESS
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-lg font-semibold">89</p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-lg font-semibold">23</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <p className="text-lg font-semibold">1.2K</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

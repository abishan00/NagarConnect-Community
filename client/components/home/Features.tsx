import { AlertTriangle, Users, TrendingUp, Shield } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="container text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900">
          Everything You Need for Community Management
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Our platform provides comprehensive tools for reporting, tracking, and
          resolving community issues efficiently.
        </p>

        {/* Cards */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
            <h3 className="mt-6 font-semibold text-gray-900">Report Issues</h3>
            <p className="mt-3 text-sm text-gray-500">
              Easily report community issues with photos, location, and detailed
              descriptions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-500" size={24} />
            </div>
            <h3 className="mt-6 font-semibold text-gray-900">
              Community Engagement
            </h3>
            <p className="mt-3 text-sm text-gray-500">
              Connect with neighbors, vote on issues, and collaborate on
              solutions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="mt-6 font-semibold text-gray-900">Track Progress</h3>
            <p className="mt-3 text-sm text-gray-500">
              Monitor the status of reported issues from submission to
              resolution.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="text-purple-500" size={24} />
            </div>
            <h3 className="mt-6 font-semibold text-gray-900">
              Admin Management
            </h3>
            <p className="mt-3 text-sm text-gray-500">
              Comprehensive admin tools for managing users, issues, and
              community oversight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div>
          <h2 className="text-white font-semibold text-lg">
            NagarConnect Community
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            Building stronger communities through collaborative issue reporting
            and resolution.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-medium mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="#about">About Us</Link>
            </li>
            <li>
              <Link href="#contact">Contact</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-medium mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Issue Reporting</li>
            <li>Community Engagement</li>
            <li>Progress Tracking</li>
            <li>Analytics & Insights</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-medium mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>info@nagarconnect.community</li>
            <li>+94 11 234 5678</li>
            <li>NagarConnect, Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center text-sm py-6 text-gray-500">
        © 2024 NagarConnect Community Platform. All rights reserved.
      </div>
    </footer>
  );
}

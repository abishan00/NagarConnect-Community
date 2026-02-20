"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { User } from "lucide-react";
import clsx from "clsx";
import { useGetUserQuery } from "@/redux/services/authApi";
import UserNotificationBell from "@/components/navbar/UserNotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const { data, isLoading } = useGetUserQuery();

  const isLoggedIn = !!data?.user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Create Issue", href: "/issue/create-issue" },
  ];

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md py-4"
          : "bg-white/80 backdrop-blur-md py-5",
      )}
    >
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          NagarConnect Community
        </Link>

        <div className="flex items-center gap-8 text-base font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "hover:text-green-600 transition",
                pathname === link.href
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700",
              )}
            >
              {link.name}
            </Link>
          ))}

          {!isLoading && (
            <>
              <UserNotificationBell userId={data.user._id} />
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={
                      data?.user?.avatar && data.user.avatar !== ""
                        ? data.user.avatar
                        : "/assets/avatar.png"
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-green-600 hover:scale-105 transition"
                  />
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

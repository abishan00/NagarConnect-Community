"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/redux/services/authApi";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading } = useGetUserQuery();

  const user = data?.user;

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/auth/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="flex">
      <AdminSidebar user={user} />
      <main className="ml-72 p-8 w-full bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}

"use client";


import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const router = useRouter();

  return (
    <div className="flex justify-end items-center mb-6">
      <button
        onClick={() => router.push("/admin/notifications")}
        className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer"
      >
      </button>
    </div>
  );
}

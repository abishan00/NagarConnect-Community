"use client";

import { useRouter } from "next/navigation";
import {
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/redux/services/notificationApi";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function AdminNotificationsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetMyNotificationsQuery(page);

  const [markAllAsRead] = useMarkAllAsReadMutation();

  if (isLoading) return <div>Loading...</div>;
  if (!data?.notifications) return <div>No Notifications</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      <button
        onClick={() => markAllAsRead()}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Mark All As Read
      </button>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {data.notifications.map((n: any) => (
          <div
            key={n._id}
            className="flex justify-between items-center border-b pb-4"
          >
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>

            {n.issue && (
              <button onClick={() => router.push(`/admin/issues/${n.issue}`)}>
                <Eye className="cursor-pointer" size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {[...Array(data.totalPages || 0)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

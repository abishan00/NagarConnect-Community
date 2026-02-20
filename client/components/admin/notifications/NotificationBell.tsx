"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/utils/socket";
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/services/notificationApi";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: apiNotifications = [] } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);

  // 🔥 ONLY set initial once
  useEffect(() => {
    setLiveNotifications(apiNotifications);
  }, [apiNotifications]);

  useEffect(() => {
    socket.emit("joinAdmin");
    socket.on("connect", () => {
      socket.emit("joinAdmin");
    });

    socket.on("newNotification", (data) => {
      setLiveNotifications((prev) => [
        {
          _id: data._id || Math.random().toString(),
          message: data.message,
          isRead: false,
        },
        ...prev,
      ]);

    audioRef.current?.play().catch(() => {});
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const unreadCount = liveNotifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setLiveNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div className="relative">
      <audio ref={audioRef} src="/assets/notification.mp3" />

      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl p-4 z-50">
          <h4 className="font-semibold mb-3">Recent Notifications</h4>

          {liveNotifications.slice(0, 5).map((n) => (
            <div
              key={n._id}
              className={`border-b py-3 text-sm ${
                !n.isRead ? "bg-gray-50 font-semibold" : ""
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => router.push("/admin/notifications")}
              >
                {n.message}
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="text-xs text-green-600 mt-1"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => router.push("/admin/notifications")}
            className="mt-3 text-green-600 text-sm font-semibold"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

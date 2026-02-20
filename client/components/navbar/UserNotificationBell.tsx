"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
import { useGetMyNotificationsQuery } from "@/redux/services/notificationApi";
import { useGetUserQuery } from "@/redux/services/authApi";

export default function NotificationBell() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { data: userData } = useGetUserQuery();
  const user = userData?.user;
  const { data: notifications = [] } = useGetMyNotificationsQuery();
  const [liveNotifications, setLiveNotifications] = useState(notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinUser", user._id);

    socket.on("newNotification", (data) => {
      setLiveNotifications((prev) => [
        {
          _id: data._id,
          title: data.title,
          message: data.message,
          isRead: false,
          createdAt: new Date().toISOString(),
          issue: data.issueId,
        },
        ...prev,
      ]);
      audioRef.current?.play().catch(() => {});
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user?._id]);

  const unreadCount = liveNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <audio ref={audioRef} src="/assets/notification.mp3" />

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

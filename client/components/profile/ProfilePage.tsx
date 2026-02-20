"use client";

import { useRef } from "react";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetUserQuery,
  useUpdateAvatarMutation,
} from "@/redux/services/authApi";

export default function ProfilePage() {
  const { data, refetch } = useGetUserQuery();
  const [updateAvatar] = useUpdateAvatarMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = data?.user;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        await updateAvatar({ avatar: reader.result as string }).unwrap();
        toast.success("Avatar updated");
        refetch();
      } catch (err: any) {
        toast.error("Failed to update avatar");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container py-20 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <div className="flex items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar || "https://via.placeholder.com/120"}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md cursor-pointer"
              >
                <Pencil size={16} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.firstName}
              </h2>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

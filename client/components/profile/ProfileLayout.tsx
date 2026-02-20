"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  useGetUserQuery,
  useUpdateUserInfoMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useLogoutMutation,
  useDeleteUserMutation,
} from "@/redux/services/authApi";
import SidebarProfile from "./SidebarProfile";

interface ApiError {
  data?: {
    message?: string;
  };
}

export default function ProfileLayout() {
  const { data, refetch } = useGetUserQuery();
  const user = data?.user;

  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [logout] = useLogoutMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [active, setActive] = useState("personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
    }
  }, [user]);

  const avatarSrc =
    user?.avatar && user.avatar.length > 10
      ? user.avatar
      : "/assets/avatar.png";

  const uploadAvatar = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateAvatar({ avatar: reader.result as string }).unwrap();
      toast.success("Avatar updated");
      refetch();
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser().unwrap();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container py-20 flex gap-10">
        <SidebarProfile
          active={active}
          setActive={setActive}
          user={user}
          onLogout={async () => {
            await logout().unwrap();
            window.location.href = "/";
          }}
        />

        <div className="flex-1 bg-white rounded-2xl shadow-xl p-10 relative">
          {active === "personal" && (
            <>
              <h2 className="text-2xl font-bold mb-8">Personal Information</h2>

              <div className="flex gap-10 mb-10 items-center">
                <div className="relative">
                  <Image
                    src={avatarSrc}
                    alt="User Avatar"
                    width={25}
                    height={25}
                    className=" w-35 h-35 rounded-full object-cover border"
                  />

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>

                  {user?.avatar && (
                    <button
                      onClick={async () => {
                        await updateAvatar({ avatar: "" }).unwrap();
                        toast.success("Avatar removed");
                        refetch();
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <input
                    ref={fileRef}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && uploadAvatar(e.target.files[0])
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={setFirstName}
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={setLastName}
                />
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition cursor-pointer"
                >
                  Delete Account
                </button>

                <button
                  onClick={async () => {
                    try {
                      await updateUserInfo({
                        firstName,
                        lastName,
                      }).unwrap();
                      toast.success("Profile updated");
                      refetch();
                    } catch (error) {
                      const err = error as ApiError;
                      toast.error(err?.data?.message || "Update failed");
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

          {active === "password" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Change Password</h2>

              <Input
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={setOldPassword}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <button
                onClick={async () => {
                  await updatePassword({
                    oldPassword,
                    newPassword,
                  }).unwrap();
                  toast.success("Password updated");
                  setOldPassword("");
                  setNewPassword("");
                }}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Update Password
              </button>
            </>
          )}
        </div>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle />
              <h3 className="font-bold text-lg">Delete Account</h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone. Your account and data will be removed permanently.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
      />
    </div>
  );
}

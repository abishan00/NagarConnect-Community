"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";


interface Props {
  active: string;
  setActive: (v: string) => void;
  user: any;
  onLogout: () => void;
}



export default function SidebarProfile({
  active,
  setActive,
  user,
  onLogout,
}: Props) {
  const avatar =
  user?.avatar && user.avatar.length > 10
  ? user.avatar
  : "/assets/avatar.png";
  const router = useRouter();

  return (
    <aside className="w-80 bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={avatar}
          alt="avatar"
          width={25}
          height={25}
          className="w-25 h-25 rounded-full border object-cover"
        />
        <h3 className="mt-3 font-bold text-lg">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <div className="space-y-2">
        <SidebarItem
          label="Personal Info"
          active={active === "personal"}
          onClick={() => setActive("personal")}
        />
        <SidebarItem
          label="Change Password"
          active={active === "password"}
          onClick={() => setActive("password")}
        />
        <SidebarItem
          label={`Your Problems (${user?.problems?.length || 0})`}
          active={active === "problems"}
          onClick={() => setActive("problems")}
        />

        {user?.role === "admin" && (
          <SidebarItem
            label="Admin Panel"
            active={false}
            onClick={() => router.push("/admin")}
          />
        )}

        <button
          onClick={onLogout}
          className="w-full text-left text-red-600 mt-6 cursor-pointer hover:underline"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left px-4 py-3 rounded-lg cursor-pointer transition",
        active
          ? "bg-green-100 text-green-700 font-semibold"
          : "hover:bg-gray-100",
      )}
    >
      {label}
    </button>
  );
}

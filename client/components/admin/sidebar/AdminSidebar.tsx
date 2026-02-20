"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useLogoutMutation } from "@/redux/services/authApi";
import toast from "react-hot-toast";

interface Props {
  user: any;
}

export default function AdminSidebar({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [logout] = useLogoutMutation();

  const [collapsed, setCollapsed] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openIssues, setOpenIssues] = useState(false);

  const avatar =
    user?.avatar && user.avatar.length > 10
      ? user.avatar
      : "/assets/avatar.png";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const NavItem = ({
    icon,
    label,
    path,
  }: {
    icon: React.ReactNode;
    label: string;
    path: string;
  }) => (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${
        pathname === path
          ? "bg-green-100 text-green-700 font-semibold"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {!collapsed && label}
    </button>
  );

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } bg-white shadow-lg fixed h-full p-4 transition-all flex flex-col`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 text-gray-600"
      >
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>

      {!collapsed && (
        <div className="flex flex-col items-center mb-6">
          <Image
            src={avatar}
            alt="avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border object-cover"
          />
          <h3 className="mt-3 font-bold">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-lg text-green-600 capitalize">{user?.role}</p>
        </div>
      )}

      {/* Dashboard */}
      <NavItem
        icon={<LayoutDashboard size={18} />}
        label="Dashboard"
        path="/admin"
      />

      {/* USERS */}
      <div className="mt-4">
        <button
          onClick={() => setOpenUsers(!openUsers)}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Users size={18} />
            {!collapsed && "Users"}
          </div>
          {!collapsed &&
            (openUsers ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </button>

        {openUsers && !collapsed && (
          <div className="ml-8 mt-2">
            <NavItem
              icon={<ChevronRight size={14} />}
              label="All Users"
              path="/admin/users"
            />
          </div>
        )}
      </div>

      {/* ISSUES */}
      <div className="mt-4">
        <button
          onClick={() => setOpenIssues(!openIssues)}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <ClipboardList size={18} />
            {!collapsed && "Issues"}
          </div>
          {!collapsed &&
            (openIssues ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </button>

        {openIssues && !collapsed && (
          <div className="ml-8 mt-2">
            <NavItem
              icon={<ChevronRight size={14} />}
              label="All Issues"
              path="/admin/issues/"
            />
          </div>
        )}
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/services/adminApi";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllUsersQuery({ search, page });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const openDeleteModal = (id: string) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser(selectedUserId).unwrap();
      toast.success("User deleted successfully");
    } catch {
      toast.error("Delete failed");
    }

    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRole({ id, role }).unwrap();
      toast.success("Role updated");
    } catch {
      toast.error("Role update failed");
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Users</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or citizen number"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md border px-4 py-3 rounded-lg"
        />
      </div>

      <div className="grid gap-6">
        {data?.users?.map((user: any) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">
                Citizen: {user.citizenNumber}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={() => openDeleteModal(user._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        {[...Array(data?.totalPages || 0)].map((_, i) => (
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle />
              <h3 className="font-bold text-lg">Delete User</h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUser}
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useGetMyIssuesQuery,
  useDeleteIssueMutation,
} from "@/redux/services/issueApi";
import Image from "next/image";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

export default function IssuesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyIssuesQuery(page);
  const [deleteIssue] = useDeleteIssueMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const openDeleteModal = (id: string) => {
    setSelectedIssueId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    if (!selectedIssueId) return;

    await deleteIssue(selectedIssueId);
    toast.success("Issue deleted successfully");

    setShowDeleteModal(false);
    setSelectedIssueId(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data?.issues) return <div>No Issues Found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">All Issues</h1>

      <div className="grid gap-4">
        {data.issues.map((issue: any) => (
          <div key={issue._id} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div
                onClick={() => router.push(`/admin/issues/${issue._id}`)}
                className="cursor-pointer"
              >
                <h2 className="text-lg font-semibold">{issue.title}</h2>
                <p className="text-sm text-gray-500">Status: {issue.status}</p>

                {issue.isOverdue && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                    Overdue
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Image
                  src={issue.citizen?.avatar || "/assets/avatar.png"}
                  alt="avatar"
                  width={10}
                  height={10}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <button
                  onClick={() => openDeleteModal(issue._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2">
        {[...Array(data.totalPages)].map((_, i) => (
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle />
              <h3 className="font-bold text-lg">Delete Issue</h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this issue? This action cannot be
              undone and the issue data will be permanently removed.
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
    </div>
  );
}

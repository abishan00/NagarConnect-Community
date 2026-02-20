"use client";

import { useParams } from "next/navigation";
import {
  useGetSingleIssueQuery,
  useUpdateIssueMutation,
} from "@/redux/services/issueApi";
import Image from "next/image";
import toast from "react-hot-toast";

export default function IssueDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleIssueQuery(id as string);
  const [updateIssue] = useUpdateIssueMutation();

  if (isLoading) return <div>Loading...</div>;
  if (!data?.issue) return null;

  const issue = data.issue;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold">{issue.title}</h1>

        <p className="text-gray-600">{issue.description}</p>

        {/* Status Section */}
        <div>
          <label className="font-semibold">Change Status</label>
          <select
            value={issue.status}
            onChange={async (e) => {
              await updateIssue({
                id: issue._id,
                body: { status: e.target.value },
              });
              toast.success("Status Updated");
            }}
            className="border p-2 mt-2 rounded-lg"
          >
            <option>Submitted</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </div>

        {/* Citizen Info Card */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-6">
          <Image
            src={issue.citizen?.avatar || "/assets/avatar.png"}
            alt="avatar"
            width={10}
            height={10}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold">
              {issue.citizen?.firstName} {issue.citizen?.lastName}
            </h2>
            <p className="text-gray-500">{issue.citizen?.email}</p>
            <p className="text-sm text-green-600 capitalize">
              {issue.citizen?.role}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Priority</p>
            <p>{issue.priorityLevel}</p>
          </div>

          <div>
            <p className="font-semibold">Department</p>
            <p>{issue.department}</p>
          </div>

          <div>
            <p className="font-semibold">Created At</p>
            <p>{new Date(issue.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="font-semibold">Overdue</p>
            <p>{issue.isOverdue ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

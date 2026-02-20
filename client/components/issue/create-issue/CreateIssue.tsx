"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "@/redux/services/authApi";
import { useCreateIssueMutation } from "@/redux/services/issueApi";
import toast from "react-hot-toast";

export default function CreateIssuePage() {
  const router = useRouter();
  const { data, isLoading } = useGetUserQuery();
  const [createIssue] = useCreateIssueMutation();

  const user = data?.user;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    urgency: 5,
    severity: 5,
    publicImpact: 5,
  });

  // 🔥 Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createIssue(form).unwrap();
      toast.success("Issue submitted successfully");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create issue");
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!user) return null;

  return (
    <section className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Create New Issue</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Category (Road, Garbage, Water)"
            className="w-full border p-3 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              min="1"
              max="10"
              value={form.urgency}
              onChange={(e) =>
                setForm({ ...form, urgency: Number(e.target.value) })
              }
              className="border p-3 rounded"
            />

            <input
              type="number"
              min="1"
              max="10"
              value={form.severity}
              onChange={(e) =>
                setForm({ ...form, severity: Number(e.target.value) })
              }
              className="border p-3 rounded"
            />

            <input
              type="number"
              min="1"
              max="10"
              value={form.publicImpact}
              onChange={(e) =>
                setForm({
                  ...form,
                  publicImpact: Number(e.target.value),
                })
              }
              className="border p-3 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </section>
  );
}

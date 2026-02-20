"use client";

import { useGetAdminStatsQuery } from "@/redux/services/dashboardApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea, Line } from "react-chartjs-2";
import NotificationBell from "../notifications/NotificationBell";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  Legend,
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthlyItem {
  _id: number;
  count: number;
}

interface IssueStatus {
  Submitted: number;
  Assigned: number;
  "In Progress": number;
  Resolved: number;
  Closed: number;
}

interface DashboardResponse {
  totalUsers: number;
  totalIssues: number;
  todayUsers: number;
  todayIssues: number;
  overdueIssues: number;
  issueStatus: IssueStatus;
  recentNotifications: { message: string }[];
  monthlyUsers: MonthlyItem[];
  monthlyIssues: MonthlyItem[];
}

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminStatsQuery() as {
    data: DashboardResponse | undefined;
    isLoading: boolean;
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  const userMonthlyData = Array(12).fill(0);
  data.monthlyUsers.forEach((item: MonthlyItem) => {
    userMonthlyData[item._id - 1] = item.count;
  });

  const issueMonthlyData = Array(12).fill(0);
  data.monthlyIssues.forEach((item: MonthlyItem) => {
    issueMonthlyData[item._id - 1] = item.count;
  });

  const polarData = {
    labels: ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        data: [
          data.issueStatus.Submitted,
          data.issueStatus.Assigned,
          data.issueStatus["In Progress"],
          data.issueStatus.Resolved,
          data.issueStatus.Closed,
        ],
        backgroundColor: [
          "#facc15",
          "#3b82f6",
          "#8b5cf6",
          "#22c55e",
          "#ef4444",
        ],
      },
    ],
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Users",
        data: userMonthlyData,
        borderColor: "#10b981",
        tension: 0.4,
      },
      {
        label: "Issues",
        data: issueMonthlyData,
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <NotificationBell />
      </div>

      <div className="grid grid-cols-6 gap-6 mb-10">
        <StatCard title="Total Users" value={data.totalUsers} />
        <StatCard title="Total Issues" value={data.totalIssues} />
        <StatCard title="Today Users" value={data.todayUsers} />
        <StatCard title="Today Issues" value={data.todayIssues} />
        <StatCard title="Overdue Issues" value={data.overdueIssues} />
        <StatCard title="Resolved" value={data.issueStatus.Resolved} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow h-105">
          <h2 className="font-semibold mb-4">Issue Status</h2>
          <PolarArea
            data={polarData}
            options={{ maintainAspectRatio: false }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow h-105">
          <h2 className="font-semibold mb-4">Yearly Growth</h2>
          <Line data={lineData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}


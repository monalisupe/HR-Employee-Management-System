
import { useEffect, useState } from "react";
import {
  Users,
//   UserCheck,
  BriefcaseBusiness,
  CalendarDays,
  RefreshCw,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
// import StatCard from "../../components/StatCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function HrDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCandidates: 0,
    openPositions: 0,
    upcomingInterviews: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/hr/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Unable to load dashboard (${response.status}).`);
      }

      const data = await response.json();

      setStats({
        totalEmployees: data.stats?.totalEmployees ?? 0,
        totalCandidates: data.stats?.totalCandidates ?? 0,
        openPositions: data.stats?.openPositions ?? 0,
        upcomingInterviews: data.stats?.upcomingInterviews ?? 0,
      });

      setRecentApplications(data.recentApplications ?? []);
      setInterviews(data.upcomingInterviewsList ?? []);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  let isMounted = true;

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/hr/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load dashboard (${response.status}).`
        );
      }

      const data = await response.json();

      if (!isMounted) return;

      setStats({
        totalEmployees: data.stats?.totalEmployees ?? 0,
        totalCandidates: data.stats?.totalCandidates ?? 0,
        openPositions: data.stats?.openPositions ?? 0,
        upcomingInterviews: data.stats?.upcomingInterviews ?? 0,
      });

      setRecentApplications(data.recentApplications ?? []);
      setInterviews(data.upcomingInterviewsList ?? []);
    } catch (err) {
      if (isMounted) {
        setError(
          err.message || "Could not connect to the server."
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadDashboard();

  return () => {
    isMounted = false;
  };
}, []);

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: UserPlus,
    },
    {
      title: "Open Positions",
      value: stats.openPositions,
      icon: BriefcaseBusiness,
    },
    {
      title: "Upcoming Interviews",
      value: stats.upcomingInterviews,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-violet-600">
                HR MANAGEMENT
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                HR Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage employees, recruitment, and interviews in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Data
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={fetchDashboard}
                className="text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? "—" : stat.value}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Current system total
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Main dashboard content */}
          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Recent applications */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Recent Applications
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest candidate applications
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                  <Users size={20} />
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  Loading applications...
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                    <Users size={22} />
                  </div>
                  <p className="font-medium text-gray-700">
                    No applications yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Candidate applications will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentApplications.map((candidate, index) => (
                    <div
                      key={candidate._id || candidate.id || index}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {candidate.name || candidate.fullName || "Unnamed candidate"}
                        </p>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {candidate.position || candidate.jobTitle || "Position not specified"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                        {candidate.status || "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={() => window.location.assign("/hr/candidates")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  Manage Candidates
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Upcoming interviews */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Upcoming Interviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Scheduled candidate interviews
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                  <CalendarDays size={20} />
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  Loading interviews...
                </div>
              ) : interviews.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                    <CalendarDays size={22} />
                  </div>
                  <p className="font-medium text-gray-700">
                    No upcoming interviews
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Scheduled interviews will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {interviews.map((interview, index) => (
                    <div
                      key={interview._id || interview.id || index}
                      className="flex items-start gap-4 p-5"
                    >
                      <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                        <Clock size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">
                          {interview.candidateName ||
                            interview.candidate?.name ||
                            "Candidate"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {interview.position ||
                            interview.jobTitle ||
                            "Interview"}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          {interview.date
                            ? new Date(interview.date).toLocaleString()
                            : "Date not specified"}
                        </p>
                      </div>

                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-violet-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={() => window.location.assign("/hr/interviews")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  Manage Interviews
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-gray-400">
            HireFlow HR Management System
          </p>
        </main>
      </div>
    </div>
  );
}

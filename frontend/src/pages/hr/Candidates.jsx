
import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Eye,
  X,
  Filter,
  RefreshCw,
  UserRound,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const statuses = [
  "All",
  "Applied",
  "Shortlisted",
  "Selected",
  "Rejected",
];

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchCandidates() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/hr/candidates`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Unable to load candidates (${response.status}).`);
      }

      const data = await response.json();

      setCandidates(
        Array.isArray(data) ? data : data.candidates ?? []
      );
    } catch (err) {
      setError(err.message || "Could not load candidates.");
    } finally {
      setLoading(false);
    }
  }

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const name =
        candidate.name || candidate.fullName || "";
      const email = candidate.email || "";
      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText);

      const status = candidate.status || "Applied";
      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  async function updateCandidateStatus(candidate, newStatus) {
    const id = candidate._id || candidate.id;

    if (!id) {
      setError("Candidate ID is missing.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/hr/candidates/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to update status (${response.status}).`
        );
      }

      const data = await response.json();
      const updatedCandidate = data.candidate || {
        ...candidate,
        status: newStatus,
      };

      setCandidates((previous) =>
        previous.map((item) =>
          (item._id || item.id) === id
            ? { ...item, ...updatedCandidate, status: newStatus }
            : item
        )
      );

      setSelectedCandidate((previous) =>
        previous && (previous._id || previous.id) === id
          ? { ...previous, ...updatedCandidate, status: newStatus }
          : previous
      );
    } catch (err) {
      setError(err.message || "Could not update candidate status.");
    }
  }

  function getStatusStyle(status) {
    switch (status) {
      case "Selected":
        return "bg-green-50 text-green-700";
      case "Shortlisted":
        return "bg-violet-50 text-violet-700";
      case "Rejected":
        return "bg-red-50 text-red-700";
      case "Applied":
      default:
        return "bg-amber-50 text-amber-700";
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Heading */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-violet-600">
                HR MANAGEMENT
              </p>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Candidates
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage applications and track candidate progress.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCandidates}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Candidates
            </button>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Total Candidates
                </p>
                <Users className="text-violet-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {candidates.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Shortlisted
                </p>
                <UserRound className="text-violet-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {candidates.filter(
                  (candidate) => candidate.status === "Shortlisted"
                ).length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Selected</p>
                <Users className="text-green-600" size={21} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {candidates.filter(
                  (candidate) => candidate.status === "Selected"
                ).length}
              </p>
            </div>
          </div>

          {/* Search and filter */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by candidate name or email..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-500" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="min-w-40 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Statuses" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={fetchCandidates}
                className="text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Candidate table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Candidate List
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredCandidates.length} candidate(s) found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Loading candidates...
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Users size={26} />
                </div>

                <h3 className="font-semibold text-gray-900">
                  No candidates found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {error
                    ? "Check your backend connection and try again."
                    : "Load candidates from your backend, or change your search and filters."}
                </p>

                <button
                  type="button"
                  onClick={fetchCandidates}
                  className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Load Candidates
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Candidate
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Position
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Applied Date
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map((candidate, index) => (
                      <tr
                        key={candidate._id || candidate.id || index}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 font-semibold text-violet-700">
                              {(candidate.name ||
                                candidate.fullName ||
                                "C")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {candidate.name ||
                                  candidate.fullName ||
                                  "Unnamed candidate"}
                              </p>
                              <p className="mt-1 text-gray-500">
                                {candidate.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {candidate.position ||
                            candidate.jobTitle ||
                            candidate.appliedPosition ||
                            "Not specified"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {candidate.appliedAt ||
                          candidate.createdAt
                            ? new Date(
                                candidate.appliedAt ||
                                  candidate.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                              candidate.status || "Applied"
                            )}`}
                          >
                            {candidate.status || "Applied"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCandidate(candidate)
                            }
                            aria-label="View candidate details"
                            className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Candidate details modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="candidate-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2
                  id="candidate-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Candidate Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review candidate information and application status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close candidate details"
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Detail
                label="Name"
                value={
                  selectedCandidate.name ||
                  selectedCandidate.fullName ||
                  "Not provided"
                }
              />

              <Detail
                label="Email"
                value={selectedCandidate.email || "Not provided"}
              />

              <Detail
                label="Phone"
                value={selectedCandidate.phone || "Not provided"}
              />

              <Detail
                label="Position"
                value={
                  selectedCandidate.position ||
                  selectedCandidate.jobTitle ||
                  selectedCandidate.appliedPosition ||
                  "Not specified"
                }
              />

              <div>
                <label
                  htmlFor="candidate-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Application Status
                </label>

                <select
                  id="candidate-status"
                  value={selectedCandidate.status || "Applied"}
                  onChange={(event) =>
                    updateCandidateStatus(
                      selectedCandidate,
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  {statuses
                    .filter((status) => status !== "All")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  Status updates require the backend endpoint to be available.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

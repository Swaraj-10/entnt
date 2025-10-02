import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCandidateById } from "../../api/candidatesApi";

export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchCandidateById(id);
        setCandidate(data);
      } catch (e) {
        setErr(e.message || "Failed to load candidate");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading candidate...</p>;
  if (err) return <p className="text-red-500">{err}</p>;
  if (!candidate) return <p>Candidate not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        {candidate.name}
      </h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <p><span className="font-semibold">Email:</span> {candidate.email || "—"}</p>
        <p><span className="font-semibold">Role:</span> {candidate.role || "—"}</p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-0.5 rounded text-white ${
              candidate.status === "active" ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            {candidate.status}
          </span>
        </p>
        <p>
          <span className="font-semibold">Tags:</span>{" "}
          {candidate.tags?.length ? candidate.tags.join(", ") : "—"}
        </p>
      </div>

      <Link
        to="/candidates"
        className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back to Candidates
      </Link>
    </div>
  );
}

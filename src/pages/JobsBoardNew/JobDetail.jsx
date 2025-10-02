import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJobById } from "../../api/jobsApi";

export default function JobDetail() {
  const { id } = useParams();

  // ✅ Fetch job details
  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
  });

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-8">Loading job details...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-8">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>

      <p className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`px-2 py-1 rounded text-white ${
            job.status === "active" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {job.status}
        </span>
      </p>

      <p className="mb-2">
        <span className="font-semibold">Slug:</span> {job.slug}
      </p>

      {job.tags && job.tags.length > 0 && (
        <p className="mb-2">
          <span className="font-semibold">Tags:</span>{" "}
          {job.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-block bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-200 px-2 py-1 rounded mr-2"
            >
              {tag}
            </span>
          ))}
        </p>
      )}

      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">Created:</span>{" "}
        {job.createdAt || "N/A"}
      </p>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">Updated:</span>{" "}
        {job.updatedAt || "N/A"}
      </p>

      <Link
        to="/jobs"
        className="inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Back to Jobs
      </Link>
    </div>
  );
}

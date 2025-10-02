import { db } from "../lib/dexieDB";

const API_URL = "/api/jobs";

// Fetch jobs with pagination
export async function fetchJobs(page = 1, pageSize = 5) {
  const res = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();

  data.jobs = data.jobs.map((job) => ({
    ...job,
    id: String(job.id),
  }));

  return data; // { jobs, totalPages }
}

export async function fetchJobById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

export async function createJob(job) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create job");
  }
  const data = await res.json();
  await db.jobs.put(data);
  return data;
}

export async function updateJob(job) {
  const res = await fetch(`${API_URL}/${job.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to update job");
  }
  const data = await res.json();
  await db.jobs.put(data);
  return data;
}

export async function toggleArchive(job) {
  const updated = {
    ...job,
    status: job.status === "active" ? "archived" : "active",
  };
  return updateJob(updated);
}

export async function reorderJobs({ id, newOrder }) {
  const res = await fetch(`${API_URL}/${id}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toOrder: newOrder }),
  });
  if (!res.ok) throw new Error("Failed to reorder job");
  return res.json();
}

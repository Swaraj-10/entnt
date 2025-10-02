// src/api/candidatesApi.js
const API_URL = "/api/candidates";

// Robust JSON parse that accepts either array or {candidates: [...]}
async function parse(res) {
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data?.candidates ?? data;
}

// List
export async function fetchCandidates() {
  const res = await fetch(API_URL);
  return parse(res);
}

// Detail
export async function fetchCandidateById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch candidate");
  return res.json();
}

// Create
export async function createCandidate(candidate) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!res.ok) throw new Error("Failed to create candidate");
  return res.json();
}

// Update
export async function updateCandidate(candidate) {
  const res = await fetch(`${API_URL}/${candidate.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!res.ok) throw new Error("Failed to update candidate");
  return res.json();
}

// Delete
export async function deleteCandidate(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete candidate");
  return res.json();
}

// Toggle archive/unarchive (exact name expected by your UI)
export async function toggleCandidateArchive(candidate) {
  const updated = {
    ...candidate,
    status: candidate.status === "active" ? "archived" : "active",
  };
  return updateCandidate(updated);
}

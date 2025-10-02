import { useState, useEffect } from "react";

export default function JobForm({ onSubmit, editingJob, clearEdit }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  // Load values if editing
  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title);
      setTags(editingJob.tags?.join(", ") || "");
      setSlug(editingJob.slug || "");
    } else {
      setTitle("");
      setTags("");
      setSlug("");
      setError("");
    }
  }, [editingJob]);

  // Generate slug when title changes
  useEffect(() => {
    if (!editingJob) {
      const newSlug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""); // remove invalid chars
      setSlug(newSlug);
    }
  }, [title, editingJob]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("⚠️ Title is required");
      return;
    }
    if (!slug.trim()) {
      setError("⚠️ Slug could not be generated");
      return;
    }

    const job = {
      title: title.trim(),
      slug,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      status: editingJob ? editingJob.status : "active",
      id: editingJob ? editingJob.id : Date.now(),
    };

    onSubmit(job);
    clearEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Job Title"
        className="px-3 py-2 border rounded text-black"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="px-3 py-2 border rounded text-black"
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug"
        className="px-3 py-2 border rounded text-black"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {editingJob ? "Update" : "Create"}
      </button>
      {editingJob && (
        <button
          type="button"
          onClick={clearEdit}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      )}

      {error && <p className="text-red-500 ml-2">{error}</p>}
    </form>
  );
}

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import JobItem from "../../components/JobItem";
import Pagination from "../../components/Pagination";
import JobForm from "./JobForm";
import Toast from "../../components/Toast";
import {
  fetchJobs,
  createJob,
  updateJob,
  toggleArchive,
  reorderJobs,
} from "../../api/jobsApi";

export default function JobsBoardNew() {
  const queryClient = useQueryClient();

  // state
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // fetch jobs
  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => fetchJobs(page, 5),
    keepPreviousData: true,
  });

  // mutations
  const mutationCreate = useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    onError: () => setToast({ message: "❌ Failed to create job", type: "error" }),
  });

  const mutationUpdate = useMutation({
    mutationFn: updateJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    onError: () => setToast({ message: "❌ Failed to update job", type: "error" }),
  });

  const mutationArchive = useMutation({
    mutationFn: toggleArchive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    onError: () => setToast({ message: "❌ Failed to archive job", type: "error" }),
  });

  const mutationReorder = useMutation({
    mutationFn: reorderJobs,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    onError: () =>
      setToast({ message: "⚠️ Reorder failed, rolling back", type: "error" }),
  });

  // dnd setup
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = jobsData.jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobsData.jobs.findIndex((j) => j.id === over.id);

    const reordered = arrayMove(jobsData.jobs, oldIndex, newIndex);
    queryClient.setQueryData(["jobs", page], { ...jobsData, jobs: reordered });

    mutationReorder.mutate({ id: active.id, newOrder: newIndex });
  };

  // filters
  const filteredJobs =
    jobsData?.jobs
      ?.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      ?.filter((job) =>
        statusFilter === "all" ? true : job.status === statusFilter
      ) || [];

  return (
    <div className="space-y-6">
      {/* Header + Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Jobs Board
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded text-black"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded text-black"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <JobForm
          onSubmit={(job) =>
            editingJob
              ? mutationUpdate.mutate({ ...editingJob, ...job })
              : mutationCreate.mutate(job)
          }
          editingJob={editingJob}
          clearEdit={() => setEditingJob(null)}
        />
      </div>

      {/* Jobs List */}
      {isLoading && <p className="text-gray-500">Loading jobs...</p>}
      {error && <p className="text-red-500">Error loading jobs</p>}
      {!isLoading && filteredJobs.length === 0 && (
        <p className="text-gray-500">No jobs found.</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredJobs} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onEdit={setEditingJob}
                onArchive={(j) => mutationArchive.mutate(j)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={jobsData?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

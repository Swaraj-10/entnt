import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ Your folders: capital C for Components, and CandidatesNew page folder
import CandidateItem from "../../Components/CandidateItem";
import CandidateForm from "./CandidateForm";
import Toast from "../../Components/Toast";

import {
  fetchCandidates,
  createCandidate,
  updateCandidate,
  toggleCandidateArchive,
} from "../../api/candidatesApi";

export default function CandidatesNew() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Load candidates
  const {
    data: candidates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });

  // Create
  const createMut = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setToast({ message: "Candidate created successfully!", type: "success" });
    },
    onError: () =>
      setToast({ message: "Failed to create candidate", type: "error" }),
  });

  // Update
  const updateMut = useMutation({
    mutationFn: updateCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setToast({ message: "Candidate updated successfully!", type: "success" });
    },
    onError: () =>
      setToast({ message: "Failed to update candidate", type: "error" }),
  });

  // Archive / Unarchive
  const archiveMut = useMutation({
    mutationFn: toggleCandidateArchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setToast({ message: "Candidate status updated!", type: "success" });
    },
    onError: () =>
      setToast({ message: "Failed to update candidate status", type: "error" }),
  });

  const handleSubmit = (formValues) => {
    if (editingCandidate) {
      updateMut.mutate({ ...editingCandidate, ...formValues });
      setEditingCandidate(null);
    } else {
      createMut.mutate(formValues);
    }
  };

  if (isLoading) return <p>Loading candidates...</p>;
  if (error) return <p className="text-red-500">Error loading candidates</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidates</h2>
        <CandidateForm
          onSubmit={handleSubmit}
          editingCandidate={editingCandidate}
          clearEdit={() => setEditingCandidate(null)}
        />
      </div>

      {candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <CandidateItem
              key={candidate.id}
              candidate={candidate}
              onEdit={setEditingCandidate}
              onArchive={(c) => archiveMut.mutate(c)}
            />
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

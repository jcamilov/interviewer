"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Candidate {
  candidate_id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  cv: string;
  status: string;
  job_description_id: string | null;
}

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    const { data, error } = await supabase
      .from("candidates")
      .select(
        `
        *,
        job_descriptions (
          name
        )
      `
      )
      .order("name", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      const transformedData = data.map((candidate: any) => ({
        ...candidate,
        job_description_name: candidate.job_descriptions?.name || null,
      }));
      setCandidates(transformedData);
    }
  }

  const handleSelect = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map((c) => c.candidate_id)));
    }
  };

  const handleDelete = async () => {
    if (selectedCandidates.size === 0) return;

    try {
      // First, get the CV URLs for the selected candidates
      const { data: selectedCandidateData, error: fetchError } = await supabase
        .from("candidates")
        .select("candidate_id, cv")
        .in("candidate_id", Array.from(selectedCandidates));

      if (fetchError) {
        console.error("Error fetching candidate data:", fetchError);
        return;
      }

      // Delete CV files from storage for each candidate
      for (const candidate of selectedCandidateData) {
        if (candidate.cv) {
          // Extract the path from the URL
          const fileUrl = new URL(candidate.cv);
          const filePath = fileUrl.pathname.split("/").pop();
          if (filePath) {
            const { error: storageError } = await supabase.storage
              .from("user-files")
              .remove([filePath]);

            if (storageError) {
              console.error("Error deleting CV file:", storageError);
            }
          }
        }
      }

      // Then delete the candidate records
      const { error } = await supabase
        .from("candidates")
        .delete()
        .in("candidate_id", Array.from(selectedCandidates));

      if (error) {
        console.error("Error deleting candidates:", error);
        return;
      }

      setSelectedCandidates(new Set());
      fetchCandidates();
    } catch (error) {
      console.error("Error in delete operation:", error);
    }
  };

  const handleAssignJobDescription = async (candidateId: string) => {
    // Navigate to the edit page where we can assign the job description
    router.push(`/dashboard/candidates/${candidateId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <div className="space-x-2">
          {selectedCandidates.size > 0 && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Selected
            </Button>
          )}
          {selectedCandidates.size === 1 && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/candidates/${Array.from(selectedCandidates)[0]}`
                )
              }
            >
              Edit
            </Button>
          )}
          <Button onClick={() => router.push("/dashboard/candidates/new")}>
            New Candidate
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>CV</th>
                <th>Status</th>
                <th>Job Description</th>
                <th>Actions</th>
                <th>
                  <Checkbox
                    checked={
                      selectedCandidates.size === candidates.length &&
                      candidates.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate.candidate_id}
                  className="bg-gray-100 hover:bg-gray-200 text-black"
                >
                  <td className="truncate max-w-[200px]">
                    {candidate.last_name}, {candidate.name}
                  </td>
                  <td className="truncate max-w-[200px]">{candidate.email}</td>
                  <td className="truncate max-w-[150px]">
                    {candidate.phone_number}
                  </td>
                  <td>
                    <a
                      href={candidate.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </td>
                  <td>{candidate.status}</td>
                  <td>{candidate.job_description_id || "Not assigned"}</td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAssignJobDescription(candidate.candidate_id)
                      }
                      title="Assign Job Description"
                    >
                      Assign
                    </Button>
                  </td>
                  <td>
                    <Checkbox
                      checked={selectedCandidates.has(candidate.candidate_id)}
                      onCheckedChange={() =>
                        handleSelect(candidate.candidate_id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

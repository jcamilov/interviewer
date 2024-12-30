"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { DocumentTextIcon, UserPlusIcon } from "@heroicons/react/24/outline";

interface Candidate {
  candidate_id: string;
  last_name: string;
  name: string;
  interview_id: string | null;
  interview_name: string | null;
  interview_session_id: string | null;
  session_status: string | null;
  status: string;
}

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCandidates();
  }, [showArchived]);

  async function fetchCandidates() {
    const query = supabase
      .from("candidates")
      .select(
        `
        *,
        interview_sessions (
          interview_session_id,
          status,
          interview_id,
          interviews!interview_sessions_interview_id_fkey (
            name
          )
        )
      `
      )
      .order("last_name", { ascending: true });

    // Apply status filter based on showArchived toggle
    if (!showArchived) {
      query.eq("status", "active");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      const transformedData = data?.map((candidate) => ({
        ...candidate,
        interview_session_id:
          candidate.interview_sessions?.[0]?.interview_session_id || null,
        session_status:
          candidate.interview_sessions?.[0]?.status || "No interview assigned",
        interview_id: candidate.interview_sessions?.[0]?.interview_id || null,
        interview_name:
          candidate.interview_sessions?.[0]?.interviews?.name || null,
      }));
      setCandidates(transformedData || []);
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

  const handleAssignInterview = async (candidateId: string) => {
    // Navigate to the edit page where we can assign the interview
    router.push(`/dashboard/candidates/${candidateId}`);
  };

  const handleArchive = async () => {
    if (selectedCandidates.size === 0) return;

    // Show confirmation dialog for multiple archives
    if (selectedCandidates.size > 1) {
      const confirmed = window.confirm(
        `Are you sure you want to archive ${selectedCandidates.size} candidates? You can restore them later from the archive.`
      );
      if (!confirmed) return;
    }

    const { error } = await supabase
      .from("candidates")
      .update({ status: "archived" })
      .in("candidate_id", Array.from(selectedCandidates));

    if (error) {
      console.error("Error archiving candidates:", error);
      return;
    }

    setSelectedCandidates(new Set());
    fetchCandidates();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Candidates</h1>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={showArchived}
              onCheckedChange={(checked) => setShowArchived(checked as boolean)}
              id="show-archived"
            />
            <label htmlFor="show-archived" className="text-sm text-gray-600">
              Show archived candidates
            </label>
          </div>
        </div>
        <div className="space-x-2">
          {selectedCandidates.size > 0 && (
            <Button variant="destructive" onClick={handleArchive}>
              Archive Selected
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
                <th>Full Name</th>
                <th>Interview Status</th>
                <th className="w-24">Actions</th>
                <th>Interview Name</th>
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
                  <td className="truncate max-w-[150px]">
                    {candidate.session_status}
                  </td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Handle view report
                      }}
                      className="p-1 hover:bg-gray-300 rounded"
                      title="View Report"
                      disabled={!candidate.interview_session_id}
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleAssignInterview(candidate.candidate_id)
                      }
                      className="p-1 hover:bg-gray-300 rounded"
                      title="Assign Interview"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="truncate max-w-[200px]">
                    {candidate.interview_name || "Not assigned"}
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

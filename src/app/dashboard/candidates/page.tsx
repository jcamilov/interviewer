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
  interview_status: string;
  interview_name: string;
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
      .select("*")
      .order("last_name", { ascending: true });

    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      console.log("Fetched candidates:", data);
    }

    setCandidates(data || []);
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
                    {candidate.interview_status}
                  </td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Handle view report
                      }}
                      className="p-1 hover:bg-gray-300 rounded"
                      title="View Report"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        // Handle assign interview
                      }}
                      className="p-1 hover:bg-gray-300 rounded"
                      title="Assign Interview"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="truncate max-w-[200px]">
                    {candidate.interview_name}
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

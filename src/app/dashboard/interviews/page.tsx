"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface Interview {
  interview_id: string;
  created_at: string;
  expires_at: string;
  status: "pending" | "active" | "completed" | "expired";
  link: string;
}

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterviews, setSelectedInterviews] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchInterviews();
  }, []);

  async function fetchInterviews() {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching interviews:", error);
      return;
    }

    setInterviews(data || []);
  }

  const handleSelect = (interviewId: string) => {
    const newSelected = new Set(selectedInterviews);
    if (newSelected.has(interviewId)) {
      newSelected.delete(interviewId);
    } else {
      newSelected.add(interviewId);
    }
    setSelectedInterviews(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedInterviews.size === interviews.length) {
      setSelectedInterviews(new Set());
    } else {
      setSelectedInterviews(new Set(interviews.map((i) => i.interview_id)));
    }
  };

  const handleDelete = async () => {
    if (selectedInterviews.size === 0) return;

    const { error } = await supabase
      .from("interviews")
      .delete()
      .in("interview_id", Array.from(selectedInterviews));

    if (error) {
      console.error("Error deleting interviews:", error);
      return;
    }

    setSelectedInterviews(new Set());
    fetchInterviews();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interviews</h1>
        <div className="space-x-2">
          {selectedInterviews.size > 0 && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Selected
            </Button>
          )}
          {selectedInterviews.size === 1 && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/interview/edit/${Array.from(selectedInterviews)[0]}`
                )
              }
            >
              Edit
            </Button>
          )}
          <Button onClick={() => router.push("/dashboard/interview/new")}>
            New Interview
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] p-4 font-medium">
            <div>
              <Checkbox
                checked={
                  selectedInterviews.size === interviews.length &&
                  interviews.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </div>
            <div>Status</div>
            <div>Created</div>
            <div>Expires</div>
            <div>Link</div>
          </div>
        </div>

        <div className="divide-y">
          {interviews.map((interview) => (
            <div
              key={interview.interview_id}
              className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] p-4 hover:bg-gray-50"
            >
              <div>
                <Checkbox
                  checked={selectedInterviews.has(interview.interview_id)}
                  onCheckedChange={() => handleSelect(interview.interview_id)}
                />
              </div>
              <div className="capitalize">{interview.status}</div>
              <div>{new Date(interview.created_at).toLocaleDateString()}</div>
              <div>{new Date(interview.expires_at).toLocaleDateString()}</div>
              <div className="truncate">{interview.link}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

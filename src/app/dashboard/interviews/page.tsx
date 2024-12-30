"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface RawInterviewSession {
  interview_session_id: string;
  status: string;
  link: string;
  report: string;
  transcript: string;
  audio_interview: string;
  candidate: {
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    cv: string;
    status: string;
  } | null;
}

interface RawInterview {
  interview_id: string;
  name: string;
  job_description: string;
  additional_context: string;
  parsing_result: string;
  interview_sessions: RawInterviewSession[];
}

interface Interview {
  interview_id: string;
  name: string;
  job_description: string;
  additional_context: string;
  parsing_result: string;
  sessions: {
    interview_session_id: string;
    status: string;
    link: string;
    report: string;
    transcript: string;
    audio_interview: string;
    candidate: {
      name: string;
      last_name: string;
      email: string;
      phone_number: string;
      cv: string;
      status: string;
    } | null;
  }[];
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
      .select(
        `
        *,
        interview_sessions!interview_sessions_interview_id_fkey(
          interview_session_id,
          status,
          link,
          report,
          transcript,
          audio_interview,
          candidate:candidates(
            name,
            last_name,
            email,
            phone_number,
            cv,
            status
          )
        )
      `
      )
      .order("name", { ascending: false });

    if (error) {
      console.error("Error fetching interviews:", error);
    } else {
      console.log("Fetched interviews:", data);
      const transformedData = (data as RawInterview[])?.map((interview) => ({
        ...interview,
        sessions: interview.interview_sessions || [],
      }));
      setInterviews(transformedData || []);
    }
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
                  `/dashboard/interview/${Array.from(selectedInterviews)[0]}`
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
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Job Description</th>
                <th>Additional Context</th>
                <th>Sessions</th>
                <th>
                  <Checkbox
                    checked={
                      selectedInterviews.size === interviews.length &&
                      interviews.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr
                  key={interview.interview_id}
                  className="bg-gray-100 hover:bg-gray-200 text-black"
                >
                  <td className="truncate max-w-[200px]">{interview.name}</td>
                  <td className="truncate max-w-[300px]">
                    <a
                      href={interview.job_description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </td>
                  <td className="truncate max-w-[200px]">
                    <a
                      href={interview.additional_context}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </td>
                  <td className="truncate max-w-[200px]">
                    {interview.sessions
                      ?.map((session) => session.status || "Not assigned")
                      .join(", ") || "Not assigned"}
                  </td>
                  <td>
                    <Checkbox
                      checked={selectedInterviews.has(interview.interview_id)}
                      onCheckedChange={() =>
                        handleSelect(interview.interview_id)
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

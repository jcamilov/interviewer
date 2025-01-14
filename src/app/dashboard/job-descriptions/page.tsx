"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface RawJobDescriptionSession {
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
    cv: string;
    status: string;
  } | null;
}

interface RawJobDescription {
  job_description_id: string;
  name: string;
  job_description: string;
  additional_context: string;
  parsing_result: string;
  interview_sessions: RawJobDescriptionSession[];
}

interface JobDescription {
  job_description_id: string;
  name: string;
  file_url: string;
  additional_context: string;
  parsed_data: string;
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
      cv: string;
      status: string;
    } | null;
  }[];
}

export default function JobDescriptionList() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJobDescriptions, setSelectedJobDescriptions] = useState<
    Set<string>
  >(new Set());
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  async function fetchJobDescriptions() {
    try {
      const { data, error } = await supabase
        .from("job_descriptions")
        .select(
          `
          *,
          interview_sessions!interview_sessions_job_description_id_fkey(
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
              cv,
              status
            )
          )
        `
        )
        .order("name", { ascending: false });

      if (error) {
        console.error("Error fetching job descriptions:", error.message);
        return;
      }

      // Handle empty data case
      if (!data || data.length === 0) {
        setJobDescriptions([]);
        return;
      }

      const transformedData = (data as RawJobDescription[]).map(
        (jobDescription) => ({
          job_description_id: jobDescription.job_description_id,
          name: jobDescription.name,
          file_url: jobDescription.job_description,
          additional_context: jobDescription.additional_context,
          parsed_data: jobDescription.parsing_result,
          sessions:
            jobDescription.interview_sessions?.map((session) => ({
              ...session,
              job_description_id: session.interview_session_id,
            })) || [],
        })
      );

      setJobDescriptions(transformedData);
    } catch (err) {
      console.error("Unexpected error while fetching job descriptions:", err);
      setJobDescriptions([]);
    }
  }

  const handleSelect = (jobDescriptionId: string) => {
    const newSelected = new Set(selectedJobDescriptions);
    if (newSelected.has(jobDescriptionId)) {
      newSelected.delete(jobDescriptionId);
    } else {
      newSelected.add(jobDescriptionId);
    }
    setSelectedJobDescriptions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobDescriptions.size === jobDescriptions.length) {
      setSelectedJobDescriptions(new Set());
    } else {
      setSelectedJobDescriptions(
        new Set(jobDescriptions.map((i) => i.job_description_id))
      );
    }
  };

  const handleDelete = async () => {
    if (selectedJobDescriptions.size === 0) return;

    const { error } = await supabase
      .from("job_descriptions")
      .delete()
      .in("job_description_id", Array.from(selectedJobDescriptions));

    if (error) {
      console.error("Error deleting job descriptions:", error);
      return;
    }

    setSelectedJobDescriptions(new Set());
    fetchJobDescriptions();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Descriptions</h1>
        <div className="space-x-2">
          {selectedJobDescriptions.size > 0 && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Selected
            </Button>
          )}
          {selectedJobDescriptions.size === 1 && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/job-description/${Array.from(selectedJobDescriptions)[0]}`
                )
              }
            >
              Edit
            </Button>
          )}
          <Button onClick={() => router.push("/dashboard/job-description/new")}>
            New Job Description
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
                      selectedJobDescriptions.size === jobDescriptions.length &&
                      jobDescriptions.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {jobDescriptions.map((jobDescription) => (
                <tr
                  key={jobDescription.job_description_id}
                  className="bg-gray-100 hover:bg-gray-200 text-black"
                >
                  <td className="truncate max-w-[200px]">
                    {jobDescription.name}
                  </td>
                  <td className="truncate max-w-[300px]">
                    <a
                      href={jobDescription.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </td>
                  <td className="truncate max-w-[200px]">
                    <a
                      href={jobDescription.additional_context}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-blue-500 ${
                        jobDescription.additional_context ? "underline" : ""
                      }`}
                    >
                      {jobDescription.additional_context ? "Download" : "-"}
                    </a>
                  </td>
                  <td className="truncate max-w-[200px]">
                    {jobDescription.sessions
                      ?.map((session) => session.status || "Not assigned")
                      .join(", ") || "Not assigned"}
                  </td>
                  <td>
                    <Checkbox
                      checked={selectedJobDescriptions.has(
                        jobDescription.job_description_id
                      )}
                      onCheckedChange={() =>
                        handleSelect(jobDescription.job_description_id)
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

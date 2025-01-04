"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JobDescription {
  job_description_id: string;
  name: string;
}

export default function EditCandidate() {
  const { id: candidateId } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvUrl, setCurrentCvUrl] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJobDescription, setSelectedJobDescription] =
    useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidate();
    fetchJobDescriptions();
  }, [candidateId, supabase]);

  async function fetchJobDescriptions() {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("job_description_id, name")
      .order("name");

    if (error) {
      console.error("Error fetching job descriptions:", error);
      return;
    }

    setJobDescriptions(data || []);
  }

  async function fetchCandidate() {
    if (!candidateId) return;

    const { data, error } = await supabase
      .from("candidates")
      .select("*, job_description_sessions(job_description_id)")
      .eq("candidate_id", candidateId)
      .single();

    if (error) {
      console.error("Error fetching candidate:", error);
      return;
    }

    if (data) {
      setName(data.name);
      setLastName(data.last_name);
      setEmail(data.email);
      setPhoneNumber(data.phone_number);
      setCurrentCvUrl(data.cv);
      setSelectedJobDescription(
        data.job_description_sessions?.[0]?.job_description_id
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      const updates: any = {
        name,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
      };

      // Handle CV file update if provided
      if (cvFile) {
        const timestamp = Date.now();
        const cvExtension = cvFile.name.split(".").pop();
        const cvStoragePath = `${user.id}/cv_${candidateId}_${timestamp}.${cvExtension}`;

        const { error: cvUploadError } = await supabase.storage
          .from("candidates")
          .upload(cvStoragePath, cvFile);

        if (cvUploadError) {
          throw cvUploadError;
        }

        const {
          data: { publicUrl: cvPublicUrl },
        } = supabase.storage.from("candidates").getPublicUrl(cvStoragePath);

        updates.cv = cvPublicUrl;
      }

      // Update candidate record
      const { error: updateError } = await supabase
        .from("candidates")
        .update(updates)
        .eq("candidate_id", candidateId);

      if (updateError) {
        throw updateError;
      }

      // Handle job description assignment
      if (selectedJobDescription) {
        // Check if there's an existing session
        const { data: existingSession } = await supabase
          .from("job_description_sessions")
          .select("job_description_session_id")
          .eq("candidate_id", candidateId)
          .single();

        if (existingSession) {
          // Update existing session
          const { error: sessionUpdateError } = await supabase
            .from("job_description_sessions")
            .update({
              job_description_id: selectedJobDescription,
              status: "pending",
            })
            .eq(
              "job_description_session_id",
              existingSession.job_description_session_id
            );

          if (sessionUpdateError) {
            throw sessionUpdateError;
          }
        } else {
          // Create new session
          const { error: sessionCreateError } = await supabase
            .from("job_description_sessions")
            .insert({
              candidate_id: candidateId,
              job_description_id: selectedJobDescription,
              status: "pending",
            });

          if (sessionCreateError) {
            throw sessionCreateError;
          }
        }
      }

      router.push("/dashboard/candidates");
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Error updating candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="cv"
                className="block text-sm font-medium text-gray-700"
              >
                CV (PDF or DOCX)
              </label>
              {currentCvUrl && (
                <div className="mb-2">
                  <a
                    href={currentCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Current CV
                  </a>
                </div>
              )}
              <Input
                type="file"
                id="cv"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Assign Job Description
              </label>
              <select
                id="jobDescription"
                value={selectedJobDescription}
                onChange={(e) => setSelectedJobDescription(e.target.value)}
                className="select select-bordered w-full mt-1"
              >
                <option value="">Select a job description</option>
                {jobDescriptions.map((jd) => (
                  <option
                    key={jd.job_description_id}
                    value={jd.job_description_id}
                  >
                    {jd.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/candidates")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Candidate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

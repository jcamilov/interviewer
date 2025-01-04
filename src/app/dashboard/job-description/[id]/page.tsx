"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditJobDescription() {
  const { id: jobDescriptionId } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [name, setName] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(
    null
  );
  const [additionalContextFile, setAdditionalContextFile] =
    useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentJobDescriptionUrl, setCurrentJobDescriptionUrl] = useState("");
  const [currentAdditionalContextUrl, setCurrentAdditionalContextUrl] =
    useState("");

  useEffect(() => {
    fetchJobDescriptionData();
  }, [jobDescriptionId, supabase]);

  const fetchJobDescriptionData = async () => {
    if (!jobDescriptionId) return;

    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("job_description_id", jobDescriptionId)
      .single();

    if (error) {
      console.error("Error fetching job description data:", error);
      return;
    }

    if (data) {
      setName(data.name);
      setCurrentJobDescriptionUrl(data.job_description);
      setCurrentAdditionalContextUrl(data.additional_context);
    }
  };

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

      const timestamp = Date.now();
      const updates: any = { name };

      // Handle job description file update if provided
      if (jobDescriptionFile) {
        const jdExtension = jobDescriptionFile.name.split(".").pop();
        const jdStoragePath = `${user.id}/jd_${jobDescriptionId}_${timestamp}.${jdExtension}`;

        const { error: jdUploadError } = await supabase.storage
          .from("job_descriptions")
          .upload(jdStoragePath, jobDescriptionFile);

        if (jdUploadError) {
          throw jdUploadError;
        }

        const {
          data: { publicUrl: jdPublicUrl },
        } = supabase.storage
          .from("job_descriptions")
          .getPublicUrl(jdStoragePath);

        updates.job_description = jdPublicUrl;
      }

      // Handle additional context file update if provided
      if (additionalContextFile) {
        const acExtension = additionalContextFile.name.split(".").pop();
        const acStoragePath = `${user.id}/ac_${jobDescriptionId}_${timestamp}.${acExtension}`;

        const { error: acUploadError } = await supabase.storage
          .from("job_descriptions")
          .upload(acStoragePath, additionalContextFile);

        if (acUploadError) {
          throw acUploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("job_descriptions")
          .getPublicUrl(acStoragePath);

        updates.additional_context = publicUrl;
      }

      // Update job description record
      const { error: updateError } = await supabase
        .from("job_descriptions")
        .update(updates)
        .eq("job_description_id", jobDescriptionId);

      if (updateError) {
        throw updateError;
      }

      router.push("/dashboard/job-descriptions");
    } catch (error) {
      console.error("Error updating job description:", error);
      alert("Error updating job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
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
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description (PDF or DOCX)
              </label>
              {currentJobDescriptionUrl && (
                <div className="mb-2">
                  <a
                    href={currentJobDescriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Current Job Description
                  </a>
                </div>
              )}
              <Input
                type="file"
                id="jobDescription"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setJobDescriptionFile(e.target.files?.[0] || null)
                }
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="additionalContext"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Context (Optional)
              </label>
              {currentAdditionalContextUrl && (
                <div className="mb-2">
                  <a
                    href={currentAdditionalContextUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Current Additional Context
                  </a>
                </div>
              )}
              <Input
                type="file"
                id="additionalContext"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setAdditionalContextFile(e.target.files?.[0] || null)
                }
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/job-descriptions")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Job Description"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

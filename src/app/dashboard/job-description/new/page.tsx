"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export default function NewJobDescription() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const now = new Date();
  const defaultName = `JobDescription_${format(now, "ddMMyy_HHmm")}`;
  const [name, setName] = useState(defaultName);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(
    null
  );
  const [additionalContextFile, setAdditionalContextFile] =
    useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescriptionFile) {
      alert("Please upload a job description file");
      return;
    }
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      // Generate job description ID early as we'll need it for file names
      const jobDescriptionId = uuidv4();
      const timestamp = Date.now();

      // Upload job description file
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
      } = supabase.storage.from("job_descriptions").getPublicUrl(jdStoragePath);

      // Upload additional context file if provided
      let acPublicUrl = null;
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
        acPublicUrl = publicUrl;
      }

      // Create job description record
      const { error: insertError } = await supabase
        .from("job_descriptions")
        .insert({
          name,
          job_description: jdPublicUrl,
          additional_context: acPublicUrl,
          job_description_id: jobDescriptionId,
          status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      router.push("/dashboard/job-descriptions");
    } catch (error) {
      console.error("Error creating job description:", error);
      alert("Error creating job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Description</CardTitle>
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
              <Input
                type="file"
                id="jobDescription"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setJobDescriptionFile(e.target.files?.[0] || null)
                }
                required
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
                {loading ? "Creating..." : "Create Job Description"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

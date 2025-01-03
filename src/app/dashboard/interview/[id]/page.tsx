"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { SUPABASE_BUCKET_NAME } from "@/config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function EditInterview() {
  const { id: interviewId } = useParams();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<File[]>([]);
  const [additionalContextFiles, setAdditionalContextFiles] = useState<File[]>(
    []
  );
  const [parsingResult, setParsingResult] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchInterviewData = async () => {
      if (!interviewId) return;
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId)
        .single();

      if (error) {
        console.error("Error fetching interview data:", error);
        return;
      }

      if (data) {
        setName(data.name);
        setParsingResult(data.parsing_result || "");
        // Note: We don't set the files here as they're stored in Supabase storage
      }
    };

    fetchInterviewData();
  }, [interviewId, supabase]);

  const onDropJobDescription = (acceptedFiles: File[]) => {
    setJobDescriptionFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const onDropAdditionalContext = (acceptedFiles: File[]) => {
    setAdditionalContextFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const {
    getRootProps: getRootPropsJobDescription,
    getInputProps: getInputPropsJobDescription,
    isDragActive: isDragActiveJobDescription,
  } = useDropzone({ onDrop: onDropJobDescription });

  const {
    getRootProps: getRootPropsAdditionalContext,
    getInputProps: getInputPropsAdditionalContext,
    isDragActive: isDragActiveAdditionalContext,
  } = useDropzone({ onDrop: onDropAdditionalContext });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (jobDescriptionFiles.length > 1) {
      alert("Please upload at most one file for job description");
      setLoading(false);
      return;
    }

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    // Upload new files to Supabase bucket if they exist
    let jobDescriptionFileName = undefined;
    let additionalContextFileName = undefined;

    if (jobDescriptionFiles.length > 0) {
      const file = jobDescriptionFiles[0];
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(`${user.id}/${uuidv4()}-${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + file.name);
        setLoading(false);
        return;
      }
      jobDescriptionFileName = file.name;
    }

    if (additionalContextFiles.length > 0) {
      const file = additionalContextFiles[0];
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(`${user.id}/${uuidv4()}-${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + file.name);
        setLoading(false);
        return;
      }
      additionalContextFileName = file.name;
    }

    const updateData: any = {
      name,
    };

    if (jobDescriptionFileName) {
      updateData.job_description = jobDescriptionFileName;
    }
    if (additionalContextFileName) {
      updateData.additional_context = additionalContextFileName;
    }

    const { error } = await supabase
      .from("interviews")
      .update(updateData)
      .eq("interview_id", interviewId);

    setLoading(false);

    if (error) {
      console.error("Error updating interview:", error);
      return;
    }

    router.push("/dashboard/interviews");
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Edit Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label className="w-1/4">Job Description</Label>
                <div
                  {...getRootPropsJobDescription()}
                  className="border-dashed border-2 p-4 text-center w-3/4"
                >
                  <input {...getInputPropsJobDescription()} />
                  {isDragActiveJobDescription ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
              <ul>
                {jobDescriptionFiles.map((file) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center p-1"
                  >
                    <span className="truncate w-1/4">
                      {file.name.length > 20
                        ? `${file.name.substring(0, 17)}...`
                        : file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setJobDescriptionFiles((prevFiles) =>
                          prevFiles.filter((f) => f.name !== file.name)
                        );
                      }}
                      aria-label="Remove file"
                      className="btn btn-sm btn-error btn-square"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-4">
                <Label className="w-1/4">Additional Context</Label>
                <div
                  {...getRootPropsAdditionalContext()}
                  className="border-dashed border-2 p-4 text-center w-3/4"
                >
                  <input {...getInputPropsAdditionalContext()} />
                  {isDragActiveAdditionalContext ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
              <ul>
                {additionalContextFiles.map((file) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center p-1"
                  >
                    <span className="truncate w-1/4">
                      {file.name.length > 20
                        ? `${file.name.substring(0, 17)}...`
                        : file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalContextFiles((prevFiles) =>
                          prevFiles.filter((f) => f.name !== file.name)
                        );
                      }}
                      aria-label="Remove file"
                      className="btn btn-sm btn-error btn-square"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <Label>Parsing Results</Label>
                <div className="w-full h-24 bg-muted p-3 rounded-md">
                  {parsingResult || "No parsing results yet..."}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn btn-square btn-primary"
                  onClick={() => {}}
                >
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 mb-1" />
                    <span className="text-xs">Analyse</span>
                  </div>
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => router.push("/dashboard/interviews")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Interview"}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

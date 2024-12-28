"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { SUPABASE_BUCKET_NAME } from "@/config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

export default function NewInterview() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<File[]>([]);
  const [additionalContextFiles, setAdditionalContextFiles] = useState<File[]>(
    []
  );

  useEffect(() => {
    // Set default name on component mount
    const now = new Date();
    const defaultName = `Interview_${format(now, "ddMMyy_HHmm")}`;
    setName(defaultName);
  }, []);

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

    if (jobDescriptionFiles.length !== 1) {
      alert("Please upload exactly one file for job description");
      setLoading(false);
      return;
    }

    // Generate interview ID early as we'll need it for file names
    const interviewId = uuidv4();
    const timestamp = format(new Date(), "ddMMyy_HHmm");

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

    // Upload job description file with new naming convention
    const jdFile = jobDescriptionFiles[0];
    const jdExtension = jdFile.name.split(".").pop();
    const jdStoragePath = `${user.id}/jd_${interviewId}_${timestamp}.${jdExtension}`;

    const { error: jdError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(jdStoragePath, jdFile);

    if (jdError) {
      console.error("Error uploading job description file:", jdError);
      alert("Error uploading job description file");
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl: jdPublicUrl },
    } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(jdStoragePath);

    // Upload additional context file if it exists
    let acPublicUrl = null;

    if (additionalContextFiles.length > 0) {
      const acFile = additionalContextFiles[0];
      const acExtension = acFile.name.split(".").pop();
      const acStoragePath = `${user.id}/ac_${interviewId}_${timestamp}.${acExtension}`;

      const { error: acError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(acStoragePath, acFile);

      if (acError) {
        console.error("Error uploading additional context file:", acError);
        alert("Error uploading additional context file");
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .getPublicUrl(acStoragePath);

      acPublicUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          name: name,
          job_description: jdPublicUrl,
          additional_context: acPublicUrl,
          interview_id: interviewId,
        },
      ])
      .select();

    setLoading(false);

    if (error) {
      console.error("Error creating interview:", error);
      return;
    }

    router.push("/dashboard/interviews");
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Create New Interview</CardTitle>
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
                  Parsing results...
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
                  {loading ? "Creating..." : "Create Interview"}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

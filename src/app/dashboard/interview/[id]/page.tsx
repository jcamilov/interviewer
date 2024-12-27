"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { SUPABASE_BUCKET_NAME } from "@/config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EditInterview() {
  const { id: interviewId } = useParams();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [questions, setQuestions] = useState("");
  const [questionFiles, setQuestionFiles] = useState<File[]>([]);
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<File[]>([]);
  const [cvFiles, setCvFiles] = useState<File[]>([]);
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
        setStartDate(new Date(data.created_at));
        setExpirationDate(new Date(data.expires_at));
        setQuestions(data.questions);
        // Assume files are stored in a way that can be retrieved and set
      }

      console.log("Supabase response:", data, error);
    };

    fetchInterviewData();
  }, [interviewId, supabase]);

  const onDropQuestions = (acceptedFiles: File[]) => {
    setQuestionFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const onDropJobDescription = (acceptedFiles: File[]) => {
    setJobDescriptionFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const onDropCV = (acceptedFiles: File[]) => {
    setCvFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const {
    getRootProps: getRootPropsQuestions,
    getInputProps: getInputPropsQuestions,
    isDragActive: isDragActiveQuestions,
  } = useDropzone({ onDrop: onDropQuestions });
  const {
    getRootProps: getRootPropsJobDescription,
    getInputProps: getInputPropsJobDescription,
    isDragActive: isDragActiveJobDescription,
  } = useDropzone({ onDrop: onDropJobDescription });
  const {
    getRootProps: getRootPropsCV,
    getInputProps: getInputPropsCV,
    isDragActive: isDragActiveCV,
  } = useDropzone({ onDrop: onDropCV });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!startDate || !expirationDate) {
      alert("Please select both start and expiration dates");
      setLoading(false);
      return;
    }

    if (questionFiles.length !== 1) {
      alert("Please upload exactly one file for interview questions");
      setLoading(false);
      return;
    }

    if (jobDescriptionFiles.length !== 1) {
      alert("Please upload exactly one file for job description");
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

    // Upload files to Supabase bucket
    for (const file of questionFiles) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(`${user.id}/${uuidv4()}-${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + file.name);
        setLoading(false);
        return;
      }
    }

    for (const file of jobDescriptionFiles) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(`${user.id}/${uuidv4()}-${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + file.name);
        setLoading(false);
        return;
      }
    }

    for (const file of cvFiles) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(`${user.id}/${uuidv4()}-${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + file.name);
        setLoading(false);
        return;
      }
    }

    const { data, error } = await supabase
      .from("interviews")
      .update({
        created_at: startDate.toISOString(),
        expires_at: expirationDate.toISOString(),
        status: "pending",
        questions: questions,
      })
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
              <div className="flex justify-center space-x-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <DatePicker
                    date={expirationDate}
                    setDate={setExpirationDate}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Label className="w-1/4">Interview Questions</Label>
                <div
                  {...getRootPropsQuestions()}
                  className="border-dashed border-2 p-4 text-center w-3/4"
                >
                  <input {...getInputPropsQuestions()} />
                  {isDragActiveQuestions ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
              <ul>
                {questionFiles.map((file) => (
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
                        setQuestionFiles((prevFiles) =>
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
                <Label className="w-1/4">CV</Label>
                <div
                  {...getRootPropsCV()}
                  className="border-dashed border-2 p-4 text-center w-3/4"
                >
                  <input {...getInputPropsCV()} />
                  {isDragActiveCV ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
              <ul>
                {cvFiles.map((file) => (
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
                        setCvFiles((prevFiles) =>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

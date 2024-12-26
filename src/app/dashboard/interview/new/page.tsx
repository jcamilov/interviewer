"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { SUPABASE_BUCKET_NAME } from "@/config/config";

export default function NewInterview() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [questions, setQuestions] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!startDate || !expirationDate) {
      alert("Please select both start and expiration dates");
      setLoading(false);
      return;
    }

    if (!questions.trim()) {
      alert("Please enter interview questions");
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
    for (const file of files) {
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
      .insert([
        {
          created_at: startDate.toISOString(),
          expires_at: expirationDate.toISOString(),
          status: "pending",
          questions: questions,
          interviewee_id: uuidv4(),
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
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>

              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <DatePicker date={expirationDate} setDate={setExpirationDate} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">Interview Questions</Label>
                <Textarea
                  id="questions"
                  placeholder="Enter your interview questions here... (one question per line)"
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="min-h-[200px] resize-none"
                  required
                />
              </div>

              <div
                {...getRootProps()}
                className="border-dashed border-2 p-4 text-center"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>

              <div>
                <h4>Files:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li
                      key={file.name}
                      className="flex justify-between items-center"
                    >
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/interviews")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Interview"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { PlusIcon, ShareIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobDescription {
  job_description_id: string;
  name: string;
}

export default function NewCandidate() {
  const bucket = "user-files";
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  // Personal Data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [parsedCV, setParsedCV] = useState<Record<string, any>>({});
  const [selectedJobDescription, setSelectedJobDescription] =
    useState<string>("");

  // Interview Data
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // CV Upload
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [interviewLink, setInterviewLink] = useState<string>("");

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  async function fetchJobDescriptions() {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("job_description_id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching job descriptions:", error);
    } else {
      setJobDescriptions(data || []);
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCvFile(acceptedFiles[0]);

      // Send file to parse-cv endpoint
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      try {
        console.log("Sending file to API:", acceptedFiles[0].name);
        const response = await fetch("/api/parse-cv", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("CV Parse Response:", data);

        // populate the form fields with the parsed data from Eden AI
        setParsedCV(data.parsedData || {});
        setFirstName(data.parsedData?.personal_infos?.name?.first_name || "");
        setLastName(data.parsedData?.personal_infos?.name?.last_name || "");
        setEmail(data.parsedData?.personal_infos?.mails?.[0] || "");
        setProfile(data.parsedData?.personal_infos?.self_summary || "");
      } catch (error) {
        console.error("Error parsing CV:", error);
        // Add user feedback
        alert(
          "Failed to parse CV. Please try again or proceed with manual entry."
        );
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Starting form submission...");

    try {
      // Generate UUIDs
      const candidate_id = crypto.randomUUID();
      const interview_session_id = crypto.randomUUID();
      console.log("Generated IDs:", { candidate_id, interview_session_id });

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("User authentication error:", userError);
        throw userError;
      }
      if (!user) {
        console.error("No user found");
        throw new Error("User not authenticated");
      }
      console.log("User authenticated:", user.id);

      // Upload CV if present
      let cvUrl = null;
      if (cvFile) {
        console.log("Uploading CV file...");
        const fileExt = cvFile.name.split(".").pop();
        const fileName = `${user.id}/${candidate_id}/cv.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(fileName, cvFile);

        if (uploadError) {
          console.error("CV upload error:", uploadError);
          throw uploadError;
        }
        cvUrl = data.path;
        console.log("CV uploaded successfully:", cvUrl);
      }

      // Then create candidate record
      console.log("Creating candidate record...");
      const { error: candidateError } = await supabase
        .from("candidates")
        .insert([
          {
            candidate_id,
            name: firstName,
            last_name: lastName,
            email: email,
            cv: cvUrl,
            status: "active",
            job_description_id: selectedJobDescription || null,
            profile,
            parsed_cv: parsedCV,
          },
        ]);

      if (candidateError) {
        console.error("Error creating candidate:", candidateError);
        throw candidateError;
      }
      console.log("Candidate created successfully");

      // Create interview session
      console.log("Creating interview session...");
      const interviewLink = `https://candidates.super-recuit.com/${interview_session_id}`;
      const { error: sessionError } = await supabase
        .from("interview_sessions")
        .insert([
          {
            interview_session_id,
            status: selectedJobDescription
              ? "Prepared"
              : "No interview assigned",
            link: interviewLink,
            candidate_id,
            job_description_id: selectedJobDescription || null,
            report: null,
            transcript: null,
            audio_interview: null,
          },
        ]);

      if (sessionError) {
        console.error("Error creating interview session:", sessionError);
        throw sessionError;
      }
      console.log("Interview session created successfully");

      setInterviewLink(interviewLink);
      console.log("Redirecting to candidates dashboard...");
      router.push("/dashboard/candidates");
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("Error creating candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">New Candidate</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* CV Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>CV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
                  ${cvFile ? "bg-green-50" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-2">
                  <PlusIcon className="h-8 w-8 text-gray-400" />
                  {cvFile ? (
                    <p className="text-sm text-gray-600">{cvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Drag and drop your CV here
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, DOC, DOCX
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Data Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Profile</Label>
                <Input
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>(optional) Assign to a job opening</Label>
                <div className="flex gap-2">
                  <select
                    className="select select-bordered w-full"
                    value={selectedJobDescription}
                    onChange={(e) => setSelectedJobDescription(e.target.value)}
                  >
                    <option value="">Select Job Description</option>
                    {jobDescriptions.map((jobDescription) => (
                      <option
                        key={jobDescription.job_description_id}
                        value={jobDescription.job_description_id}
                      >
                        {jobDescription.name}
                      </option>
                    ))}
                  </select>
                  {interviewLink && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="px-2"
                          title="Share interview"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Interview Link</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <p className="text-sm text-gray-500">
                            Share this link with the candidate to start the
                            interview:
                          </p>
                          <div className="flex gap-2">
                            <Input
                              value={interviewLink}
                              readOnly
                              onClick={(e) => e.currentTarget.select()}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(interviewLink);
                                alert("Link copied to clipboard!");
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/candidates")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Candidate"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Interview {
  interview_id: string;
  name: string;
}

export default function EditCandidate() {
  const { id: candidateId } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  // Personal Data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();

  // Interview Data
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedInterview, setSelectedInterview] = useState<string>();

  // CV Upload
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
    fetchCandidateData();
  }, []);

  async function fetchInterviews() {
    const { data, error } = await supabase
      .from("interviews")
      .select("interview_id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching interviews:", error);
    } else {
      setInterviews(data || []);
    }
  }

  async function fetchCandidateData() {
    if (!candidateId) return;

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("candidate_id", candidateId)
      .single();

    if (error) {
      console.error("Error fetching candidate data:", error);
      return;
    }

    if (data) {
      setFirstName(data.name || "");
      setLastName(data.last_name || "");
      setEmail(data.email || "");
      setBirthDate(data.birth_date ? new Date(data.birth_date) : undefined);
      setSelectedInterview(data.interview_id || undefined);
      setStartDate(
        data.interview_start_date
          ? new Date(data.interview_start_date)
          : undefined
      );
      setEndDate(
        data.interview_end_date ? new Date(data.interview_end_date) : undefined
      );
      setExistingCvUrl(data.cv || null);
    }
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCvFile(acceptedFiles[0]);
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

    try {
      // Upload new CV if present
      let cvUrl = existingCvUrl;
      if (cvFile) {
        const fileExt = cvFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("cvs")
          .upload(fileName, cvFile);

        if (uploadError) throw uploadError;
        cvUrl = data.path;
      }

      // Update candidate record
      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          name: firstName,
          last_name: lastName,
          email: email,
          birth_date: birthDate?.toISOString(),
          interview_id: selectedInterview,
          cv: cvUrl,
        })
        .eq("candidate_id", candidateId);

      if (updateError) throw updateError;

      // Handle interview session
      if (selectedInterview) {
        // Check if candidate already has an interview session
        const { data: existingSession } = await supabase
          .from("interview_sessions")
          .select("interview_session_id")
          .eq("candidate_id", candidateId)
          .single();

        if (!existingSession) {
          // Create new interview session
          const { error: sessionError } = await supabase
            .from("interview_sessions")
            .insert([
              {
                status: "Prepared",
                link: `https://candidates.super-recruit.com/${candidateId}`,
                candidate_id: candidateId,
                interview_id: selectedInterview,
              },
            ]);

          if (sessionError) throw sessionError;
        } else {
          // Update existing session
          const { error: sessionError } = await supabase
            .from("interview_sessions")
            .update({
              interview_id: selectedInterview,
              status: "Prepared",
            })
            .eq("interview_session_id", existingSession.interview_session_id);

          if (sessionError) throw sessionError;
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
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Candidate</h1>
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
                  ${cvFile || existingCvUrl ? "bg-green-50" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-2">
                  <PlusIcon className="h-8 w-8 text-gray-400" />
                  {cvFile ? (
                    <p className="text-sm text-gray-600">{cvFile.name}</p>
                  ) : existingCvUrl ? (
                    <p className="text-sm text-gray-600">CV already uploaded</p>
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
                <Label>Birth Date</Label>
                <DatePicker date={birthDate} setDate={setBirthDate} />
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
              <div className="space-y-2">
                <Label>Assign interview</Label>
                <select
                  className="select select-bordered w-full"
                  value={selectedInterview}
                  onChange={(e) => setSelectedInterview(e.target.value)}
                >
                  <option value="">Select Interview</option>
                  {interviews.map((interview) => (
                    <option
                      key={interview.interview_id}
                      value={interview.interview_id}
                    >
                      {interview.name}
                    </option>
                  ))}
                </select>
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
              {loading ? "Updating..." : "Update Candidate"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

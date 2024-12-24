"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

export default function NewInterview() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [questions, setQuestions] = useState("");

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

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          created_at: startDate.toISOString(),
          expires_at: expirationDate.toISOString(),
          status: "pending",
          questions: questions,
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

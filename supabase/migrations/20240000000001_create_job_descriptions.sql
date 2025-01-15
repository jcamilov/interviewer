-- Create job descriptions table
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    job_description_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    questions jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'expired')),
    attachments jsonb,
    interviewee_id uuid REFERENCES public.users(id) NOT NULL,
    link text NOT NULL
);

-- Create job description sessions table
CREATE TABLE IF NOT EXISTS public.job_description_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_description_id uuid REFERENCES public.job_descriptions(job_description_id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_description_interviewee_id ON public.job_descriptions(interviewee_id);
CREATE INDEX IF NOT EXISTS idx_job_description_status ON public.job_descriptions(status);
CREATE INDEX IF NOT EXISTS idx_job_description_sessions_jd_id ON public.job_description_sessions(job_description_id);

-- Enable RLS
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_description_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for job descriptions
CREATE POLICY "Users can view their own job descriptions"
    ON public.job_descriptions
    FOR SELECT
    USING (auth.uid() = interviewee_id);

CREATE POLICY "Users can create their own job descriptions"
    ON public.job_descriptions
    FOR INSERT
    WITH CHECK (auth.uid() = interviewee_id);

CREATE POLICY "Users can update their own job descriptions"
    ON public.job_descriptions
    FOR UPDATE
    USING (auth.uid() = interviewee_id);

-- Create policies for job description sessions
CREATE POLICY "Users can view their own sessions"
    ON public.job_description_sessions
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.job_descriptions
        WHERE job_description_id = job_description_sessions.job_description_id
        AND interviewee_id = auth.uid()
    ));

CREATE POLICY "Users can create sessions for their job descriptions"
    ON public.job_description_sessions
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.job_descriptions
        WHERE job_description_id = job_description_sessions.job_description_id
        AND interviewee_id = auth.uid()
    )); 
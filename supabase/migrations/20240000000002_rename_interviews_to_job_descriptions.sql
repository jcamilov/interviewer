-- Rename interviews table to job_descriptions
ALTER TABLE public.interviews RENAME TO job_descriptions;

-- Rename interview_id column to job_description_id
ALTER TABLE public.job_descriptions RENAME COLUMN interview_id TO job_description_id;

-- Rename indexes
ALTER INDEX idx_interviewee_id RENAME TO idx_job_description_interviewee_id;
ALTER INDEX idx_status RENAME TO idx_job_description_status;

-- Update foreign key references in other tables
ALTER TABLE public.interview_sessions RENAME TO job_description_sessions;
ALTER TABLE public.job_description_sessions RENAME COLUMN interview_id TO job_description_id; 
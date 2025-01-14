-- Rename URL columns to path columns
ALTER TABLE job_descriptions 
  RENAME COLUMN file_url TO file_path;

ALTER TABLE candidates
  RENAME COLUMN cv TO cv_path;

-- Add appropriate comments
COMMENT ON COLUMN job_descriptions.file_path IS 'Storage path to the job description file';
COMMENT ON COLUMN candidates.cv_path IS 'Storage path to the candidate''s CV file'; 
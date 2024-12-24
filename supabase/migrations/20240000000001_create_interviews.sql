-- Create interviews table
create table if not exists public.interviews (
    interview_id uuid default gen_random_uuid() primary key,
    questions jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone not null,
    status text not null check (status in ('pending', 'active', 'completed', 'expired')),
    attachments jsonb,
    interviewee_id uuid references public.users(id) not null,
    link text not null
);

-- Add an index on interviewee_id for faster lookups
create index if not exists idx_interviewee_id on public.interviews(interviewee_id);

-- Add an index on status for faster filtering
create index if not exists idx_status on public.interviews(status); 
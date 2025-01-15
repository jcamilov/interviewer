-- Create tables first
CREATE TABLE IF NOT EXISTS public.users (
    id uuid references auth.users(id) primary key,
    email text not null,
    credits integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    full_name text,
    username text unique,
    website text,
    avatar_url text,
    bio text,
    updated_at timestamp with time zone,
    constraint username_length check (char_length(username) >= 3)
);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Now that tables exist, we can safely drop triggers and functions
DO $$ BEGIN
    -- Drop triggers if they exist
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_handle_updated_at') THEN
        DROP TRIGGER users_handle_updated_at ON public.users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_on_auth_user_created') THEN
        DROP TRIGGER users_on_auth_user_created ON auth.users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_credits_updated_at') THEN
        DROP TRIGGER update_user_credits_updated_at ON user_credits;
    END IF;
    
    -- Drop functions if they exist
    DROP FUNCTION IF EXISTS public.users_handle_updated_at();
    DROP FUNCTION IF EXISTS public.users_handle_new_user();
    DROP FUNCTION IF EXISTS update_user_credits_updated_at();
END $$;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- Create updated_at function
CREATE OR REPLACE FUNCTION public.users_handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language plpgsql;

-- Create function to create user record
CREATE OR REPLACE FUNCTION public.users_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email, credits)
    VALUES (new.id, new.email, 0)
    ON CONFLICT (id) DO UPDATE
    SET email = excluded.email;
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id)
    VALUES (new.id);
    
    -- Insert into user_credits table
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (new.id, 0);
    
    RETURN new;
END;
$$ language plpgsql security definer;

-- Create triggers for updated_at
CREATE TRIGGER users_handle_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.users_handle_updated_at();

CREATE TRIGGER users_handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.users_handle_updated_at();

CREATE TRIGGER users_handle_updated_at
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW
    EXECUTE FUNCTION public.users_handle_updated_at();

-- Create trigger for new user (create this last since it depends on the function)
CREATE TRIGGER users_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.users_handle_new_user();

-- Create policies for users table
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for user_credits table
CREATE POLICY "Users can view their own credits"
    ON user_credits FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
    ON user_credits FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
    ON user_credits FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions for user_credits
GRANT ALL ON user_credits TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_credits_id_seq TO authenticated; 
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own files" ON storage.objects;

-- Create policies for user-files bucket
-- Allow users to view their own files
CREATE POLICY "Allow authenticated users to select their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to upload files to their own folder
CREATE POLICY "Allow authenticated users to insert their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
CREATE POLICY "Allow authenticated users to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'user-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Allow authenticated users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
); 
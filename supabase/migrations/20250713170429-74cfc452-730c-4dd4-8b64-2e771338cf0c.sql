-- Create storage bucket for code files
INSERT INTO storage.buckets (id, name, public) VALUES ('code-files', 'code-files', false);

-- Create storage bucket for score reports
INSERT INTO storage.buckets (id, name, public) VALUES ('score-reports', 'score-reports', false);

-- Create storage policies for code files
CREATE POLICY "Users can upload their own code files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own code files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own code files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for score reports
CREATE POLICY "Users can upload their own score reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'score-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own score reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'score-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own score reports" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'score-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add new columns to ats_score_history table for file storage
ALTER TABLE public.ats_score_history 
ADD COLUMN code_file_url TEXT,
ADD COLUMN report_file_url TEXT,
ADD COLUMN keywords_matched TEXT[],
ADD COLUMN functionality_score INTEGER DEFAULT 0,
ADD COLUMN similarity_score DECIMAL(5,2) DEFAULT 0.00;
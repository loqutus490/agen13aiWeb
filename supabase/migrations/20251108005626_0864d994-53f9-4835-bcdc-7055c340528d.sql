-- Create table for storing download leads
CREATE TABLE public.download_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  downloaded_resource TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.download_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for lead capture)
CREATE POLICY "Anyone can submit download form"
ON public.download_leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Only authenticated users can view (for admin purposes)
CREATE POLICY "Authenticated users can view leads"
ON public.download_leads
FOR SELECT
TO authenticated
USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_download_leads_email ON public.download_leads(email);
CREATE INDEX idx_download_leads_created_at ON public.download_leads(created_at DESC);
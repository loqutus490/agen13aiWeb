-- Add RLS policies for rate_limits table
-- This table is accessed by edge functions using service role key
-- The service role bypasses RLS, but we need policies to explicitly deny public access

-- Policy to deny all public SELECT access
CREATE POLICY "Deny public read access on rate_limits" 
ON public.rate_limits 
FOR SELECT 
USING (false);

-- Policy to deny all public INSERT access
CREATE POLICY "Deny public insert access on rate_limits" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (false);

-- Policy to deny all public UPDATE access
CREATE POLICY "Deny public update access on rate_limits" 
ON public.rate_limits 
FOR UPDATE 
USING (false);

-- Policy to deny all public DELETE access
CREATE POLICY "Deny public delete access on rate_limits" 
ON public.rate_limits 
FOR DELETE 
USING (false);
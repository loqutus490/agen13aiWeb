-- Deny public INSERT access on download_leads
-- All legitimate inserts go through the submit-lead edge function using service role
CREATE POLICY "Deny public inserts on download_leads" 
ON public.download_leads 
FOR INSERT 
TO public
WITH CHECK (false);
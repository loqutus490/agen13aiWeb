-- Fix download_leads table security
-- Remove existing SELECT policies and replace with a single secure policy

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Deny public select on leads" ON public.download_leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.download_leads;

-- Create a single permissive policy that ONLY allows verified admins
-- Using has_role security definer function prevents privilege escalation
CREATE POLICY "Only verified admins can view leads"
ON public.download_leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Note: Anonymous users have no policy, so they get denied by default
-- Authenticated non-admin users fail the has_role check, so they're denied
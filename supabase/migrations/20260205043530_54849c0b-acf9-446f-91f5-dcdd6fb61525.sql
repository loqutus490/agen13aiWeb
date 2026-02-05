-- Add explicit UPDATE policy for user_roles table (defense in depth)
-- Only admins can update role assignments
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add explicit restrictive policies for download_leads to prevent UPDATE/DELETE
CREATE POLICY "Deny public updates on download_leads"
ON public.download_leads
FOR UPDATE
USING (false);

CREATE POLICY "Deny public deletes on download_leads"
ON public.download_leads
FOR DELETE
USING (false);
-- 1 & 2) Lock down SECURITY DEFINER functions: revoke PUBLIC/anon/authenticated EXECUTE where not required
-- cleanup_old_rate_limits is only called by internal cron (runs as owner), nobody should execute it directly
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies for authenticated users, so authenticated EXECUTE is required;
-- revoke it from anon/PUBLIC so signed-out callers cannot probe role membership
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- 3) Explicit storage policies for the public email-assets bucket:
-- allow public reads, restrict all writes to admins
DROP POLICY IF EXISTS "Public can read email assets" ON storage.objects;
CREATE POLICY "Public can read email assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'email-assets');

DROP POLICY IF EXISTS "Admins can upload email assets" ON storage.objects;
CREATE POLICY "Admins can upload email assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update email assets" ON storage.objects;
CREATE POLICY "Admins can update email assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete email assets" ON storage.objects;
CREATE POLICY "Admins can delete email assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

-- 4) Explicit deny of public updates on newsletter_subscribers (intent is clear, prevents future misconfig)
DROP POLICY IF EXISTS "Deny public updates on newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Deny public updates on newsletter_subscribers"
ON public.newsletter_subscribers FOR UPDATE
TO public
USING (false)
WITH CHECK (false);
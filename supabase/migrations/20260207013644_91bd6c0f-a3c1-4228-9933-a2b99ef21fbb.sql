-- Remove the public INSERT policy since we now use rate-limited edge function with service role
DROP POLICY IF EXISTS "Anyone can submit download form" ON public.download_leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.download_leads;
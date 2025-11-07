-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies needed since this table is only accessed by edge functions
-- Edge functions use service role key which bypasses RLS
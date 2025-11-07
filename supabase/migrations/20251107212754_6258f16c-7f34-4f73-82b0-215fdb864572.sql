-- Create rate_limits table for tracking IP-based request limits
CREATE TABLE IF NOT EXISTS public.rate_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);

-- Add function to clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This table doesn't need RLS policies as it's only accessed by edge functions
-- Edge functions run with service role privileges
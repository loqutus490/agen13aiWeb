
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny public access on contact_submissions"
  ON public.contact_submissions FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny public inserts on contact_submissions"
  ON public.contact_submissions FOR INSERT
  TO public
  WITH CHECK (false);

CREATE POLICY "Deny public updates on contact_submissions"
  ON public.contact_submissions FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny public deletes on contact_submissions"
  ON public.contact_submissions FOR DELETE
  TO public
  USING (false);

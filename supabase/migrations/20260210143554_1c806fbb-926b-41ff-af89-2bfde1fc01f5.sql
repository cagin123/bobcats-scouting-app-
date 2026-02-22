
-- Drop all existing restrictive policies on match_entries
DROP POLICY IF EXISTS "Authenticated users can read all match entries" ON public.match_entries;
DROP POLICY IF EXISTS "Admins can delete entries" ON public.match_entries;
DROP POLICY IF EXISTS "Anyone can insert match entries" ON public.match_entries;
DROP POLICY IF EXISTS "Anyone can update entries" ON public.match_entries;

-- Create permissive policies for anon access (file-based auth)
CREATE POLICY "Allow read all match entries"
  ON public.match_entries FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert match entries"
  ON public.match_entries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update match entries"
  ON public.match_entries FOR UPDATE TO anon, authenticated
  USING (true);

CREATE POLICY "Allow delete match entries"
  ON public.match_entries FOR DELETE TO anon, authenticated
  USING (true);

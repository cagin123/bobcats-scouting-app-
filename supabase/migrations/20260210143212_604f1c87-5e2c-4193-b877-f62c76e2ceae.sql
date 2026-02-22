
-- Drop foreign key constraint
ALTER TABLE public.match_entries DROP CONSTRAINT IF EXISTS match_entries_scouted_by_fkey;

-- Drop policies that depend on scouted_by
DROP POLICY IF EXISTS "Users can insert match entries" ON public.match_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.match_entries;

-- Change column type to text
ALTER TABLE public.match_entries ALTER COLUMN scouted_by TYPE text USING scouted_by::text;

-- Recreate open policies (file-based auth, no Supabase auth)
CREATE POLICY "Anyone can insert match entries"
  ON public.match_entries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update entries"
  ON public.match_entries FOR UPDATE
  USING (true);

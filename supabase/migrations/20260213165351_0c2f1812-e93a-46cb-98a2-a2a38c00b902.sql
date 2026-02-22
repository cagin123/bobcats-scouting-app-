
-- Add scouted_by_team column to track which team recorded the entry
ALTER TABLE public.match_entries ADD COLUMN scouted_by_team text NOT NULL DEFAULT '';

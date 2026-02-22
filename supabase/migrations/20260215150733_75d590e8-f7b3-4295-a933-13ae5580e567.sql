
-- Team users table (replaces users.json for auth)
CREATE TABLE public.team_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_number text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  display_name text,
  role text NOT NULL DEFAULT 'scout',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_number, username)
);

ALTER TABLE public.team_users ENABLE ROW LEVEL SECURITY;

-- Open policies since we use file-based auth (no Supabase Auth)
CREATE POLICY "Allow read team_users" ON public.team_users FOR SELECT USING (true);
CREATE POLICY "Allow insert team_users" ON public.team_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update team_users" ON public.team_users FOR UPDATE USING (true);
CREATE POLICY "Allow delete team_users" ON public.team_users FOR DELETE USING (true);

-- Regionals table (per team)
CREATE TABLE public.regionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_number text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_number, name)
);

ALTER TABLE public.regionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read regionals" ON public.regionals FOR SELECT USING (true);
CREATE POLICY "Allow insert regionals" ON public.regionals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete regionals" ON public.regionals FOR DELETE USING (true);

-- Seed initial users from users.json
INSERT INTO public.team_users (team_number, username, password, display_name, role) VALUES
('177', 'admin', 'admin123', 'Admin', 'admin'),
('177', 'scout1', 'scout123', 'Scout 1', 'scout');

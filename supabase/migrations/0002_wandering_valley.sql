/*
  # Create user statistics table

  1. New Tables
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievements` (integer)
      - `available_days` (integer)
      - `percentage` (decimal)
      - `required_for_hundred` (integer)
      - `daily_percentage` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_stats` table
    - Add policies for authenticated users to read/update their own data
*/

CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievements integer DEFAULT 0,
  available_days integer DEFAULT 22,
  percentage decimal DEFAULT 0,
  required_for_hundred integer DEFAULT 0,
  daily_percentage decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to initialize user stats
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create stats on profile creation
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_stats();
/*
  # Create month user clips table

  1. New Tables
    - `month_user`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `clip_id` (text, unique with user_id and clip_name)
      - `clip_name` (text, unique with user_id and clip_id)
      - `value` (integer)
      - `date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `month_user` table
    - Add policies for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS month_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  clip_id text NOT NULL,
  clip_name text NOT NULL,
  value integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, clip_id, clip_name)
);

ALTER TABLE month_user ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clips"
  ON month_user
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clips"
  ON month_user
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clips"
  ON month_user
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clips"
  ON month_user
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
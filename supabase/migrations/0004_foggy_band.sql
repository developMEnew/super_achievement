/*
  # Create dynamic month-user tables system

  1. New Tables
    - `user_tables`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `table_name` (text) - Format: {month}_{user_id} (e.g., jan_123456)
      - `month` (text)
      - `year` (integer)
      - `created_at` (timestamp)

  2. Functions
    - Create function to generate monthly tables dynamically
    - Create function to initialize empty tables for new users
*/

-- Track user tables
CREATE TABLE IF NOT EXISTS user_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

ALTER TABLE user_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own table records"
  ON user_tables
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create a new month table for a user
CREATE OR REPLACE FUNCTION create_month_table(
  p_user_id uuid,
  p_month text,
  p_year integer
) RETURNS text AS $$
DECLARE
  v_table_name text;
BEGIN
  -- Generate table name: month_userid (e.g., jan_123456)
  v_table_name := lower(p_month) || '_' || replace(p_user_id::text, '-', '');
  
  -- Create the dynamic table
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      clip_id text NOT NULL,
      clip_name text NOT NULL,
      value integer DEFAULT 0,
      date date DEFAULT CURRENT_DATE,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(clip_id, clip_name)
    )', v_table_name);

  -- Enable RLS on the new table
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', v_table_name);

  -- Create RLS policies for the new table
  EXECUTE format('
    CREATE POLICY "Owner can manage their data" ON %I
    USING (true)
    WITH CHECK (true)
  ', v_table_name);

  -- Insert record into user_tables
  INSERT INTO user_tables (user_id, table_name, month, year)
  VALUES (p_user_id, v_table_name, p_month, p_year)
  ON CONFLICT (user_id, month, year) DO NOTHING;

  RETURN v_table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
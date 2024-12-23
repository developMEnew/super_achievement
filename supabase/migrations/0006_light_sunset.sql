/*
  # Add month collections data tables

  1. New Tables
    - `month_collection_stats` - Stores achievement stats for each collection
      - `id` (uuid, primary key)
      - `collection_id` (uuid, references month_collections)
      - `achievements` (integer)
      - `available_days` (integer)
      - `percentage` (decimal)
      - `required_for_hundred` (integer)
      - `daily_percentage` (decimal)
      
    - `month_collection_clips` - Stores clips for each collection
      - `id` (uuid, primary key)
      - `collection_id` (uuid, references month_collections)
      - `clip_id` (text)
      - `clip_name` (text)
      - `value` (integer)
      - `date` (date)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Stats table
CREATE TABLE IF NOT EXISTS month_collection_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES month_collections(id) ON DELETE CASCADE,
  achievements integer DEFAULT 0,
  available_days integer DEFAULT 22,
  percentage decimal DEFAULT 0,
  required_for_hundred integer DEFAULT 0,
  daily_percentage decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE month_collection_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their collection stats"
  ON month_collection_stats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_collection_stats.collection_id
      AND mc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_collection_stats.collection_id
      AND mc.user_id = auth.uid()
    )
  );

-- Clips table
CREATE TABLE IF NOT EXISTS month_collection_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES month_collections(id) ON DELETE CASCADE,
  clip_id text NOT NULL,
  clip_name text NOT NULL,
  value integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE month_collection_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their collection clips"
  ON month_collection_clips
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_collection_clips.collection_id
      AND mc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_collection_clips.collection_id
      AND mc.user_id = auth.uid()
    )
  );

-- Function to initialize stats when collection is created
CREATE OR REPLACE FUNCTION initialize_collection_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO month_collection_stats (collection_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for stats initialization
CREATE OR REPLACE TRIGGER on_month_collection_created
  AFTER INSERT ON month_collections
  FOR EACH ROW
  EXECUTE FUNCTION initialize_collection_stats();
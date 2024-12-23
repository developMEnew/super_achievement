/*
  # Month Collections System
  
  1. New Tables
    - `month_collections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text, collection name)
      - `month` (text)
      - `year` (integer)
      - `is_active` (boolean)
      - Timestamps
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

CREATE TABLE IF NOT EXISTS month_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE month_collections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their collections"
  ON month_collections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to set active collection
CREATE OR REPLACE FUNCTION set_active_collection(
  p_collection_id uuid,
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  -- Set all collections inactive
  UPDATE month_collections 
  SET is_active = false 
  WHERE user_id = p_user_id;
  
  -- Set selected collection active
  UPDATE month_collections 
  SET is_active = true 
  WHERE id = p_collection_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
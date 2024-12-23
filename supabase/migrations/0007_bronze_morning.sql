/*
  # Month Calendar Schema

  1. New Tables
    - `month_calendars`: Stores calendar metadata for each month collection
    - `month_days`: Stores individual day data for each month
  
  2. Changes
    - Add calendar tracking for month collections
    - Add day selection functionality
    
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Month calendars table
CREATE TABLE IF NOT EXISTS month_calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES month_collections(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  total_days integer NOT NULL,
  selected_days integer DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(collection_id)
);

ALTER TABLE month_calendars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their calendars"
  ON month_calendars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_calendars.collection_id
      AND mc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM month_collections mc
      WHERE mc.id = month_calendars.collection_id
      AND mc.user_id = auth.uid()
    )
  );

-- Month days table
CREATE TABLE IF NOT EXISTS month_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id uuid REFERENCES month_calendars(id) ON DELETE CASCADE,
  date date NOT NULL,
  day_number integer NOT NULL,
  is_selected boolean DEFAULT false,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(calendar_id, date)
);

ALTER TABLE month_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their days"
  ON month_days
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM month_calendars mc
      JOIN month_collections col ON mc.collection_id = col.id
      WHERE mc.id = month_days.calendar_id
      AND col.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM month_calendars mc
      JOIN month_collections col ON mc.collection_id = col.id
      WHERE mc.id = month_days.calendar_id
      AND col.user_id = auth.uid()
    )
  );

-- Function to initialize calendar when collection is created
CREATE OR REPLACE FUNCTION initialize_month_calendar()
RETURNS trigger AS $$
DECLARE
  v_start_date date;
  v_end_date date;
  v_total_days integer;
  v_calendar_id uuid;
  v_current_date date;
BEGIN
  -- Calculate start and end dates
  v_start_date := make_date(NEW.year, extract(month from to_date(NEW.month, 'Month'))::integer, 1);
  v_end_date := (v_start_date + interval '1 month' - interval '1 day')::date;
  v_total_days := extract(day from v_end_date)::integer;
  
  -- Create calendar entry
  INSERT INTO month_calendars (
    collection_id, month, year, total_days,
    start_date, end_date
  ) VALUES (
    NEW.id, NEW.month, NEW.year, v_total_days,
    v_start_date, v_end_date
  ) RETURNING id INTO v_calendar_id;
  
  -- Create entries for each day
  v_current_date := v_start_date;
  WHILE v_current_date <= v_end_date LOOP
    INSERT INTO month_days (
      calendar_id, date, day_number
    ) VALUES (
      v_calendar_id,
      v_current_date,
      extract(day from v_current_date)::integer
    );
    v_current_date := v_current_date + interval '1 day';
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for calendar initialization
CREATE OR REPLACE TRIGGER on_month_collection_created_calendar
  AFTER INSERT ON month_collections
  FOR EACH ROW
  EXECUTE FUNCTION initialize_month_calendar();

-- Function to toggle day selection
CREATE OR REPLACE FUNCTION toggle_day_selection(
  p_calendar_id uuid,
  p_date date
) RETURNS void AS $$
DECLARE
  v_is_selected boolean;
BEGIN
  -- Get current selection state
  SELECT is_selected INTO v_is_selected
  FROM month_days
  WHERE calendar_id = p_calendar_id AND date = p_date;
  
  -- Toggle selection
  UPDATE month_days
  SET is_selected = NOT v_is_selected
  WHERE calendar_id = p_calendar_id AND date = p_date;
  
  -- Update selected days count
  UPDATE month_calendars
  SET selected_days = (
    SELECT count(*) 
    FROM month_days 
    WHERE calendar_id = p_calendar_id 
    AND is_selected = true
  )
  WHERE id = p_calendar_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
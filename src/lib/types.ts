// Update types.ts to include Stats type
export interface Stats {
  id: string;
  collection_id: string;
  achievements: number;
  available_days: number;
  percentage: number;
  required_for_hundred: number;
  daily_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Clip {
  id: string;
  clip_id: string;
  clip_name: string;
  value: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DayData {
  total: number;
  clips: number;
}

export interface MonthDay {
  id: string;
  calendar_id: string;
  date: string;
  day_number: number;
  is_selected: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthCalendar {
  id: string;
  collection_id: string;
  month: string;
  year: number;
  total_days: number;
  selected_days: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
export interface UserStats {
  id: string;
  user_id: string;
  achievements: number;
  available_days: number;
  percentage: number;
  required_for_hundred: number;
  daily_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface MonthCollection {
  id: string;
  user_id: string;
  name: string;
  month: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTable {
  id: string;
  user_id: string;
  table_name: string;
  month: string;
  year: number;
  created_at: string;
}

export interface MonthClip {
  id: string;
  clip_id: string;
  clip_name: string;
  value: number;
  date: string;
  created_at: string;
  updated_at: string;
}
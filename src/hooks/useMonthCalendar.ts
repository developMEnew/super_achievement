import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { MonthCalendar, MonthDay } from '@/lib/types';

export function useMonthCalendar(collectionId: string | null) {
  const [calendar, setCalendar] = useState<MonthCalendar | null>(null);
  const [days, setDays] = useState<MonthDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchCalendar() {
      if (!collectionId) return;

      try {
        // Fetch calendar metadata
        const { data: calendarData, error: calendarError } = await supabase
          .from('month_calendars')
          .select('*')
          .eq('collection_id', collectionId)
          .single();

        if (calendarError) throw calendarError;
        setCalendar(calendarData);

        // Fetch days data
        const { data: daysData, error: daysError } = await supabase
          .from('month_days')
          .select('*')
          .eq('calendar_id', calendarData.id)
          .order('date', { ascending: true });

        if (daysError) throw daysError;
        setDays(daysData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calendar');
      } finally {
        setLoading(false);
      }
    }

    fetchCalendar();
  }, [collectionId]);

  const toggleDaySelection = async (date: string) => {
    if (!calendar) return;

    try {
      const { error } = await supabase
        .rpc('toggle_day_selection', {
          p_calendar_id: calendar.id,
          p_date: date
        });

      if (error) throw error;

      // Refresh calendar data
      const { data: updatedDays, error: refreshError } = await supabase
        .from('month_days')
        .select('*')
        .eq('calendar_id', calendar.id)
        .order('date', { ascending: true });

      if (refreshError) throw refreshError;
      setDays(updatedDays || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle day');
    }
  };

  return {
    calendar,
    days,
    loading,
    error,
    toggleDaySelection
  };
}
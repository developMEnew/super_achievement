import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserTable, MonthClip } from '@/lib/types';

export function useMonthTable() {
  const [currentTable, setCurrentTable] = useState<UserTable | null>(null);
  const [clips, setClips] = useState<MonthClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function createMonthTable(month: string, year: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('create_month_table', {
          p_user_id: user.id,
          p_month: month,
          p_year: year
        });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create table');
    }
  }

  async function getCurrentTable() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const now = new Date();
      const currentMonth = now.toLocaleString('en-US', { month: 'short' });
      const currentYear = now.getFullYear();

      // Create table if it doesn't exist
      await createMonthTable(currentMonth, currentYear);

      // Get table info
      const { data, error } = await supabase
        .from('user_tables')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to get current table');
    }
  }

  async function fetchClips() {
    try {
      if (!currentTable) return;

      const { data, error } = await supabase
        .from(currentTable.table_name)
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setClips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clips'));
    }
  }

  async function addClip(clipId: string, clipName: string, value: number, date: string) {
    try {
      if (!currentTable) throw new Error('No active table');

      const { error } = await supabase
        .from(currentTable.table_name)
        .insert({
          clip_id: clipId,
          clip_name: clipName,
          value,
          date
        });

      if (error) throw error;
      await fetchClips();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add clip');
    }
  }

  async function deleteClip(id: string) {
    try {
      if (!currentTable) throw new Error('No active table');

      const { error } = await supabase
        .from(currentTable.table_name)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchClips();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete clip');
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        const table = await getCurrentTable();
        setCurrentTable(table);
        if (table) {
          await fetchClips();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize'));
      } finally {
        setLoading(false);
      }
    }

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      initialize();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    currentTable,
    clips,
    loading,
    error,
    addClip,
    deleteClip,
    refreshClips: fetchClips
  };
}
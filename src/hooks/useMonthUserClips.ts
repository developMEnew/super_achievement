import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { MonthUserClip } from '@/lib/types';

export function useMonthUserClips() {
  const [clips, setClips] = useState<MonthUserClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchClips() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('month_user')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setClips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clips'));
    } finally {
      setLoading(false);
    }
  }

  async function addClip(clipId: string, clipName: string, value: number, date: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('month_user')
        .insert({
          user_id: user.id,
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

  async function deleteClip(clipId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('month_user')
        .delete()
        .eq('user_id', user.id)
        .eq('clip_id', clipId);

      if (error) throw error;
      await fetchClips();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete clip');
    }
  }

  useEffect(() => {
    fetchClips();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchClips();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { clips, loading, error, addClip, deleteClip, refreshClips: fetchClips };
}
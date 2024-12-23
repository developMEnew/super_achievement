import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserStats } from '@/lib/types';

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchStats();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { stats, loading, error };
}
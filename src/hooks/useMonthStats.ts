import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { type Stats } from '@/lib/types';

export function useMonthStats(collectionId: string | null) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchStats() {
      if (!collectionId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('month_collection_stats')
          .select('*')
          .eq('collection_id', collectionId)
          .single();

        if (fetchError) throw fetchError;
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [collectionId]);

  return { stats, loading, error };
}
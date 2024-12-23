import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { type Clip } from '@/lib/types';

export function useMonthClips(collectionId: string | null) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchClips() {
      if (!collectionId) return;
      
      try {
        const { data, error: fetchError } = await supabase
          .from('month_collection_clips')
          .select('*')
          .eq('collection_id', collectionId)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;
        setClips(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clips');
      } finally {
        setLoading(false);
      }
    }

    fetchClips();
  }, [collectionId]);

  return { clips, loading, error };
}
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { MonthCollection } from '@/lib/types';

export function useMonthCollections() {
  const [collections, setCollections] = useState<MonthCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<MonthCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('month_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCollections(data || []);

      // Find active collection
      const active = data?.find(c => c.is_active);
      setActiveCollection(active || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (name: string, month: string, year: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('month_collections')
        .insert({ user_id: user.id, name, month, year });

      if (insertError) throw insertError;
      await fetchCollections();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create collection');
    }
  };

  const setActiveCollectionById = async (collectionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .rpc('set_active_collection', {
          p_collection_id: collectionId,
          p_user_id: user.id
        });

      if (error) throw error;
      await fetchCollections();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to set active collection');
    }
  };

  useEffect(() => {
    fetchCollections();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCollections();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    collections,
    activeCollection,
    loading,
    error,
    createCollection,
    setActiveCollectionById,
    refreshCollections: fetchCollections
  };
}
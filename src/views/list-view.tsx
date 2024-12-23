import { useEffect, useState } from 'react';
import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
import { supabase } from '@/lib/supabase';
import { groupClipsByDate } from '@/lib/utils';

interface Clip {
  id: string;
  clip_id: string;
  clip_name: string;
  value: number;
  date: string;
}

export default function ListView() {
  const { activeCollection } = useMonthCollectionContext();
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchClips() {
      if (!activeCollection) return;
      
      try {
        const { data, error: fetchError } = await supabase
          .from('month_collection_clips')
          .select('*')
          .eq('collection_id', activeCollection.id)
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
  }, [activeCollection]);

  if (!activeCollection) {
    return <NoMonthPlaceholder />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MonthHeader />
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MonthHeader />
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  const groupedClips = groupClipsByDate(clips);

  return (
    <div className="min-h-screen bg-gray-50">
      <MonthHeader />
      <div className="max-w-2xl mx-auto p-4">
        {Object.entries(groupedClips).map(([date, group]: [string, any]) => (
          <div key={date} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Total: {group.total}
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-md divide-y">
              {group.items.map((clip: Clip) => (
                <div key={clip.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{clip.clip_name}</h4>
                    <p className="text-sm text-gray-500">ID: {clip.clip_id}</p>
                  </div>
                  <span className="font-medium">{clip.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {clips.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No clips added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
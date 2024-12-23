import { useEffect, useState } from 'react';
import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
import { supabase } from '@/lib/supabase';

interface Stats {
  achievements: number;
  available_days: number;
  percentage: number;
  required_for_hundred: number;
  daily_percentage: number;
}

export default function StatsCard() {
  const { activeCollection } = useMonthCollectionContext();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchStats() {
      if (!activeCollection) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('month_collection_stats')
          .select('*')
          .eq('collection_id', activeCollection.id)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MonthHeader />
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Month Statistics</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{stats?.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats?.percentage || 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.achievements}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.available_days}
                </div>
                <div className="text-sm text-gray-600">Available Days</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Goal</span>
                <span className="font-medium">{stats?.daily_percentage.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Required for 100%</span>
                <span className="font-medium">{stats?.required_for_hundred}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
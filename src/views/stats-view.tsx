import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
import { useMonthStats } from '@/hooks/useMonthStats';
import { StatsProgress } from '@/components/stats/StatsProgress';
import { StatsMetrics } from '@/components/stats/StatsMetrics';
import { StatsGoals } from '@/components/stats/StatsGoals';

export default function StatsView() {
  const { activeCollection } = useMonthCollectionContext();
  const { stats, loading, error } = useMonthStats(activeCollection?.id ?? null);
  
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MonthHeader />
        <div className="p-4">No stats available</div>
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
            <StatsProgress stats={stats} />
            <StatsMetrics stats={stats} />
            <StatsGoals stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
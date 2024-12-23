import { type Stats } from '@/lib/types';

interface StatsMetricsProps {
  stats: Stats;
}

export function StatsMetrics({ stats }: StatsMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {stats.achievements}
        </div>
        <div className="text-sm text-gray-600">Achievements</div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {stats.available_days}
        </div>
        <div className="text-sm text-gray-600">Available Days</div>
      </div>
    </div>
  );
}
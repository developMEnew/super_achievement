import { type Stats } from '@/lib/types';

interface StatsProgressProps {
  stats: Stats;
}

export function StatsProgress({ stats }: StatsProgressProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium">{stats.percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${stats.percentage || 0}%` }}
        />
      </div>
    </div>
  );
}
import { type Stats } from '@/lib/types';

interface StatsGoalsProps {
  stats: Stats;
}

export function StatsGoals({ stats }: StatsGoalsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Daily Goal</span>
        <span className="font-medium">{stats.daily_percentage.toFixed(1)}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Required for 100%</span>
        <span className="font-medium">{stats.required_for_hundred}</span>
      </div>
    </div>
  );
}
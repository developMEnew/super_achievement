import { type DayData } from '@/lib/types';

interface CalendarDayProps {
  day: {
    day?: number;
    date?: string;
    data?: DayData;
  } | null;
}

export function CalendarDay({ day }: CalendarDayProps) {
  if (!day) return <div />;

  return (
    <div
      className={`aspect-square p-2 rounded-lg border ${
        day.data ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="text-sm font-medium">{day.day}</div>
      {day.data && (
        <div className="mt-1">
          <div className="text-xs text-blue-600">
            Total: {day.data.total}
          </div>
          <div className="text-xs text-gray-500">
            Clips: {day.data.clips}
          </div>
        </div>
      )}
    </div>
  );
}
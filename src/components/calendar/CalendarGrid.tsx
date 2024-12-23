import { type DayData } from '@/lib/types';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  days: Array<{
    day?: number;
    date?: string;
    data?: DayData;
  } | null>;
}

export function CalendarGrid({ days }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-medium text-gray-500">
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <CalendarDay key={index} day={day} />
      ))}
    </div>
  );
}
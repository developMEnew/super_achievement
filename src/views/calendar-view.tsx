import { useEffect, useState } from 'react';
import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
import { supabase } from '@/lib/supabase';

interface DayData {
  date: string;
  total: number;
  clips: number;
}

export default function CalendarView() {
  const { activeCollection } = useMonthCollectionContext();
  const [monthData, setMonthData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMonthData() {
      if (!activeCollection) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('month_collection_clips')
          .select('*')
          .eq('collection_id', activeCollection.id);

        if (fetchError) throw fetchError;

        // Process data by date
        const processedData: Record<string, DayData> = {};
        data?.forEach(clip => {
          const date = clip.date;
          if (!processedData[date]) {
            processedData[date] = {
              date,
              total: 0,
              clips: 0
            };
          }
          processedData[date].total += clip.value;
          processedData[date].clips += 1;
        });

        setMonthData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch month data');
      } finally {
        setLoading(false);
      }
    }

    fetchMonthData();
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

  // Generate calendar days
  const firstDay = new Date(activeCollection.year, getMonthIndex(activeCollection.month), 1);
  const lastDay = new Date(activeCollection.year, getMonthIndex(activeCollection.month) + 1, 0);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(activeCollection.year, getMonthIndex(activeCollection.month), i)
      .toISOString()
      .split('T')[0];
    days.push({
      day: i,
      date,
      data: monthData[date]
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MonthHeader />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-2 rounded-lg ${
                  day ? 'border' : ''
                } ${
                  day?.data
                    ? 'bg-blue-50 border-blue-200'
                    : day
                    ? 'border-gray-200'
                    : ''
                }`}
              >
                {day && (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getMonthIndex(month: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(month);
}
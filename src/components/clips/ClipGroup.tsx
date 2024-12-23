import { type Clip } from '@/lib/types';
import { ClipItem } from './ClipItem';

interface ClipGroupProps {
  date: string;
  group: {
    items: Clip[];
    total: number;
  };
}

export function ClipGroup({ date, group }: ClipGroupProps) {
  return (
    <div className="mb-6">
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
          <ClipItem key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );
}
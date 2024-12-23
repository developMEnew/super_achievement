import { type Clip } from '@/lib/types';
import { groupClipsByDate } from '@/lib/utils';
import { ClipGroup } from './ClipGroup';

interface ClipListProps {
  clips: Clip[];
}

export function ClipList({ clips }: ClipListProps) {
  const groupedClips = groupClipsByDate(clips);

  if (clips.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No clips added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedClips).map(([date, group]: [string, any]) => (
        <ClipGroup key={date} date={date} group={group} />
      ))}
    </div>
  );
}
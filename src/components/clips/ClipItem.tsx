import { type Clip } from '@/lib/types';

interface ClipItemProps {
  clip: Clip;
}

export function ClipItem({ clip }: ClipItemProps) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium">{clip.clip_name}</h4>
        <p className="text-sm text-gray-500">ID: {clip.clip_id}</p>
      </div>
      <span className="font-medium">{clip.value}</span>
    </div>
  );
}
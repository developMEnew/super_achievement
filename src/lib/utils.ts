import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateClipId(): string {
  // Generate a 4-digit random number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CLIP${randomNum}`;
}

export function groupClipsByDate(clips: any[]) {
  return clips.reduce((groups: any, clip: any) => {
    const date = clip.date;
    if (!groups[date]) {
      groups[date] = {
        date,
        items: [],
        total: 0
      };
    }
    groups[date].items.push(clip);
    groups[date].total += clip.value;
    return groups;
  }, {});
}
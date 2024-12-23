import { ListFilter, PlusCircle, Calendar, User, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const tabs = [
  { icon: BarChart3, label: 'Stats', path: '/' },
  { icon: ListFilter, label: 'List', path: '/list' },
  { icon: PlusCircle, label: 'Add', path: '/add' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around">
        {tabs.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={clsx(
              'flex flex-col items-center py-2 px-3 min-w-[64px]',
              location.pathname === path ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
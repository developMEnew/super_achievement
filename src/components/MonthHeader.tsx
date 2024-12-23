import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function MonthHeader() {
  const { activeCollection } = useMonthCollectionContext();
  const navigate = useNavigate();

  if (!activeCollection) {
    return null;
  }

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <div>
        <h2 className="font-medium">{activeCollection.name}</h2>
        <p className="text-sm text-gray-500">
          {activeCollection.month} {activeCollection.year}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/profile')}
      >
        Switch Month
      </Button>
    </div>
  );
}
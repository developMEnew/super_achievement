import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NoMonthPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No Active Month</h2>
        <p className="text-gray-500 mb-4">Please create a month collection first</p>
        <Button onClick={() => navigate('/profile')}>
          Create Month Collection
        </Button>
      </div>
    </div>
  );
}
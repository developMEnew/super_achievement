import { useMonthCollections } from '@/hooks/useMonthCollections';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateMonthDialog } from './CreateMonthDialog';

export function MonthSelector() {
  const { 
    collections, 
    activeCollection, 
    createCollection, 
    setActiveCollectionById,
    loading 
  } = useMonthCollections();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCreateMonth = async (name: string, month: string, year: number) => {
    await createCollection(name, month, year);
    setShowCreateDialog(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Month Collections</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Month
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No month collections yet</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Your First Month
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setActiveCollectionById(collection.id)}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                collection.is_active
                  ? 'bg-blue-50 border-blue-200 border'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="font-medium">{collection.name}</div>
              <div className="text-sm text-gray-500">
                {collection.month} {collection.year}
              </div>
            </button>
          ))}
        </div>
      )}

      {showCreateDialog && (
        <CreateMonthDialog
          onSubmit={handleCreateMonth}
          onCancel={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}
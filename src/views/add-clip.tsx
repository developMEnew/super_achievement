import { useState } from 'react';
import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateClipId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function AddClip() {
  const { activeCollection } = useMonthCollectionContext();
  const [clipName, setClipName] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!activeCollection) {
    return <NoMonthPlaceholder />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const clipId = generateClipId();
      const { error: insertError } = await supabase
        .from('month_collection_clips')
        .insert({
          collection_id: activeCollection.id,
          clip_id: clipId,
          clip_name: clipName,
          value: parseInt(value),
          date: new Date().toISOString().split('T')[0]
        });

      if (insertError) throw insertError;

      setClipName('');
      setValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add clip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MonthHeader />
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Clip</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="clipName">Clip Name</Label>
              <Input
                id="clipName"
                value={clipName}
                onChange={(e) => setClipName(e.target.value)}
                placeholder="Enter clip name"
                required
              />
            </div>

            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                min="0"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Clip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
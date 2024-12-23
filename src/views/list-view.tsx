import { useMonthCollectionContext } from '@/contexts/MonthCollectionContext';
import { NoMonthPlaceholder } from '@/components/NoMonthPlaceholder';
import { MonthHeader } from '@/components/MonthHeader';
// ... rest of imports

export default function ListView() {
  const { activeCollection } = useMonthCollectionContext();
  
  if (!activeCollection) {
    return <NoMonthPlaceholder />;
  }

  return (
    <>
      <MonthHeader />
      {/* Rest of the existing component */}
    </>
  );
}
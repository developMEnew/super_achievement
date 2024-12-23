import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MonthCollectionProvider } from './contexts/MonthCollectionContext';
import { BottomNav } from './components/BottomNav';
import StatsCard from './stats-card';
import AddClip from './views/add-clip';
import ListView from './views/list-view';
import CalendarView from './views/calendar-view';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <MonthCollectionProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 pb-16">
          <Routes>
            <Route path="/" element={<StatsCard />} />
            <Route path="/search" element={<ListView />} />
            <Route path="/favorites" element={<AddClip />} />
            <Route path="/settings" element={<CalendarView />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </MonthCollectionProvider>
  );
}
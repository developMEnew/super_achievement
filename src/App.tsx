import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MonthCollectionProvider } from './contexts/MonthCollectionContext';
import { BottomNav } from './components/BottomNav';
import StatsView from './views/stats-view';
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
            <Route path="/" element={<StatsView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/add" element={<AddClip />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </MonthCollectionProvider>
  );
}
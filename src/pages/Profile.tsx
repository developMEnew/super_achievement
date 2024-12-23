import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthTabs } from '../components/AuthTabs';
import { MonthSelector } from '../components/MonthSelector';
import { User } from '@supabase/supabase-js';

export function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-6">Welcome</h1>
        <AuthTabs />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-red-500 text-sm hover:text-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <MonthSelector />
    </div>
  );
}
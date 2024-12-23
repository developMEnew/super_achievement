import { useState } from 'react';
import { clsx } from 'clsx';
import { supabase } from '../lib/supabase';

export function AuthTabs() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert('Check your email for verification!');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          className={clsx(
            'flex-1 py-2 text-sm font-medium rounded-md',
            isLogin ? 'bg-white shadow' : 'text-gray-500'
          )}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={clsx(
            'flex-1 py-2 text-sm font-medium rounded-md',
            !isLogin ? 'bg-white shadow' : 'text-gray-500'
          )}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
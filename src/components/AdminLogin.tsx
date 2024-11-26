import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this should be a secure authentication process
    if (password === 'admin123') {
      onLogin(true);
    } else {
      setError('Invalid password');
      onLogin(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Lock className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
        Administrator Login
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
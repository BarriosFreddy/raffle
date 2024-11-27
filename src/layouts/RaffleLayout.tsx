import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function RaffleLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
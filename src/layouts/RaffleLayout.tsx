import React from 'react';
import { Outlet } from 'react-router-dom';

export function RaffleLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
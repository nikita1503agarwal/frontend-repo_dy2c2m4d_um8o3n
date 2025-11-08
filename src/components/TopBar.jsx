import React from 'react';

export default function TopBar() {
  return (
    <header className="w-full border-b border-white/10 bg-zinc-900/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          3D Avatar Studio — Made by Sohan ❤️
        </h1>
        <div className="text-xs text-zinc-400 hidden sm:block">
          Real-time face capture, reconstruction & customization
        </div>
      </div>
    </header>
  );
}

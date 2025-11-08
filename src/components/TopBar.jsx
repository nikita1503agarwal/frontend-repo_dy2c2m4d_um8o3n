import React from 'react';

export default function TopBar() {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow" />
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
            3D Avatar Studio — Made by Sohan ❤️
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span>React • Three.js • MediaPipe • TensorFlow.js</span>
        </div>
      </div>
    </header>
  );
}

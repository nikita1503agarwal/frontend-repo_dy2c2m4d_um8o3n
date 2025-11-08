import React, { useRef, useState } from 'react';
import TopBar from './components/TopBar';
import CameraPanel from './components/CameraPanel';
import AvatarViewer from './components/AvatarViewer';
import CustomizerPanel from './components/CustomizerPanel';

export default function App() {
  const [img, setImg] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [config, setConfig] = useState({
    hair: 'short',
    hairColor: '#222222',
    clothing: 'tshirt',
    clothingColor: '#4f46e5',
    facialHair: 'none',
    accessory: 'none',
    skin: '#e0c1a0',
    eye: '#6fb0ff',
  });

  const exportRef = useRef(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <TopBar />
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-3">
          <div className="rounded-xl ring-1 ring-white/10 p-4 bg-zinc-900/60 backdrop-blur">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">Input</h2>
            <CameraPanel onImageReady={setImg} onLandmarks={setLandmarks} />
          </div>
        </section>

        <section className="lg:col-span-6 min-h-[440px]">
          <div className="rounded-xl ring-1 ring-white/10 p-3 bg-zinc-900/60 backdrop-blur h-full flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">3D Avatar</h2>
            <div className="flex-1 min-h-[380px]">
              <AvatarViewer textureDataUrl={img} landmarks={landmarks} config={config} onExport={exportRef} />
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="rounded-xl ring-1 ring-white/10 p-4 bg-zinc-900/60 backdrop-blur">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">Customize</h2>
            <CustomizerPanel config={config} setConfig={setConfig} onDownload={() => exportRef.current && exportRef.current()} />
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-zinc-500 py-6">Built with React · Three.js · MediaPipe FaceMesh · TailwindCSS</footer>
    </div>
  );
}

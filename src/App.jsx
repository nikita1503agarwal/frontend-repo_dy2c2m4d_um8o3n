import React, { useCallback, useMemo, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import CameraPanel from './components/CameraPanel';
import AvatarViewer from './components/AvatarViewer';
import CustomizerPanel from './components/CustomizerPanel';

export default function App() {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [config, setConfig] = useState({
    hair: 'short',
    clothing: 'shirt',
    facialHair: 'none',
    accessory: 'none',
    skinTone: '#f5d1b8',
    eyeColor: '#2b6cb0',
  });

  const exporterRef = useRef(null);
  const handleReadyForExport = useCallback((getDataUrl) => {
    exporterRef.current = getDataUrl;
  }, []);

  const handleDownload = () => {
    if (!exporterRef.current) return;
    const dataUrl = exporterRef.current();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'avatar.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-gray-900">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-base font-semibold mb-3">Camera / Photo</h2>
            <CameraPanel onCapture={setImageDataUrl} onLandmarks={setLandmarks} />
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-base font-semibold mb-3">How it works</h2>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Start your camera or upload a photo.</li>
              <li>Capture a frame to analyze your face.</li>
              <li>We align and map your face onto a 3D head.</li>
              <li>Customize hair, clothes, and colors.</li>
              <li>Download your avatar.</li>
            </ol>
          </div>
        </section>

        <section className="lg:col-span-6 h-[60vh] lg:h-[70vh] p-2 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <AvatarViewer
            imageDataUrl={imageDataUrl}
            landmarks={landmarks}
            config={config}
            onReadyForExport={handleReadyForExport}
          />
        </section>

        <section className="lg:col-span-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold mb-3">Customization</h2>
          <CustomizerPanel config={config} setConfig={setConfig} onDownload={handleDownload} />
        </section>
      </main>
    </div>
  );
}

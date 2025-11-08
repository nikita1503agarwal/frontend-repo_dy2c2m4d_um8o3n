import React, { useEffect, useRef, useState } from 'react';

// The FaceMesh + TF.js are expected to be loaded via CDN in index.html in many setups.
// However, to keep this component functional without external global scripts,
// we'll feature-detect and no-op gracefully if they're not present.

export default function CameraPanel({ onCapture, onLandmarks }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      setError('Unable to access camera. Please allow permissions or try uploading a photo.');
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      video.srcObject = null;
    }
    setStreaming(false);
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/png');

    // Run FaceMesh if present on window
    let landmarks = null;
    try {
      if (window.faceLandmarker) {
        const result = await window.faceLandmarker.detect(canvas);
        landmarks = result?.landmarks?.[0] || null;
      }
    } catch (e) {
      // ignore errors and proceed without landmarks
    }

    if (onLandmarks) onLandmarks(landmarks);
    if (onCapture) onCapture(dataUrl);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');

      let landmarks = null;
      try {
        if (window.faceLandmarker) {
          const result = await window.faceLandmarker.detect(canvas);
          landmarks = result?.landmarks?.[0] || null;
        }
      } catch (e) {}

      if (onLandmarks) onLandmarks(landmarks);
      if (onCapture) onCapture(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={streaming ? stopCamera : startCamera} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
          {streaming ? 'Stop Camera' : 'Start Camera'}
        </button>
        <label className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer">
          Upload Photo
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
        <button onClick={captureFrame} className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition" disabled={!streaming}>
          Capture
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

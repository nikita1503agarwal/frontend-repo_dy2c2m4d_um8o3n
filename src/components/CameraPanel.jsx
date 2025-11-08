import React, { useEffect, useRef, useState } from 'react';
import { Files, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { FaceMesh } from '@mediapipe/face_mesh';

// Camera & Photo input with MediaPipe FaceMesh inference
export default function CameraPanel({ onImageReady, onLandmarks }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);

  useEffect(() => {
    // initialize MediaPipe FaceMesh via CDN assets
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      // draw input
      canvas.width = results.image.width;
      canvas.height = results.image.height;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        // simple overlay of points and a few contour lines to avoid extra deps
        ctx.fillStyle = '#38bdf8';
        landmarks.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
        onLandmarks?.(landmarks);
      }
      ctx.restore();
    });

    faceMeshRef.current = faceMesh;

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      requestAnimationFrame(processVideoFrame);
    } catch (e) {
      console.error('Camera error', e);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    setCameraOn(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const processVideoFrame = async () => {
    if (!cameraOn) return;
    const video = videoRef.current;
    const faceMesh = faceMeshRef.current;
    if (video && faceMesh) {
      await faceMesh.send({ image: video });
    }
    requestAnimationFrame(processVideoFrame);
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const tmp = document.createElement('canvas');
    tmp.width = video.videoWidth;
    tmp.height = video.videoHeight;
    const ctx = tmp.getContext('2d');
    ctx.drawImage(video, 0, 0, tmp.width, tmp.height);
    const dataUrl = tmp.toDataURL('image/png');
    onImageReady?.(dataUrl);
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        onImageReady?.(ev.target?.result);
        // run one-off landmark detection on uploaded image
        await faceMeshRef.current?.send({ image: canvas });
      };
      if (typeof ev.target?.result === 'string') img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={cameraOn ? stopCamera : startCamera}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-white text-sm"
        >
          <Camera className="w-4 h-4" />
          {cameraOn ? 'Stop Camera' : 'Start Camera'}
        </button>
        <button
          onClick={capture}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-white text-sm disabled:opacity-50"
          disabled={!cameraOn}
        >
          <ImageIcon className="w-4 h-4" /> Capture
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-700 hover:bg-zinc-600 px-3 py-2 text-white text-sm"
        >
          <Files className="w-4 h-4" /> Upload Photo
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>

      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/50 ring-1 ring-white/10">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {loading && (
          <div className="absolute inset-0 grid place-items-center bg-black/40">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

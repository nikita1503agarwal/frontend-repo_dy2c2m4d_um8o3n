import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Three.js viewer: sphere-based head with texture projection, lights, orbit controls
export default function AvatarViewer({ textureDataUrl, landmarks, config, onExport }) {
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0b0f');

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.4, 2.2);

    // lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 1.0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 3);
    dir.castShadow = true;
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ground
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#0f1115', roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // create a head-like sphere
    const geo = new THREE.SphereGeometry(0.45, 128, 128);
    geo.scale(0.95, 1.1, 1.0); // slight elongation
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config?.skin || '#e0c1a0') });
    const head = new THREE.Mesh(geo, mat);
    head.position.set(0, 1.6, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    scene.add(head);
    headRef.current = head;

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    setReady(true);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []);

  // apply skin color updates
  useEffect(() => {
    if (!headRef.current) return;
    const mat = headRef.current.material;
    if (mat && mat.color && config?.skin) {
      mat.color = new THREE.Color(config.skin);
      mat.needsUpdate = true;
    }
  }, [config?.skin]);

  // apply face texture
  useEffect(() => {
    if (!textureDataUrl || !headRef.current) return;
    const tex = new THREE.TextureLoader().load(textureDataUrl);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;

    const mat = headRef.current.material;
    mat.map = tex;
    mat.needsUpdate = true;
  }, [textureDataUrl]);

  // minimal orientation from landmarks
  useEffect(() => {
    if (!landmarks || !headRef.current) return;
    const leftEyeIdx = 33; // outer left eye
    const rightEyeIdx = 263; // outer right eye
    const noseIdx = 1; // nose tip approx
    const l = landmarks[leftEyeIdx];
    const r = landmarks[rightEyeIdx];
    const n = landmarks[noseIdx];
    if (!l || !r || !n) return;

    const dx = r.x - l.x;
    const dy = (l.y + r.y) / 2 - n.y;
    const yaw = Math.atan2(dx, 0.08);
    const pitch = Math.atan2(dy, 0.06);

    headRef.current.rotation.set(pitch, yaw, 0);
  }, [landmarks]);

  const handleExport = () => {
    // export canvas render as image for now; GLB export would need GLTFExporter (adds size)
    const renderer = rendererRef.current;
    if (!renderer) return;
    const a = document.createElement('a');
    a.href = renderer.domElement.toDataURL('image/png');
    a.download = 'avatar.png';
    a.click();
  };

  useEffect(() => {
    if (onExport) onExport.current = handleExport;
  }, [onExport, textureDataUrl, config]);

  return (
    <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden bg-[#0b0b10] ring-1 ring-white/10" />
  );
}

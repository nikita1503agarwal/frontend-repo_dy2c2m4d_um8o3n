import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function AvatarViewer({ imageDataUrl, landmarks, config, onReadyForExport }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarRef = useRef(null);
  const controlsRef = useRef(null);
  const texRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.4, 3);
    cameraRef.current = camera;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(3, 5, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    scene.add(dir);

    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.4, 0);
    controlsRef.current = controls;

    // Simple head primitive as fallback before GLB is added
    const headGeo = new THREE.SphereGeometry(0.6, 64, 64);
    const headMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config?.skinTone || '#f5d1b8'), roughness: 0.6, metalness: 0.0 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.4, 0);
    head.castShadow = true;
    scene.add(head);
    avatarRef.current = head;

    const onResize = () => {
      if (!mount) return;
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    if (onReadyForExport) onReadyForExport(() => renderer.domElement.toDataURL('image/png'));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (texRef.current) texRef.current.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // Apply texture from captured/ uploaded image
  useEffect(() => {
    if (!imageDataUrl || !avatarRef.current) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageDataUrl,
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        texRef.current = tex;
        const mat = avatarRef.current.material;
        mat.map = tex;
        mat.needsUpdate = true;
      },
      undefined,
      () => {}
    );
  }, [imageDataUrl]);

  // Use landmarks to estimate simple head orientation
  useEffect(() => {
    if (!landmarks || !avatarRef.current) return;
    const L = landmarks[33]; // left eye outer
    const R = landmarks[263]; // right eye outer
    const N = landmarks[1]; // nose tip
    if (!L || !R || !N) return;

    const yaw = Math.atan2(R.x - L.x, R.y - L.y);
    const pitch = (N.y - (L.y + R.y) / 2) * 2.0;

    avatarRef.current.rotation.set(pitch, -yaw, 0);
  }, [landmarks]);

  // React to config changes
  useEffect(() => {
    if (!avatarRef.current || !config) return;
    if (config.skinTone) {
      avatarRef.current.material.color = new THREE.Color(config.skinTone);
    }
  }, [config]);

  return (
    <div ref={mountRef} className="w-full h-full rounded-xl bg-white shadow-inner" />
  );
}

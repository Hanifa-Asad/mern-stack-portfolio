import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Self-contained architectural corridor. Only renders while the hero is visible. */
export default function CinematicScene() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const host = mountRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let renderer;
    let frameId = 0;
    let observer;
    let running = false;
    let disposed = false;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#07100d");
    scene.fog = new THREE.FogExp2("#07100d", 0.018);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 160);
    camera.position.set(0, 6.8, 28);
    const target = new THREE.Vector3(0, 10, -12);
    const clock = new THREE.Clock();
    const metal = new THREE.MeshStandardMaterial({ color: 0x85988d, metalness: 0.8, roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x13221a, metalness: 0.65, roughness: 0.35 });
    const emerald = new THREE.MeshBasicMaterial({ color: 0x36a879 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a1811, metalness: 0.25, roughness: 0.75 });
    const geometries = [];
    function block(w, h, d, x, y, z, material) {
      const geometry = new THREE.BoxGeometry(w, h, d);
      geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    }
    // Layered monolithic portal frames, continuing into atmospheric depth.
    for (let i = 0; i < 9; i++) {
      const z = -i * 8;
      const width = 18 - i * 0.35;
      const height = 25 - i * 0.25;
      const thickness = i === 0 ? 1.4 : 0.8;
      const material = i % 2 === 0 ? metal : dark;
      block(thickness, height, 2, -width / 2, height / 2, z, material);
      block(thickness, height, 2, width / 2, height / 2, z, material);
      block(width + thickness, thickness, 2, 0, height, z, material);
      block(width - thickness, 0.09, 2.1, 0, height - thickness, z, emerald);
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150, 240), floorMat);
    geometries.push(floor.geometry);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.08, -55);
    scene.add(floor);
    block(0.08, 0.05, 140, -6.2, 0.02, -56, emerald);
    block(0.08, 0.05, 140, 6.2, 0.02, -56, emerald);
    scene.add(new THREE.HemisphereLight(0xc7e6d2, 0x06110b, 1.15));
    const key = new THREE.DirectionalLight(0xe5f4ec, 2.4);
    key.position.set(-12, 25, 18);
    scene.add(key);
    const accent = new THREE.PointLight(0x36a879, 35, 65);
    accent.position.set(0, 18, -8);
    scene.add(accent);
    const far = new THREE.PointLight(0x36a879, 25, 65);
    far.position.set(0, 14, -48);
    scene.add(far);
    let pointerX = 0, pointerY = 0, progress = 0;
    const onPointer = (event) => {
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    };
    const resize = () => {
      if (!renderer || disposed) return;
      const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 768 ? 1.25 : 1.75));
      camera.aspect = w / h;
      camera.fov = w < 640 ? 62 : 48;
      camera.updateProjectionMatrix();
    };
    const draw = () => {
      if (!running || disposed) return;
      const t = clock.getElapsedTime();
      const x = pointerX * 1.1;
      camera.position.lerp(new THREE.Vector3(x, 6.8 - pointerY * 0.55 + Math.sin(t * 0.3) * 0.12, 28 - progress * 15), 0.055);
      target.set(0, 10, -12 - progress * 13);
      camera.lookAt(target);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(draw);
    };
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      renderer.setClearColor(0x07100d, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);
      host.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      resize();
      onScroll();
      observer = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting;
        cancelAnimationFrame(frameId);
        if (running) draw();
      }, { threshold: 0 });
      observer.observe(host);
    } catch (error) {
      console.warn("Cinematic WebGL fallback:", error);
      setFailed(true);
    }
    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      host.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => { if (obj.isMesh && obj.geometry && !geometries.includes(obj.geometry)) obj.geometry.dispose(); });
      geometries.forEach((geometry) => geometry.dispose());
      [metal, dark, emerald, floorMat].forEach((material) => material.dispose());
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div className={"cinema-scene" + (failed ? " cinema-scene--fallback" : "")} ref={mountRef} aria-hidden="true" />;
}

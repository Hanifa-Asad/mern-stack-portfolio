import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Persistent architectural corridor, animated across the entire cinematic page. */
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
    scene.fog = new THREE.FogExp2("#07100d", 0.0105);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 600);
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
    for (let i = 0; i < 11; i++) {
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
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150, 950), floorMat);
    geometries.push(floor.geometry);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.08, -330);
    scene.add(floor);
    block(0.08, 0.05, 850, -6.2, 0.02, -330, emerald);
    block(0.08, 0.05, 850, 6.2, 0.02, -330, emerald);
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
    // Scene landmarks inspired by the approved prototype: technology constellation,
    // project gallery, journey pylons, education tower, award and final portal.
    const lattice = new THREE.Group();
    lattice.position.set(0, 11, -105);
    scene.add(lattice);
    const nodes = [[0,0,0],[-10,5,-3],[10,5,-3],[-10,-5,3],[10,-5,3],[-15,9,1],[15,9,1],[-15,-9,1],[15,-9,1]];
    const nodeGeometry = new THREE.OctahedronGeometry(1.4);
    geometries.push(nodeGeometry);
    const nodeMaterial = new THREE.MeshStandardMaterial({color:0x6dc9a1,metalness:.7,roughness:.2,emissive:0x0f6b45,emissiveIntensity:.4});
    const lines = [];
    nodes.forEach(([x,y,z],i)=>{
      const n = new THREE.Mesh(nodeGeometry,nodeMaterial);
      n.position.set(x,y,z);n.scale.setScalar(i===0?2.2:1);lattice.add(n);
      if(i)lines.push(0,0,0,x,y,z);
    });
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position",new THREE.Float32BufferAttribute(lines,3));
    geometries.push(linesGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({color:0x36a879,transparent:true,opacity:.65});
    lattice.add(new THREE.LineSegments(linesGeometry,lineMaterial));
    const slabs=[];
    for(let i=0;i<5;i++){
      const slab=block(6,9,.45,(i%2?1:-1)*9,7,-150-i*8,i%2?metal:dark);
      slab.rotation.y=(i%2?-.32:.32);
      const edge=new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry),lineMaterial);
      edge.position.copy(slab.position);edge.rotation.copy(slab.rotation);scene.add(edge);
      geometries.push(edge.geometry);slabs.push(slab);
    }
    for(let i=0;i<6;i++){
      const h=5+i*2.2;
      block(2,h,2,Math.sin(i*.9)*7,h/2,-208-i*8,metal);
      block(2.5,.25,2.5,Math.sin(i*.9)*7,h+.1,-208-i*8,emerald);
    }
    const tower=new THREE.Group();tower.position.set(0,0,-286);scene.add(tower);
    for(let y=0;y<3;y++)for(let x=-1;x<=1;x++){
      const cube=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),y===2?metal:dark);
      geometries.push(cube.geometry);cube.position.set(x*2.4,3+y*3,0);tower.add(cube);
    }
    block(10,1,10,0,.5,-330,dark);
    block(7,.25,7,0,1.2,-330,metal);
    block(9,13,.45,0,8,-336,dark);
    for(const x of [-10,0,10])block(6,8,.35,x,7,-366,metal);
    const portalGeometry=new THREE.TorusGeometry(20,.45,12,64);
    geometries.push(portalGeometry);
    const portal=new THREE.Mesh(portalGeometry,emerald);
    portal.position.set(0,15,-430);scene.add(portal);
    // Nine camera stations correspond to the nine narrative chapters.
    const ids=["Home","About","expertise","Portofolio","experience","teaching","award","certificates","Contact"];
    const stations=[
      [[0,7,28],[0,11,0]],
      [[-1,6,-12],[3,9,-45]],
      [[0,10,-72],[0,11,-105]],
      [[0,8,-128],[0,8,-166]],
      [[-9,8,-198],[0,9,-224]],
      [[14,12,-264],[0,10,-286]],
      [[0,6,-312],[0,7,-330]],
      [[0,8,-348],[0,8,-366]],
      [[0,12,-402],[0,15,-430]]
    ].map(pair=>pair.map(v=>new THREE.Vector3(...v)));
    const chapterCenters=()=>ids.map(id=>{
      const el=document.getElementById(id);
      return el ? el.getBoundingClientRect().top+window.scrollY+el.offsetHeight/2 : null;
    });
    let centers=chapterCenters();
    const desiredLook=new THREE.Vector3();
    const smoothLook=new THREE.Vector3(0,10,0);
    const cameraFrom=new THREE.Vector3();
    const cameraTo=new THREE.Vector3();
    const easing=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
    let pointerX = 0, pointerY = 0, progress = 0;
    const onPointer = (event) => {
      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    const onScroll = () => {
      centers=chapterCenters();
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress = Math.max(0, Math.min(1, window.scrollY / total));
    };
    const resize = () => {
      if (!renderer || disposed) return;
      const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 768 ? 1.25 : 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 640 ? 64 : 48;
      centers=chapterCenters();
      camera.updateProjectionMatrix();
    };
    const cameraDestination = new THREE.Vector3();
    const draw = () => {
      if (!running || disposed) return;
      const t = clock.getElapsedTime();
      const x = pointerX * 1.1;
      const y=window.scrollY+window.innerHeight*.5;
      let index=0, blend=0;
      const valid=centers.length===stations.length&&centers.every(Number.isFinite);
      if(valid){
        if(y>=centers[centers.length-1]){index=centers.length-2;blend=1;}
        else if(y>centers[0]){
          while(index<centers.length-2&&centers[index+1]<y)index++;
          blend=(y-centers[index])/Math.max(1,centers[index+1]-centers[index]);
        }
      }else{const segment=progress*(stations.length-1);index=Math.min(stations.length-2,Math.floor(segment));blend=segment-index;}
      const eased=easing(blend);
      cameraFrom.copy(stations[index][0]);
      cameraTo.copy(stations[index+1][0]);
      cameraDestination.lerpVectors(cameraFrom,cameraTo,eased);
      cameraDestination.x+=x*1.2;
      cameraDestination.y-=pointerY*.6;
      cameraDestination.y+=Math.sin(t*.4)*.12;
      desiredLook.lerpVectors(stations[index][1],stations[index+1][1],eased);
      camera.position.lerp(cameraDestination,.07);
      smoothLook.lerp(desiredLook,.07);
      camera.lookAt(smoothLook);
      lattice.rotation.y=t*.06;
      portal.rotation.z=t*.025;
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
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      resize();
      onScroll();
      const onVisibility = () => {
        running = !document.hidden;
        cancelAnimationFrame(frameId);
        if (running) draw();
      };
      document.addEventListener("visibilitychange", onVisibility);
      running = !document.hidden;
      if (running) draw();
      observer = { disconnect: () => document.removeEventListener("visibilitychange", onVisibility) };
    } catch (error) {
      console.warn("Cinematic WebGL fallback:", error);
      setFailed(true);
    }
    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => { if (obj.isMesh && obj.geometry && !geometries.includes(obj.geometry)) obj.geometry.dispose(); });
      geometries.forEach((geometry) => geometry.dispose());
      [metal, dark, emerald, floorMat, nodeMaterial, lineMaterial].forEach((material) => material.dispose());
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div className={"cinema-scene" + (failed ? " cinema-scene--fallback" : "")} ref={mountRef} aria-hidden="true" />;
}

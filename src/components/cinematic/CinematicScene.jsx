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
    // Cinematic atmosphere: layered shafts, floating dust and deep architectural framing.
    // Procedural textures avoid external image dependencies.
    const atmosphericMaterials = [];
    const shafts = [];
    const shaftCanvas = document.createElement("canvas");
    shaftCanvas.width = 32; shaftCanvas.height = 256;
    const shaftContext = shaftCanvas.getContext("2d");
    if (shaftContext) {
      const grad = shaftContext.createLinearGradient(0,0,0,256);
      grad.addColorStop(0,"rgba(82,255,174,0)");
      grad.addColorStop(.38,"rgba(82,255,174,.24)");
      grad.addColorStop(.58,"rgba(185,255,218,.38)");
      grad.addColorStop(1,"rgba(82,255,174,0)");
      shaftContext.fillStyle=grad;shaftContext.fillRect(0,0,32,256);
    }
    const shaftTexture = new THREE.CanvasTexture(shaftCanvas);
    const shaftGeometry = new THREE.PlaneGeometry(7,48);
    geometries.push(shaftGeometry);
    [[-5,17,-9,.16],[5,19,-32,-.15],[-6,17,-99,.13],[7,20,-164,-.12],[-5,18,-274,.2],[6,18,-360,-.15]].forEach(([x,y,z,angle],i)=>{
      const material = new THREE.MeshBasicMaterial({map:shaftTexture,color:0xa6fbd0,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});
      atmosphericMaterials.push(material);
      const mesh=new THREE.Mesh(shaftGeometry,material);
      mesh.position.set(x,y,z);mesh.rotation.z=angle;scene.add(mesh);
      shafts.push({mesh,material,phase:i*1.8});
    });
    const dustCount=window.innerWidth<768?190:480;
    const dustPositions=new Float32Array(dustCount*3);
    const dustSeed=73;
    const random=n=>{const v=Math.sin(n*127.1+dustSeed)*43758.5453;return v-Math.floor(v);};
    for(let i=0;i<dustCount;i++){
      dustPositions[i*3]=(random(i*3)-.5)*48;
      dustPositions[i*3+1]=random(i*3+1)*32;
      dustPositions[i*3+2]=38-random(i*3+2)*500;
    }
    const dustGeometry=new THREE.BufferGeometry();
    dustGeometry.setAttribute("position",new THREE.BufferAttribute(dustPositions,3));
    geometries.push(dustGeometry);
    const dustMaterial=new THREE.PointsMaterial({color:0xb9f4d4,size:.14,transparent:true,opacity:.52,depthWrite:false,sizeAttenuation:true});
    scene.add(new THREE.Points(dustGeometry,dustMaterial));
    const heroDoors=[];
    for(const sign of [-1,1]){
      const door=block(5.6,22,.3,sign*2.85,11,0,new THREE.MeshStandardMaterial({color:0x196848,metalness:.65,roughness:.15,transparent:true,opacity:.38,side:THREE.DoubleSide}));
      heroDoors.push({door,sign});
    }
    const sceneLights=[
      [-105,0x65f4ae,38],[-160,0x4ae5a2,28],[-230,0x9fcfc0,30],
      [-286,0x66e9a6,38],[-330,0xe6f4e7,38],[-366,0x53d8a3,34],[-425,0x38e6a3,45]
    ];
    sceneLights.forEach(([z,color,intensity])=>{
      const light=new THREE.PointLight(color,intensity,68,2);
      light.position.set(0,15,z);scene.add(light);
    });
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
      geometries.push(edge.geometry);slabs.push({slab,edge,baseY:7,phase:i*.85});
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
    const innerPortal=new THREE.Mesh(new THREE.TorusGeometry(15,.16,10,64),new THREE.MeshBasicMaterial({color:0xb3ffdc,transparent:true,opacity:.55}));
    geometries.push(innerPortal.geometry);innerPortal.position.copy(portal.position);scene.add(innerPortal);
    const glowCanvas=document.createElement("canvas");glowCanvas.width=glowCanvas.height=128;
    const glowCtx=glowCanvas.getContext("2d");
    if(glowCtx){const gradient=glowCtx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,"rgba(91,255,176,.65)");gradient.addColorStop(.5,"rgba(20,153,96,.18)");gradient.addColorStop(1,"rgba(20,153,96,0)");glowCtx.fillStyle=gradient;glowCtx.fillRect(0,0,128,128);}
    const glowTexture=new THREE.CanvasTexture(glowCanvas);
    const glowMaterial=new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false});
    const glowGeometry=new THREE.PlaneGeometry(90,90);geometries.push(glowGeometry);
    const glow=new THREE.Mesh(glowGeometry,glowMaterial);glow.position.set(0,15,-433);scene.add(glow);
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
    const lookTarget=new THREE.Vector3();
    const motion={chapter:0};
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
      motion.chapter=index+eased;
      cameraFrom.copy(stations[index][0]);
      cameraTo.copy(stations[index+1][0]);
      cameraDestination.lerpVectors(cameraFrom,cameraTo,eased);
      cameraDestination.x+=x*1.2;
      cameraDestination.y-=pointerY*.6;
      cameraDestination.y+=Math.sin(t*.4)*.12;
      desiredLook.lerpVectors(stations[index][1],stations[index+1][1],eased);
      // A subtle cinematic dolly/orbit: each chapter feels like a different shot.
      const shot=motion.chapter;
      cameraDestination.x+=Math.sin(shot*Math.PI*.75)*1.6;
      cameraDestination.y+=Math.sin(shot*Math.PI*.55)*.55;
      lookTarget.copy(desiredLook);
      lookTarget.x+=Math.sin(shot*Math.PI*.6)*1.2;
      desiredLook.copy(lookTarget);
      camera.position.lerp(cameraDestination,.07);
      smoothLook.lerp(desiredLook,.07);
      camera.lookAt(smoothLook);
      const opening=easing(Math.min(1,Math.max(0,motion.chapter/.8)));
      heroDoors.forEach(({door,sign})=>{door.position.x=sign*(2.85+opening*6.8);door.material.opacity=.38*(1-opening*.8);});
      lattice.rotation.y=t*.09;
      lattice.rotation.z=Math.sin(t*.35)*.035;
      const techReveal=easing(Math.min(1,Math.max(0,(motion.chapter-1.2)/.8)));
      lattice.scale.setScalar(.7+techReveal*.3);
      slabs.forEach(({slab,edge,baseY,phase},i)=>{
        const selected=Math.max(0,1-Math.abs(motion.chapter-3)*1.1);
        slab.position.y=baseY+Math.sin(t*.55+phase)*(.24+selected*.35);
        slab.rotation.y=(i%2?-.32:.32)+Math.sin(t*.35+phase)*.06;
        edge.position.copy(slab.position);edge.rotation.copy(slab.rotation);
      });
      tower.rotation.y=Math.sin(t*.17)*.12;
      portal.rotation.z=t*.025;
      innerPortal.rotation.z=-t*.045;
      glowMaterial.opacity=.6+.18*Math.sin(t*.7);
      shafts.forEach(({material,phase})=>{material.opacity=.14+.07*(1+Math.sin(t*.55+phase));});
      dustMaterial.opacity=.4+.08*Math.sin(t*.3);
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
      scene.traverse(obj=>{if(obj.isMesh&&obj.material&&!Array.isArray(obj.material)&&!([metal,dark,emerald,floorMat,nodeMaterial,lineMaterial,glowMaterial,...atmosphericMaterials].includes(obj.material)))obj.material.dispose();});
      [metal, dark, emerald, floorMat, nodeMaterial, lineMaterial, glowMaterial, dustMaterial, innerPortal.material,...atmosphericMaterials].forEach(material=>material.dispose());
      shaftTexture.dispose();glowTexture.dispose();
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div className={"cinema-scene" + (failed ? " cinema-scene--fallback" : "")} ref={mountRef} aria-hidden="true" />;
}

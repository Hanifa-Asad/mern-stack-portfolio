import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./cinematic-tech-network.css";

const TECH=[
 ["React","FRONTEND"],["JavaScript","LANGUAGE"],["Node.js","BACKEND"],
 ["Express","API"],["MongoDB","DATABASE"],["Supabase","DATA"],
 ["Tailwind CSS","STYLING"],["Bootstrap","STYLING"],["Python","LANGUAGE"],
 ["GSAP","MOTION"],["Git / GitHub","TOOLS"],["Figma","DESIGN"]
];
const POS=[[-5,2,1],[-1,3,-1],[3,2,1],[5,-1,-2],[2,-3,0],[-2,-2,-1],[-6,-2,-2],[-4,-4,0],[0,0,3],[4,4,-2],[6,3,-3],[0,-4,1]];
export default function CinematicTechNetwork(){
 const ref=useRef(null);
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const host=ref.current;
  if(!host||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let renderer,frame=0,observer;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,24);
  const group=new THREE.Group();scene.add(group);
  const sphereGeometry=new THREE.IcosahedronGeometry(.5,2);
  const nodeMaterial=new THREE.MeshPhysicalMaterial({color:0x2eaf7b,metalness:.55,roughness:.17,clearcoat:1,clearcoatRoughness:.12,emissive:0x12613d,emissiveIntensity:.5});
  const nodes=POS.map((pos,i)=>{
   const mesh=new THREE.Mesh(sphereGeometry,nodeMaterial.clone());
   mesh.position.set(...pos);mesh.userData.index=i;group.add(mesh);return mesh;
  });
  const edges=[];
  POS.forEach((p,i)=>{for(let j=i+1;j<POS.length;j++){const q=POS[j],dist=Math.hypot(...p.map((v,k)=>v-q[k]));if(dist<6.9)edges.push(...p,...q);}});
  const lineGeo=new THREE.BufferGeometry();
  lineGeo.setAttribute("position",new THREE.Float32BufferAttribute(edges,3));
  const lineMat=new THREE.LineBasicMaterial({color:0x5cce9b,transparent:true,opacity:.33});
  group.add(new THREE.LineSegments(lineGeo,lineMat));
  const ambient=new THREE.HemisphereLight(0xe8fff3,0x0b2216,2);scene.add(ambient);
  const key=new THREE.PointLight(0x76ffc3,65,50);key.position.set(-8,7,10);scene.add(key);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(10,10);
  let hover=-1, running=false, visible=true;
  const resize=()=>{if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));camera.aspect=w/h;camera.updateProjectionMatrix();};
  const move=e=>{const rect=host.getBoundingClientRect();pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);};
  const click=()=>{if(hover>=0)setActive(hover);};
  const clock=new THREE.Clock();
  const render=()=>{
   if(!running)return;
   const t=clock.getElapsedTime();
   group.rotation.y=Math.sin(t*.15)*.12;
   group.rotation.x=Math.cos(t*.12)*.05;
   ray.setFromCamera(pointer,camera);
   const hits=ray.intersectObjects(nodes);
   hover=hits.length?hits[0].object.userData.index:-1;
   host.style.cursor=hover>=0?"pointer":"default";
   nodes.forEach((mesh,i)=>{
    mesh.position.y=POS[i][1]+Math.sin(t*.7+i*.9)*.14;
    const selected=i===active||i===hover;
    const scale=selected?1.48:1;
    mesh.scale.lerp(new THREE.Vector3(scale,scale,scale),.12);
    mesh.material.emissiveIntensity=selected?1.4:.4;
   });
   renderer.render(scene,camera);
   frame=requestAnimationFrame(render);
  };
  try{
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.setClearColor(0x000000,0);
   renderer.domElement.setAttribute("aria-hidden","true");
   host.appendChild(renderer.domElement);resize();
   host.addEventListener("pointermove",move);
   host.addEventListener("click",click);
   observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible&&!running){running=true;render();}else if(!visible){running=false;cancelAnimationFrame(frame);}}, {threshold:.05});
   observer.observe(host);
   window.addEventListener("resize",resize);
  }catch(error){console.warn("Technology network fallback",error);}
  return()=>{running=false;cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener("resize",resize);host.removeEventListener("pointermove",move);host.removeEventListener("click",click);nodes.forEach(mesh=>mesh.material.dispose());sphereGeometry.dispose();lineGeo.dispose();lineMat.dispose();renderer?.dispose();if(renderer?.domElement.parentNode===host)host.removeChild(renderer.domElement);};
 },[]);
 return <div className="cinema-network">
   <div className="cinema-network__canvas" ref={ref} aria-label="Interactive three-dimensional technology constellation"/>
   <div className="cinema-network__details"><span>CONNECTED SYSTEMS / {String(active+1).padStart(2,"0")}</span><h3>{TECH[active][0]}</h3><p>{TECH[active][1]}</p><small>Select a technology below or click a 3D node to explore.</small></div>
   <div className="cinema-network__selectors" aria-label="Technology selection">{TECH.map(([name],i)=><button key={name} type="button" className={active===i?"is-active":""} onClick={()=>setActive(i)} aria-pressed={active===i}>{name}</button>)}</div>
 </div>;
}
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "./cinematic-nav.css";

const chapters=[
 ["Home","INTRO"],["About","ABOUT"],["expertise","SYSTEMS"],
 ["Portofolio","WORK"],["experience","JOURNEY"],["teaching","EDUCATION"],
 ["award","AWARD"],["certificates","CREDENTIALS"],["Contact","CONTACT"]
];
const links=[["#Home","Home"],["#About","About"],["#Portofolio","Work"],["#experience","Journey"],["#certificates","Certificates"],["#Contact","Contact"]];

export default function CinematicNav(){
 const [open,setOpen]=useState(false);
 const [scrolled,setScrolled]=useState(false);
 const [chapter,setChapter]=useState(0);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    const y=window.scrollY+window.innerHeight*.45;
    const total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    setScrolled(window.scrollY>24);
    setProgress(Math.max(0,Math.min(1,window.scrollY/total)));
    let current=0;
    chapters.forEach(([id],i)=>{
     const el=document.getElementById(id);
     if(el&&el.getBoundingClientRect().top+window.scrollY<=y)current=i;
    });
    setChapter(current);
   });
  };
  update();
  window.addEventListener("scroll",update,{passive:true});
  window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
 },[]);
 useEffect(()=>{
  if(!open)return;
  const onKey=e=>{if(e.key==="Escape")setOpen(false)};
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
 },[open]);
 return <>
  <nav className={"cinema-nav"+(scrolled?" cinema-nav--scrolled":"")} aria-label="Main navigation">
   <a className="cinema-nav__brand" href="#Home" onClick={()=>setOpen(false)}>HANIFA<span>.</span></a>
   <button className="cinema-nav__toggle" type="button" aria-expanded={open} aria-controls="cinema-navigation" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
   <div id="cinema-navigation" className={"cinema-nav__links"+(open?" is-open":"")}>{links.map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)} aria-current={chapters[chapter][0]===href.slice(1)?"location":undefined}>{label}</a>)}</div>
   <a className="cinema-nav__cta" href="mailto:hanifaasasd23@gmail.com">LET'S TALK ↗</a>
  </nav>
  <div className="cinema-story-progress" aria-hidden="true"><div style={{transform:`scaleX(${progress})`}}/></div>
  <aside className="cinema-chapter-rail" aria-label="Story chapters">
   <span className="cinema-chapter-rail__label">CHAPTER {String(chapter+1).padStart(2,"0")} / 09</span>
   <div className="cinema-chapter-rail__markers">{chapters.map(([id,label],i)=><a key={id} href={"#"+id} className={i===chapter?"is-active":""} aria-label={"Jump to "+label} aria-current={i===chapter?"location":undefined} title={label}><span/></a>)}</div>
   <span className="cinema-chapter-rail__name">{chapters[chapter][1]}</span>
  </aside>
 </>;
}
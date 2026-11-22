import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "./cinematic-nav.css";
const links = [["#Home","Home"],["#About","About"],["#Portofolio","Work"],["#experience","Journey"],["#certificates","Certificates"],["#Contact","Contact"]];
export default function CinematicNav() {
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>24);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update)},[]);
 useEffect(()=>{if(!open)return;const onKey=e=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[open]);
 return <nav className={"cinema-nav"+(scrolled?" cinema-nav--scrolled":"")} aria-label="Main navigation">
  <a className="cinema-nav__brand" href="#Home" onClick={()=>setOpen(false)}>HANIFA<span>.</span></a>
  <button className="cinema-nav__toggle" type="button" aria-expanded={open} aria-controls="cinema-navigation" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
  <div id="cinema-navigation" className={"cinema-nav__links"+(open?" is-open":"")}>{links.map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</div>
  <a className="cinema-nav__cta" href="mailto:hanifaasasd23@gmail.com">LET'S TALK ↗</a>
 </nav>;
}
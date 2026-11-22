import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github, Layers3, Sparkles } from "lucide-react";
import { supabase } from "../../supabase";
import "./cinematic-project-detail.css";

const list = value => Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean) : [];
const validUrl = value => { try { const u = new URL(value); return ["https:","http:"].includes(u.protocol) ? u.href : null; } catch { return null; } };
export default function CinematicProjectDetail() {
 const { id } = useParams();
 const [project,setProject] = useState(null);
 const [state,setState] = useState("loading");
 useEffect(()=>{
  let alive=true;
  setState("loading");setProject(null);window.scrollTo(0,0);
  async function load(){
   let cached=[];
   try { cached=JSON.parse(localStorage.getItem("projects")||"[]"); } catch {}
   const found=Array.isArray(cached) ? cached.find(p=>String(p.id)===String(id)) : null;
   if(found && alive){setProject(found);setState("ready");}
   const {data,error}=await supabase.from("projects").select("*").eq("id",id).maybeSingle();
   if(!alive)return;
   if(data){setProject(data);setState("ready");}
   else if(!found){setState(error?"error":"missing");}
  }
  load().catch(()=>{if(alive)setState(s=>s==="ready"?s:"error")});
  return()=>{alive=false};
 },[id]);
 const title=project?.Title||project?.title||"Untitled project";
 const image=validUrl(project?.Img||project?.img);
 const demo=validUrl(project?.Link||project?.url);
 const github=project?.Github==="Private"?null:validUrl(project?.Github||project?.github);
 const features=list(project?.Features||project?.features);
 const tech=list(project?.TechStack||project?.techStack);
 return <main className="cinema-detail">
  <div className="cinema-detail__grain" aria-hidden="true"/>
  <div className="cinema-detail__shell">
   <header className="cinema-detail__top"><Link to="/?cinematic=1#Portofolio" className="cinema-detail__back"><ArrowLeft size={17}/> BACK TO SELECTED WORK</Link><span>HANIFA ASAD / PORTFOLIO</span></header>
   {state==="loading"&&<div className="cinema-detail__status" role="status">Loading project…</div>}
   {(state==="error"||state==="missing")&&<div className="cinema-detail__status"><h1>{state==="missing"?"Project not found":"Unable to load project"}</h1><p>Please return to the portfolio and try again.</p><Link to="/?cinematic=1#Portofolio">Explore projects <ArrowUpRight size={17}/></Link></div>}
   {project&&<><div className="cinema-detail__intro"><p className="cinema-detail__eyebrow"><Sparkles size={15}/> SELECTED WORK / CASE STUDY</p><h1>{title}</h1><p className="cinema-detail__description">{project.Description||project.description||"A selected project from my development portfolio."}</p><div className="cinema-detail__actions">{demo&&<a href={demo} target="_blank" rel="noopener noreferrer">EXPLORE LIVE PROJECT <ArrowUpRight size={17}/></a>}{github&&<a className="cinema-detail__secondary" href={github} target="_blank" rel="noopener noreferrer"><Github size={17}/> VIEW SOURCE</a>}</div></div>
   <div className="cinema-detail__visual">{image?<img src={image} alt={title+" project preview"} loading="eager"/>:<div className="cinema-detail__visual-fallback"><Layers3 size={50}/><span>PROJECT SHOWCASE</span></div>}<span className="cinema-detail__visual-label">01 / PROJECT OVERVIEW</span></div>
   <div className="cinema-detail__content"><section><p className="cinema-detail__eyebrow">01 / THE BUILD</p><h2>Technologies & tools.</h2>{tech.length?<div className="cinema-detail__tags">{tech.map((t,i)=><span key={i}>{t}</span>)}</div>:<p className="cinema-detail__muted">Technology details are not listed for this project.</p>}</section><section><p className="cinema-detail__eyebrow">02 / THE EXPERIENCE</p><h2>Key features.</h2>{features.length?<ul className="cinema-detail__features">{features.map((feature,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span>{feature}</li>)}</ul>:<p className="cinema-detail__muted">Feature details are not listed for this project.</p>}</section></div>
   <footer className="cinema-detail__footer"><span>DESIGNED & DEVELOPED WITH INTENTION</span><Link to="/?cinematic=1#Portofolio">MORE PROJECTS <ArrowUpRight size={16}/></Link></footer></>}
  </div>
 </main>;
}
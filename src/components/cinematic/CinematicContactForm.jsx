import { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import "./cinematic-contact.css";
const links=[
 ["EMAIL","mailto:hanifaasasd23@gmail.com"],
 ["LINKEDIN","https://www.linkedin.com/in/hanifa-asad-3715212aa"],
 ["GITHUB","https://github.com/Hanifa-Asad"],
 ["DOWNLOAD CV","https://drive.google.com/file/d/1wHEKQWYAZrfYp34BAW_0we2wWuvPo695/view?usp=drivesdk"]
];
export default function CinematicContactForm(){
 const [fields,setFields]=useState({name:"",email:"",message:""});
 const [status,setStatus]=useState("idle");
 const [notice,setNotice]=useState("");
 async function submit(e){
  e.preventDefault();setStatus("sending");setNotice("");
  try{
   const payload=new FormData();
   Object.entries(fields).forEach(([key,value])=>payload.append(key,value));
   payload.append("_subject","New Portfolio Contact Message");
   const response=await fetch("https://formsubmit.co/ajax/hanifaasasd23@gmail.com",{method:"POST",body:payload,headers:{Accept:"application/json"}});
   const data=await response.json();
   if(!response.ok||data.success===false||data.success==="false")throw new Error("Delivery not confirmed");
   setStatus("sent");setNotice("Message submitted. Thank you for reaching out.");
   setFields({name:"",email:"",message:""});
  }catch{
   setStatus("error");setNotice("Unable to confirm delivery. Please contact me by email.");
  }
 }
 return <div className="cinema-contact__widgets">
  <form className="cinema-contact__form" onSubmit={submit}>
   <label><span className="sr-only">Your name</span><input placeholder="Your name" name="name" required maxLength={100} autoComplete="name" value={fields.name} onChange={e=>setFields(v=>({...v,name:e.target.value}))} disabled={status==="sending"}/></label>
   <label><span className="sr-only">Your email</span><input placeholder="Your email" name="email" type="email" required maxLength={254} autoComplete="email" value={fields.email} onChange={e=>setFields(v=>({...v,email:e.target.value}))} disabled={status==="sending"}/></label>
   <label><span className="sr-only">Your message</span><textarea placeholder="Your message" name="message" rows={4} required minLength={10} maxLength={5000} value={fields.message} onChange={e=>setFields(v=>({...v,message:e.target.value}))} disabled={status==="sending"}/></label>
   <button type="submit" disabled={status==="sending"}>{status==="sending"?"SENDING…":"SEND MESSAGE"} <Send size={16}/></button>
   <p role="status" aria-live="polite">{notice}</p>
  </form>
  <aside className="cinema-contact__links" aria-label="Connect with Hanifa Asad">{links.map(([label,url])=><a key={label} href={url} {...(url.startsWith("http")?{target:"_blank",rel:"noopener noreferrer"}:{})}><span>{label}</span><ArrowUpRight size={19}/></a>)}</aside>
 </div>;
}
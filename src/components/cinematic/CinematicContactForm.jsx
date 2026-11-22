import { useState } from "react";
import { Send } from "lucide-react";
import Komentar from "../Commentar";
import "./cinematic-contact.css";
export default function CinematicContactForm() {
 const [fields,setFields]=useState({name:"",email:"",message:""});
 const [status,setStatus]=useState("idle");
 const [notice,setNotice]=useState("");
 async function submit(e) {
  e.preventDefault();setStatus("sending");setNotice("");
  try {
   const payload=new FormData();
   Object.entries(fields).forEach(([k,v])=>payload.append(k,v));
   payload.append("_subject","New Portfolio Contact Message");
   payload.append("_captcha","false");
   const response=await fetch("https://formsubmit.co/ajax/hanifaasasd23@gmail.com",{method:"POST",body:payload,headers:{Accept:"application/json"}});
   const body=await response.json();
   if(!response.ok || body.success===false || body.success==="false")throw new Error("Delivery not confirmed");
   setStatus("sent");setNotice("Your message was submitted successfully.");setFields({name:"",email:"",message:""});
  } catch(error) {setStatus("error");setNotice("Message could not be confirmed. Please email me directly instead.");}
 }
 return <div className="cinema-contact__widgets"><form className="cinema-contact__form" onSubmit={submit}>
  <h3>SEND AN INQUIRY</h3>
  <label>Your name<input required maxLength={100} name="name" autoComplete="name" value={fields.name} onChange={e=>setFields(v=>({...v,name:e.target.value}))} disabled={status==="sending"}/></label>
  <label>Email address<input required type="email" maxLength={254} name="email" autoComplete="email" value={fields.email} onChange={e=>setFields(v=>({...v,email:e.target.value}))} disabled={status==="sending"}/></label>
  <label>Tell me about your project<textarea required minLength={10} maxLength={5000} name="message" rows={5} value={fields.message} onChange={e=>setFields(v=>({...v,message:e.target.value}))} disabled={status==="sending"}/></label>
  <button type="submit" disabled={status==="sending"}>{status==="sending"?"SENDING…":"SEND MESSAGE"} <Send size={17}/></button>
  <p role="status" aria-live="polite">{notice}</p>
  </form><div className="cinema-contact__comments"><h3>COMMUNITY NOTES</h3><Komentar/></div></div>;
}
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github, X } from "lucide-react";
import { supabase } from "../../supabase";
import "./cinematic-sections.css";
import CinematicContactForm from "./CinematicContactForm";

const career = [
  ["2026 — PRESENT", "Corporate Python Instructor", "Data Logic", "Python, data analysis and practical business analytics training."],
  ["2026 — PRESENT", "Full Stack Trainer", "Skills Grid Academy", "Teaching modern web application development."],
  ["2025 — PRESENT", "Assistant Trainer", "Saylani Mass IT Training", "Mentoring learners in frontend and MERN stack development."],
  ["2026", "Technology Trainer", "Bahria College Karsaz", "Helping young learners explore web development, AI and creative technology."],
  ["2026", "Junior Full Stack Developer", "BITS Doha · Remote", "Full-stack development experience on distributed teams."]
];
const technologies = ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Supabase", "Tailwind CSS", "Bootstrap", "Python", "GSAP", "Git / GitHub", "Figma"];
const fallbackProjects = [
  ["Better Homes Lebanon", "https://betterhomeslb.com"],
  ["The Streaming Design", "https://thestreamingdesign.com"],
  ["Global Publishing", "https://e-book-website-plum.vercel.app"],
  ["Mortgage Health Check", "https://health-check-alpha.vercel.app"]
];
function Heading({ number, eyebrow, children }) {
  return <header className="cinema-section__heading"><span className="cinema-eyebrow">{number} / {eyebrow}</span><h2>{children}</h2></header>;
}
function usePortfolioData() {
  const [data, setData] = useState({ projects: [], certificates: [], loading: true });
  useEffect(() => {
    let alive = true;
    const readCache = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
    const cachedProjects = readCache("projects"), cachedCertificates = readCache("certificates");
    setData({ projects: cachedProjects, certificates: cachedCertificates, loading: true });
    Promise.all([
      supabase.from("projects").select("id, Title, Description, Img, Link, Github, Features, TechStack").order("id", { ascending: true }),
      supabase.from("certificates").select("*").order("id", { ascending: true })
    ]).then(([p, c]) => {
      if (!alive) return;
      const projects = p.error ? cachedProjects : p.data || [];
      const certificates = c.error ? cachedCertificates : c.data || [];
      if (!p.error) localStorage.setItem("projects", JSON.stringify(projects));
      if (!c.error) localStorage.setItem("certificates", JSON.stringify(certificates));
      setData({ projects, certificates, loading: false });
    }).catch(() => { if (alive) setData({ projects: cachedProjects, certificates: cachedCertificates, loading: false }); });
    return () => { alive = false; };
  }, []);
  return data;
}
function ProjectGallery({ projects, loading }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const items = projects.length ? projects.map(p => ({ id: p.id, title: p.Title, description: p.Description, image: p.Img, url: p.Link, github: p.Github })) : fallbackProjects.map(([title, url]) => ({ title, url }));
  const selected = items[Math.min(active, items.length - 1)];
  return <section className="cinema-section" id="Portofolio"><div className="cinema-container">
    <Heading number="03" eyebrow="ENGINEERED WITH INTENT">SELECTED <em>WORK.</em></Heading>
    {loading && <p className="cinema-muted" role="status">Loading portfolio projects…</p>}
    {!loading && !projects.length && <p className="cinema-muted">Showing selected public projects while live portfolio data is unavailable.</p>}
    <div className="cinema-projects">
      <div className="cinema-projects__list">{items.slice(0, showAll ? items.length : 6).map((p, i) =>
        <button key={p.id ?? p.title} className={"cinema-projects__item" + (active === i ? " is-active" : "")} onClick={() => setActive(i)} aria-pressed={active === i}><span>{String(i + 1).padStart(2, "0")}</span><strong>{p.title}</strong><ArrowUpRight size={19}/></button>
      )}{items.length > 6 && <button className="cinema-more" onClick={() => setShowAll(v => !v)}>{showAll ? "Show fewer" : "View all projects"}</button>}</div>
      <article className="cinema-projects__preview" aria-live="polite">
        {selected?.image ? <img src={selected.image} alt={selected.title + " project preview"} loading="lazy" /> : <div className="cinema-projects__placeholder" aria-hidden="true"><span>{selected?.title}</span></div>}
        <div className="cinema-projects__details"><h3>{selected?.title}</h3>{selected?.description && <p>{selected.description}</p>}
        <div className="cinema-projects__links">{selected?.id != null && <a href={"/project/" + encodeURIComponent(selected.id) + "?cinematic=1"}>Project details <ArrowUpRight size={16}/></a>}{selected?.url && <a href={selected.url} target="_blank" rel="noopener noreferrer">Live website <ArrowUpRight size={16}/></a>}{selected?.github && selected.github !== "Private" && <a href={selected.github} target="_blank" rel="noopener noreferrer">Source code <Github size={16}/></a>}</div></div>
      </article>
    </div>
  </div></section>;
}
function Certificates({ items, loading }) {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const imageFor = c => c.Img || c.img || c.image || c.Image || c.image_url || c.url;
  const titleFor = c => c.Title || c.title || c.Name || c.name || "Certificate";
  useEffect(() => {
    if (!selected) return;
    const onKey = e => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);
  return <section className="cinema-section" id="certificates"><div className="cinema-container"><Heading number="07" eyebrow="CONTINUOUS GROWTH">CREDENTIALS &amp; <em>GROWTH.</em></Heading>
    {loading && <p role="status">Loading certificates…</p>}
    {!loading && !items.length && <p className="cinema-muted">Certificate gallery will appear when Supabase records are available.</p>}
    <div className="cinema-cert-grid">{items.slice(0,showAll ? items.length : 6).map((c,i) => <button key={c.id ?? i} className="cinema-cert" onClick={() => setSelected(c)} aria-label={"Preview " + titleFor(c)}>{imageFor(c) ? <img src={imageFor(c)} alt="" loading="lazy" /> : <span className="cinema-cert__placeholder">CERTIFICATE / {String(i + 1).padStart(2,"0")}</span>}<strong>{titleFor(c)}</strong><span>VIEW CERTIFICATE ↗</span></button>)}</div>
    {items.length > 6 && <button className="cinema-more" onClick={() => setShowAll(v => !v)}>{showAll ? "Show fewer" : "View all certificates"}</button>}
    {selected && <div className="cinema-lightbox" role="presentation" onClick={() => setSelected(null)}><div className="cinema-lightbox__panel" role="dialog" aria-modal="true" aria-label={titleFor(selected)} tabIndex={-1} onClick={e => e.stopPropagation()}><button className="cinema-lightbox__close" onClick={() => setSelected(null)} aria-label="Close preview"><X/></button>{imageFor(selected) ? <img src={imageFor(selected)} alt={titleFor(selected)} /> : <p>Image unavailable</p>}<h3>{titleFor(selected)}</h3></div></div>}
  </div></section>;
}
export default function CinematicSections() {
  const root = useRef(null);
  const { projects, certificates, loading } = usePortfolioData();
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".cinema-section__heading").forEach((el) => {
        gsap.fromTo(el, {opacity:0,y:44,filter:"blur(9px)"}, {opacity:1,y:0,filter:"blur(0px)",duration:1.25,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
      });
      gsap.utils.toArray(".cinema-tech,.cinema-projects__item,.cinema-timeline__entry,.cinema-cert").forEach((el,i) => {
        gsap.fromTo(el,{opacity:0,y:22},{opacity:1,y:0,duration:.85,delay:(i%5)*.06,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 94%",once:true}});
      });
    },root);
    return () => ctx.revert();
  }, [loading]);
  return <div ref={root} className="cinema-shell cinema-sections">
    <section className="cinema-section cinema-about" id="About"><div className="cinema-container cinema-about__layout"><Heading number="01" eyebrow="THE PERSON BEHIND THE WORK">BEYOND <em>THE CODE.</em></Heading><div><p className="cinema-lead">I’m Hanifa Asad — a full-stack developer and technology educator building digital products that balance ambition with purpose.</p><p className="cinema-muted">From modern web applications and custom management systems to training the next generation of developers, my work connects technology, people and practical impact.</p><a className="cinema-text-link" href="https://drive.google.com/file/d/1wHEKQWYAZrfYp34BAW_0we2wWuvPo695/view?usp=drivesdk" target="_blank" rel="noopener noreferrer">Explore my CV <ArrowUpRight size={18}/></a></div></div></section>
    <section className="cinema-section" id="expertise"><div className="cinema-container"><Heading number="02" eyebrow="CONNECTED THINKING">THE SYSTEMS <em>I BUILD.</em></Heading><p className="cinema-muted">Technologies I use to create end-to-end digital experiences.</p><div className="cinema-tech-grid">{technologies.map((tech,i) => <div className="cinema-tech" key={tech}><span>{String(i+1).padStart(2,"0")}</span><strong>{tech}</strong></div>)}</div></div></section>
    <ProjectGallery projects={projects} loading={loading}/>
    <section className="cinema-section" id="experience"><div className="cinema-container"><Heading number="04" eyebrow="EXPERIENCE & EVOLUTION">THE <em>JOURNEY.</em></Heading><div className="cinema-timeline">{career.map(([date,role,org,description]) => <article className="cinema-timeline__entry" key={role+org}><time>{date}</time><div><h3>{role}</h3><p className="cinema-timeline__org">{org}</p><p className="cinema-muted">{description}</p></div></article>)}</div></div></section>
    <section className="cinema-section cinema-education" id="teaching"><div className="cinema-container"><Heading number="05" eyebrow="THE IMPACT OF SHARING KNOWLEDGE">BUILDING THE <em>NEXT GENERATION.</em></Heading><p className="cinema-lead">Technology becomes more powerful when knowledge is shared.</p><p className="cinema-muted">Through classroom instruction, corporate training and my Young Tech Explorers initiative, I help learners move from curiosity to real-world creation.</p><span className="cinema-education__signature">YOUNG TECH EXPLORERS / EDUCATION & INNOVATION</span></div></section>
    <section className="cinema-section cinema-award" id="award"><div className="cinema-container"><Heading number="06" eyebrow="RECOGNITION">FUTURE <em>LEADER.</em></Heading><p className="cinema-lead">Future Leaders Award 2026 · Tech Trainers</p><p className="cinema-muted">Recognition for the work of educating and inspiring future technology creators.</p></div></section>
    <Certificates items={certificates} loading={loading}/>
    <section className="cinema-section cinema-contact" id="Contact"><div className="cinema-container"><Heading number="08" eyebrow="YOUR NEXT IDEA STARTS HERE">LET’S BUILD SOMETHING <em>MEANINGFUL.</em></Heading><p className="cinema-lead">Have a project, collaboration or teaching opportunity in mind?</p><CinematicContactForm /></div></section>
    <footer className="cinema-footer"><div className="cinema-container">© {new Date().getFullYear()} HANIFA ASAD <span>DESIGNED TO BUILD WHAT MATTERS.</span></div></footer>
  </div>;
}

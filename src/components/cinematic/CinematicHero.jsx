import { lazy, Suspense, useEffect, useRef } from "react";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import gsap from "gsap";
import "./cinematic-hero.css";
const CinematicScene = lazy(() => import("./CinematicScene"));

export default function CinematicHero() {
  const root = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cinema-hero__reveal", { y: 45, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: "power3.out", delay: 0.12,
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="Home" className="cinema-shell cinema-hero" ref={root} aria-labelledby="cinema-hero-title">
      <Suspense fallback={<div className="cinema-scene cinema-scene--fallback" aria-hidden="true" />}>
        <CinematicScene />
      </Suspense>
      <div className="cinema-hero__shade" aria-hidden="true" />
      <div className="cinema-hero__content cinema-container">
        <div className="cinema-hero__top cinema-hero__reveal">
          <span className="cinema-eyebrow">PORTFOLIO / 2026</span>
          <span className="cinema-eyebrow">DIGITAL ARCHITECTURE</span>
        </div>
        <div className="cinema-hero__main">
          <p className="cinema-eyebrow cinema-hero__reveal">FULL STACK DEVELOPER · TECHNOLOGY EDUCATOR</p>
          <h1 id="cinema-hero-title" className="cinema-hero__title cinema-hero__reveal"><span>HANIFA</span><span>ASAD<span className="cinema-hero__dot">.</span></span></h1>
          <p className="cinema-hero__description cinema-hero__reveal">I build meaningful digital experiences, powerful management systems, and empower the next generation of technology creators.</p>
          <div className="cinema-hero__actions cinema-hero__reveal">
            <a className="cinema-hero__button cinema-hero__button--primary" href="#Portofolio">Explore my work <ArrowUpRight size={17}/></a>
            <a className="cinema-hero__button" href="#Contact">Let’s connect <ArrowUpRight size={17}/></a>
          </div>
        </div>
        <div className="cinema-hero__bottom cinema-hero__reveal">
          <span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
          <div className="cinema-hero__social">
            <a href="https://github.com/Hanifa-Asad" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18}/><span>GITHUB</span></a>
            <a href="https://www.linkedin.com/in/hanifa-asad-3715212aa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18}/><span>LINKEDIN</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, memo, useMemo, useState } from "react";
import {
  FileText,
  Code,
  Award,
  Globe,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  X,
} from "lucide-react";
import AOS from "aos";
import { motion, AnimatePresence } from "framer-motion";
import "aos/dist/aos.css";

// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      Building ideas into interactive experiences
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

const StatCard = memo(
  ({ icon: Icon, color, value, label, description, animation, onExperienceClick }) => (
    <div data-aos={animation} data-aos-duration={1300} className="relative group">
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
        <div
          className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
        ></div>

        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <span
            className="text-4xl font-bold text-white"
            data-aos="fade-up-left"
            data-aos-duration="1500"
            data-aos-anchor-placement="top-bottom"
          >
            {value}
          </span>
        </div>

        <div>
          <p
            className="text-sm uppercase tracking-wider text-gray-300 mb-2"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-anchor-placement="top-bottom"
          >
            {label}
          </p>
          <div className="flex items-center justify-between">
            <p
              className="text-xs text-gray-400"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-anchor-placement="top-bottom"
            >
              {description}
            </p>
            {label === "Years of Experience" ? (
              <button
                onClick={onExperienceClick}
                className="text-xs bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-2 py-1 rounded-md hover:scale-105 transition"
              >
                View
              </button>
            ) : (
              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
);

const ExperienceModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="relative bg-gradient-to-br from-[#1e1e2f] to-[#2a2a45] rounded-2xl p-6 sm:p-8 border border-white/10 max-w-md w-full shadow-2xl text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> Experience & Internships
          </h3>

          <ul className="space-y-3 text-sm sm:text-base">
            <li>
              🌐 <strong>Frontend Developer Intern</strong> — Prodigy InfoTech  
              <p className="text-gray-400">Built interactive UI and optimized performance using React.</p>
            </li>
            <li>
              💻 <strong>Frontend Developer Intern</strong> — GrowIntern  
              <p className="text-gray-400">Developed responsive websites and learned real-world project handling.</p>
            </li>
            <li>
              🚀 <strong>Assistant Trainer</strong> — SMIT  
              <p className="text-gray-400">Currently working as an Assistant Trainer at SMIT, teaching MERN Stack Development.</p>
            </li>
            <li>
              🎨 <strong>Freelance Digital Marketer, Web Developer & Designer</strong> — Online  
              <p className="text-gray-400">Created brand designs and marketing strategies for clients.</p>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AboutPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");

    const startDate = new Date("2021-11-06");
    const today = new Date();
    const experience =
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience,
    };
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const statsData = useMemo(
    () => [
      {
        icon: Code,
        color: "from-[#6366f1] to-[#a855f7]",
        value: totalProjects,
        label: "Total Projects",
        description: "Dynamic and responsive web apps",
        animation: "fade-right",
      },
      {
        icon: Award,
        color: "from-[#a855f7] to-[#6366f1]",
        value: totalCertificates,
        label: "Certificates",
        description: "Professional achievements",
        animation: "fade-up",
      },
      {
        icon: Globe,
        color: "from-[#6366f1] to-[#a855f7]",
        value: YearExperience,
        label: "Years of Experience",
        description: "Practical development experience",
        animation: "fade-left",
        onExperienceClick: () => setShowModal(true),
      },
    ],
    [totalProjects, totalCertificates, YearExperience]
  );

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm:mt-0"
      id="About"
    >
      <Header />
      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-1 gap-10 items-center text-center lg:text-left">
          <div className="space-y-6">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Hello, I'm
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Hanifa Asad
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              I’m <strong>Hanifa Asad</strong>, currently working as an Assistant Trainer at SMIT,
              where I teach MERN Stack Development. I’m passionate about building clean,
              interactive, and efficient web applications that offer great user experiences.
              My goal is to continuously grow as a developer and educator, exploring new
              technologies and delivering modern digital solutions that make a difference.
            </p>

            <div
              className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-gradient-to-r border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                "Turning creativity into code and innovation into experience."
              </blockquote>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 w-full">
              <a
                href="https://drive.google.com/drive/folders/1BOm51Grsabb3zj6Xk27K-iRwI1zITcpo"
                className="w-full lg:w-auto"
              >
                <button
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
                </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 hover:bg-[#a855f7]/10"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard
                key={stat.label}
                {...stat}
                onExperienceClick={stat.onExperienceClick}
              />
            ))}
          </div>
        </a>
      </div>

      <ExperienceModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default memo(AboutPage);
// ```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./index.css";
import Home from "./Pages/Home";
import { lazy, Suspense } from "react";
const CinematicHero = lazy(() => import("./components/cinematic/CinematicHero"));
const CinematicSections = lazy(() => import("./components/cinematic/CinematicSections"));
const CinematicNav = lazy(() => import("./components/cinematic/CinematicNav"));
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from "framer-motion";
import NotFoundPage from "./Pages/404";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  // Branch-only opt-in for design review; default keeps existing experience.
  const cinematicPreview = new URLSearchParams(window.location.search).get("cinematic") === "1";
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          !cinematicPreview && <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {(cinematicPreview || !showWelcome) && (
        <>
          {cinematicPreview ? <Suspense fallback={null}><CinematicNav /></Suspense> : <Navbar />}
          {!cinematicPreview && <AnimatedBackground />}
          {cinematicPreview ? <Suspense fallback={<div style={{ minHeight: "100vh", background: "#07100d" }} />}><CinematicHero /></Suspense> : <Home />}
          {cinematicPreview ? <Suspense fallback={null}><CinematicSections /></Suspense> : <><About /><Portofolio /><ContactPage /></>}

          {!cinematicPreview && <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "}
                <a
                  href="https://github.com/Hanifa-Asad"
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hanifa Asad™
                </a>
                . All Rights Reserved.
              </span>
            </center>
          </footer>}
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a
            href="https://github.com/Hanifa-Asad"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hanifa Asad™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              showWelcome={showWelcome}
              setShowWelcome={setShowWelcome}
            />
          }
        />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
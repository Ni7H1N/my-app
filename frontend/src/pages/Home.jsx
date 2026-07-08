import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import DevSecOps from "@/components/sections/DevSecOps";
import Projects from "@/components/sections/Projects";
import Cybersecurity from "@/components/sections/Cybersecurity";
import Achievements from "@/components/sections/Achievements";
import GlobalNetwork from "@/components/sections/GlobalNetwork";
import TerminalSection from "@/components/sections/TerminalSection";
import GitHubSection from "@/components/sections/GitHubSection";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <DevSecOps />
        <Projects />
        <Cybersecurity />
        <Achievements />
        <TerminalSection />
        <GlobalNetwork />
        <GitHubSection />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

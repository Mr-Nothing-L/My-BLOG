import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { siteConfig } from "./config";
import TransitionLayout from "./components/TransitionLayout";
import OrbitNav from "./components/OrbitNav";
import Portal from "./pages/Portal";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Works from "./pages/Works";
import Articles from "./pages/Articles";
import PostDetail from "./pages/PostDetail";
import ProjectDetail from "./pages/ProjectDetail";

const PAGE_ORDER = ["/", "/about", "/projects", "/works", "/articles"];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const wheelLockRef = useRef(false);

  useEffect(() => {
    document.title = siteConfig.siteTitle;
    document.documentElement.lang = siteConfig.language;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = siteConfig.siteDescription;
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;

      const currentPath = window.location.pathname;
      const isDetailPage = currentPath.startsWith("/posts/") || currentPath.startsWith("/project/");
      if (isDetailPage) return;

      const idx = PAGE_ORDER.indexOf(currentPath);
      if (idx === -1) return;

      if (e.deltaY > 30) {
        const nextIdx = (idx + 1) % PAGE_ORDER.length;
        wheelLockRef.current = true;
        setTimeout(() => { wheelLockRef.current = false; }, 1200);
        import("./components/TransitionLayout").then(({ transitionTo }) => {
          transitionTo(PAGE_ORDER[nextIdx], "next");
        });
      } else if (e.deltaY < -30) {
        const prevIdx = (idx - 1 + PAGE_ORDER.length) % PAGE_ORDER.length;
        wheelLockRef.current = true;
        setTimeout(() => { wheelLockRef.current = false; }, 1200);
        import("./components/TransitionLayout").then(({ transitionTo }) => {
          transitionTo(PAGE_ORDER[prevIdx], "prev");
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <TransitionLayout>
      <ScrollToTop />
      <div className="scanline-overlay">
        <OrbitNav />
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/works" element={<Works />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
    </TransitionLayout>
  );
}

export default App;

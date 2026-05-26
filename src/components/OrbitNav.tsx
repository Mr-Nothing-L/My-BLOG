import { useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { orbitNavItems } from "../config";
import { transitionTo } from "./TransitionLayout";

export default function OrbitNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navRef = useRef<HTMLElement>(null);

  const getDirection = (targetPath: string): 'next' | 'prev' => {
    const mainPaths = orbitNavItems.map((i) => i.path);
    const currentIdx = mainPaths.indexOf(currentPath);
    const targetIdx = mainPaths.indexOf(targetPath);
    if (currentIdx === -1 || targetIdx === -1) return 'next';
    return targetIdx > currentIdx ? 'next' : 'prev';
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>, color: string, isActive: boolean) => {
    const dot = e.currentTarget.querySelector(".orbit-nav-dot");
    const label = e.currentTarget.querySelector(".orbit-nav-label");
    if (dot) {
      gsap.to(dot, { scale: 2, duration: 0.35, ease: "back.out(2.5)" });
      gsap.to(dot, { boxShadow: `0 0 16px ${color}, 0 0 32px ${color}50`, duration: 0.3 });
    }
    if (label && !isActive) {
      gsap.to(label, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" });
    }
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>, isActive: boolean) => {
    const dot = e.currentTarget.querySelector(".orbit-nav-dot");
    const label = e.currentTarget.querySelector(".orbit-nav-label");
    if (dot) {
      gsap.to(dot, { scale: isActive ? 1.5 : 1, duration: 0.3, ease: "power2.out" });
    }
    if (label && !isActive) {
      gsap.to(label, { opacity: 0, x: -4, duration: 0.2, ease: "power2.in" });
    }
  };

  return (
    <nav ref={navRef} className="orbit-nav">
      {orbitNavItems.map((item) => {
        const isActive =
          item.path === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.path);

        return (
          <div
            key={item.path}
            className={`orbit-nav-item ${isActive ? "active" : ""}`}
            style={{ color: item.color }}
            onClick={() => {
              if (!isActive) {
                transitionTo(item.path, getDirection(item.path));
              }
            }}
            onMouseEnter={(e) => handleEnter(e, item.color, isActive)}
            onMouseLeave={(e) => handleLeave(e, isActive)}
            title={item.label}
          >
            <span
              className="orbit-nav-dot"
              style={{
                background: item.color,
                boxShadow: isActive
                  ? `0 0 12px ${item.color}, 0 0 24px ${item.color}40`
                  : `0 0 4px ${item.color}60`,
              }}
            />
            <span className="orbit-nav-label" style={{ color: item.color }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

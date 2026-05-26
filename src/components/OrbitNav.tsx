import { useLocation } from "react-router-dom";
import { orbitNavItems } from "../config";
import { transitionTo } from "./TransitionLayout";

export default function OrbitNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getDirection = (targetPath: string): 'next' | 'prev' => {
    const mainPaths = orbitNavItems.map((i) => i.path);
    const currentIdx = mainPaths.indexOf(currentPath);
    const targetIdx = mainPaths.indexOf(targetPath);
    if (currentIdx === -1 || targetIdx === -1) return 'next';
    return targetIdx > currentIdx ? 'next' : 'prev';
  };

  return (
    <nav className="orbit-nav">
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

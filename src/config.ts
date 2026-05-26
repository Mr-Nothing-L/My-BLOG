export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export interface OrbitNavItem {
  path: string;
  label: string;
  color: string;
}

export interface HeroConfig {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  leadText: string;
}

export interface AboutConfig {
  sectionLabel: string;
  bio: string[];
  skills: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  slug: string;
  name: string;
  code: string;
  year: string;
  description: string;
  techStack: string[];
  status: string;
  link: string;
  github: string;
  color: string;
}

export interface ProjectsConfig {
  sectionLabel: string;
  items: ProjectItem[];
}

export interface WorkItem {
  src: string;
  label: string;
  category: string;
  year: string;
}

export interface WorksConfig {
  sectionLabel: string;
  vaultTitle: string;
  closeText: string;
  items: WorkItem[];
}

export interface ArticlesConfig {
  sectionLabel: string;
  subtitle: string;
}

export interface FooterConfig {
  copyrightText: string;
  statusText: string;
}

// ─────────────────────────────────────────────
// SITE CONFIG
// ─────────────────────────────────────────────
export const siteConfig: SiteConfig = {
  language: "zh-CN",
  siteTitle: "MR.L · 信息奇点",
  siteDescription: "Mr.L 的个人空间 — 计算机视觉、深度学习与代码艺术的交汇点",
};

// ─────────────────────────────────────────────
// ORBIT NAVIGATION
// ─────────────────────────────────────────────
export const orbitNavItems: OrbitNavItem[] = [
  { path: "/", label: "奇点", color: "#ffffff" },
  { path: "/about", label: "视界", color: "#ff2a2a" },
  { path: "/projects", label: "吸积", color: "#2a5fff" },
  { path: "/works", label: "透镜", color: "#00e5ff" },
  { path: "/articles", label: "流束", color: "#ff9500" },
];

// ─────────────────────────────────────────────
// HERO / PORTAL
// ─────────────────────────────────────────────
export const heroConfig: HeroConfig = {
  eyebrow: "COMPUTER VISION ENGINEER / 2025",
  titleLines: ["MR.L", "信息奇点"],
  subtitle: "代码即引力，数据即星光",
  leadText:
    "一名深耕计算机视觉与深度学习的工程师，在智能交通与自动驾驶的星图中寻找最优解。这里记录我的技术轨迹与创意碎片。",
};

// ─────────────────────────────────────────────
// ABOUT / EVENT HORIZON
// ─────────────────────────────────────────────
export const aboutConfig: AboutConfig = {
  sectionLabel: "视界 / EVENT HORIZON",
  bio: [
    "我是 Mr.L，一名专注于计算机视觉和深度学习的工程师。",
    "在 3D 目标检测、车道线识别、交通事件判别和多目标跟踪领域有实际项目经验。",
    "热衷于将前沿 AI 技术落地到真实场景中，同时也沉迷于构建开发者工具链。",
    "相信代码是思考的外化，每一个项目都是向未知深处的一次引力探测。",
  ],
  skills: [
    "Python",
    "PyTorch",
    "OpenCV",
    "TensorFlow",
    "CUDA",
    "Docker",
    "React",
    "TypeScript",
    "Shell",
    "Git",
    "Linux",
    "Computer Vision",
    "Deep Learning",
    "MLOps",
  ],
  timeline: [
    {
      year: "2025",
      title: "交通事件判别系统",
      description: "构建端到端的交通视频分析系统，支持多类事件实时检测",
    },
    {
      year: "2025",
      title: "无人机多目标跟踪",
      description: "UAV-MOT 项目，针对无人机视角下的多目标跟踪优化",
    },
    {
      year: "2025",
      title: "Agent Teams 插件",
      description: "为 Claude Code 开发原生 Agent Teams 插件，支持随机人格与领袖模式",
    },
    {
      year: "2024",
      title: "3D 检测与车道识别",
      description: "CenterPoint 3D 检测与 CLRNet 车道线检测的工程化实践",
    },
  ],
};

// ─────────────────────────────────────────────
// PROJECTS / ACCRETION DISK
// ─────────────────────────────────────────────
export const projectsConfig: ProjectsConfig = {
  sectionLabel: "吸积盘 / ACCRETION",
  items: [
    {
      slug: "traffic-analyzer",
      name: "交通事件判别系统",
      code: "TRA-01",
      year: "2025",
      description:
        "端到端交通视频分析系统。支持车辆检测、轨迹追踪、事件判别（违停、逆行、拥堵等），基于深度学习实现实时推理。",
      techStack: ["Python", "PyTorch", "OpenCV", "YOLO", "Docker"],
      status: "活跃开发中",
      link: "https://github.com/Mr-Nothing-L/traffic-analyzer-system",
      github: "Mr-Nothing-L/traffic-analyzer-system",
      color: "#ff2a2a",
    },
    {
      slug: "uav-mot",
      name: "无人机多目标跟踪",
      code: "UAV-02",
      year: "2025",
      description:
        "针对无人机视角下的多目标跟踪优化方案。解决小目标、遮挡、快速运动等挑战性场景下的跟踪稳定性问题。",
      techStack: ["Python", "PyTorch", "MOT", "DeepSORT", "Kalman Filter"],
      status: "活跃开发中",
      link: "https://github.com/Mr-Nothing-L/UAV-MOT",
      github: "Mr-Nothing-L/UAV-MOT",
      color: "#2a5fff",
    },
    {
      slug: "awesome-agent-team",
      name: "Agent Teams 插件",
      code: "AGT-03",
      year: "2025",
      description:
        "Claude Code 原生 Agent Teams 插件。支持随机命名、人格分配、Visionary Leader 模式，让多 Agent 协作更丝滑。",
      techStack: ["TypeScript", "Claude API", "Shell", "Node.js"],
      status: "持续维护",
      link: "https://github.com/Mr-Nothing-L/awesome-agent-team",
      github: "Mr-Nothing-L/awesome-agent-team",
      color: "#00e5ff",
    },
    {
      slug: "centerpoint-3d",
      name: "CenterPoint 3D 检测",
      code: "C3D-04",
      year: "2024",
      description:
        "基于 CenterPoint 的 3D 目标检测工程实现。支持点云数据预处理、模型训练与推理部署。",
      techStack: ["Python", "PyTorch", "OpenPCDet", "CUDA", "LiDAR"],
      status: "已完成",
      link: "https://github.com/Mr-Nothing-L/centerpoint-3d-detection",
      github: "Mr-Nothing-L/centerpoint-3d-detection",
      color: "#ff9500",
    },
    {
      slug: "clrnet-lane",
      name: "CLRNet 车道检测",
      code: "CLR-05",
      year: "2024",
      description:
        "基于 CLRNet 的高精度车道线检测系统。在复杂路况（弯道、阴影、遮挡）下保持鲁棒性。",
      techStack: ["Python", "PyTorch", "OpenCV", "ONNX"],
      status: "已完成",
      link: "https://github.com/Mr-Nothing-L/clrnet-lane-detection",
      github: "Mr-Nothing-L/clrnet-lane-detection",
      color: "#a855f7",
    },
    {
      slug: "vibevoice",
      name: "VibeVoice",
      code: "VIB-06",
      year: "2025",
      description:
        "开源前沿语音 AI 前端。探索大模型与语音交互的边界，构建自然流畅的语音对话体验。",
      techStack: ["TypeScript", "React", "WebRTC", "WebSocket"],
      status: "探索中",
      link: "https://github.com/Mr-Nothing-L/VibeVoice",
      github: "Mr-Nothing-L/VibeVoice",
      color: "#22c55e",
    },
  ],
};

// ─────────────────────────────────────────────
// WORKS / GRAVITATIONAL LENS
// ─────────────────────────────────────────────
export const worksConfig: WorksConfig = {
  sectionLabel: "透镜 / GRAVITATIONAL LENS",
  vaultTitle: "进入视界",
  closeText: "折叠",
  items: [
    { src: "", label: "交通事件判别 / 实时推理", category: "CV", year: "2025" },
    { src: "", label: "无人机跟踪 / 多目标", category: "MOT", year: "2025" },
    { src: "", label: "Agent Teams / 多智能体", category: "Tool", year: "2025" },
    { src: "", label: "3D 检测 / 点云处理", category: "3D", year: "2024" },
    { src: "", label: "车道检测 / 边缘计算", category: "CV", year: "2024" },
    { src: "", label: "周报生成 / 自动化", category: "Tool", year: "2025" },
  ],
};

// ─────────────────────────────────────────────
// ARTICLES / DATA STREAM
// ─────────────────────────────────────────────
export const articlesConfig: ArticlesConfig = {
  sectionLabel: "流束 / DATA STREAM",
  subtitle: "从数据深渊中捕获的思想碎片",
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
export const footerConfig: FooterConfig = {
  copyrightText: "MR.L · 信息奇点 / 2025",
  statusText: "系统运行正常 / 事件视界稳定",
};

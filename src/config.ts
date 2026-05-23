export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  eyebrow: string
  titleLines: string[]
  leadText: string
  supportingNotes: string[]
}

export interface ManifestoConfig {
  videoPath: string
  text: string
}

export interface FacilityArticle {
  title: string
  paragraphs: string[]
}

export interface FacilityItem {
  slug: string
  name: string
  code: string
  address: string
  status: string
  email: string
  phone: string
  ctaText: string
  ctaHref: string
  image: string
  utcOffset: number
  article: FacilityArticle
}

export interface FacilitiesConfig {
  sectionLabel: string
  detailBackText: string
  detailNotFoundText: string
  detailReturnText: string
  items: FacilityItem[]
}

export interface ObservationConfig {
  sectionLabel: string
  videoPath: string
  statusText: string
  latLabel: string
  lonLabel: string
  initialLat: number
  initialLon: number
}

export interface ArchiveItem {
  src: string
  label: string
}

export interface ArchivesConfig {
  sectionLabel: string
  vaultTitle: string
  closeText: string
  items: ArchiveItem[]
}

export interface FooterConfig {
  copyrightText: string
  statusText: string
}

export const siteConfig: SiteConfig = {
  language: "zh-CN",
  siteTitle: "月球观测站",
  siteDescription: "一座实验性的轨道观测站点，记录关于月球、空间与观测的一切。",
}

export const navigationConfig: NavigationConfig = {
  brandName: "LUNAR",
  links: [
    { label: "观测", href: "#observation" },
    { label: "设施", href: "#facilities" },
    { label: "档案", href: "#archives" },
    { label: "文章", href: "#articles" },
  ],
}

export const heroConfig: HeroConfig = {
  eyebrow: "实验性轨道观测项目 / 2025",
  titleLines: ["月球", "观测站"],
  leadText: "我们建立了一座位于虚拟轨道的观测站点，通过 ASCII 字符重构月面，以数据与影像记录每一刻的月相变化。",
  supportingNotes: [
    "实时月面渲染系统，基于 WebGL 与字符编码",
    "archive vault 持续收录历史观测数据与影像档案",
    "所有数据向公众开放，欢迎成为观测协作者",
  ],
}

export const manifestoConfig: ManifestoConfig = {
  videoPath: "",
  text: "观测不仅是对遥远天体的凝视，更是一种对时间与存在的沉思。我们相信，在数字化时代，最原始的媒介——文字与符号——依然能够承载最深邃的诗意。月球观测站致力于用最简洁的技术语言，呈现最宏大的宇宙图景。",
}

export const facilitiesConfig: FacilitiesConfig = {
  sectionLabel: "观测设施",
  detailBackText: "返回设施目录",
  detailNotFoundText: "未找到该设施",
  detailReturnText: "返回目录",
  items: [
    {
      slug: "main-observatory",
      name: "主观测台",
      code: "OBS-01",
      address: "虚拟轨道 / 近月点",
      status: "运行中",
      email: "obs@lunar.station",
      phone: "",
      ctaText: "查看详情",
      ctaHref: "#",
      image: "",
      utcOffset: 8,
      article: {
        title: "主观测台",
        paragraphs: [
          "主观测台是整个站点的核心设施，配备高分辨率月面扫描系统。",
          "通过实时数据传输，观测台能够捕捉月面最微小的变化，并生成 ASCII 字符可视化输出。",
        ],
      },
    },
    {
      slug: "telemetry-lab",
      name: "遥测实验室",
      code: "TLM-02",
      address: "地下层 B2",
      status: "运行中",
      email: "tlm@lunar.station",
      phone: "",
      ctaText: "查看详情",
      ctaHref: "#",
      image: "",
      utcOffset: 8,
      article: {
        title: "遥测实验室",
        paragraphs: [
          "遥测实验室负责处理来自所有观测点的原始数据流。",
          "实验室配备自研信号解析系统，能够从噪声中提取有效信息。",
        ],
      },
    },
    {
      slug: "archive-vault",
      name: "档案库",
      code: "ARC-03",
      address: "地下层 B3",
      status: "维护中",
      email: "arc@lunar.station",
      phone: "",
      ctaText: "查看详情",
      ctaHref: "#",
      image: "",
      utcOffset: 8,
      article: {
        title: "档案库",
        paragraphs: [
          "档案库收藏了自观测站建立以来的所有观测记录与影像资料。",
          "每一份档案都经过编号、分类与数字化处理，确保长期保存。",
        ],
      },
    },
    {
      slug: "relay-station",
      name: "中继站",
      code: "RLY-04",
      address: "轨道远端",
      status: "运行中",
      email: "rly@lunar.station",
      phone: "",
      ctaText: "查看详情",
      ctaHref: "#",
      image: "",
      utcOffset: 0,
      article: {
        title: "中继站",
        paragraphs: [
          "中继站位于轨道远端，负责将观测数据传回地面接收站。",
          "该设施是整个通信链路的关键节点，确保数据传输的连续性。",
        ],
      },
    },
  ],
}

export const observationConfig: ObservationConfig = {
  sectionLabel: "实时观测",
  videoPath: "",
  statusText: "系统正常 / 实时传输中",
  latLabel: "纬度",
  lonLabel: "经度",
  initialLat: 0.6741,
  initialLon: 23.4732,
}

export const archivesConfig: ArchivesConfig = {
  sectionLabel: "观测档案",
  vaultTitle: "打开档案库",
  closeText: "关闭",
  items: [
    { src: "", label: "2025.01 / 满月观测" },
    { src: "", label: "2025.02 / 月蚀记录" },
    { src: "", label: "2025.03 / 环形山扫描" },
    { src: "", label: "2025.04 / 轨道偏移" },
  ],
}

export const footerConfig: FooterConfig = {
  copyrightText: "月球观测站 / 2025",
  statusText: "系统运行正常",
}

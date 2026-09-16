// 统一 SVG 图标注册表 —— Lucide 风格：24x24 viewBox、stroke=currentColor、圆角端点
// 矢量图形天然适配 2x/3x 及任意分辨率

export interface IconDef {
  viewBox?: string
  // 描边路径（fill=none, stroke=currentColor）
  body: string
  // 是否为填充型图标（如实心星）
  filled?: boolean
}

const stroke = (paths: string) => paths

export const icons: Record<string, IconDef> = {
  sun: {
    body: stroke(`
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    `)
  },
  moon: {
    body: stroke(`
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    `)
  },
  star: {
    body: stroke(`
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.58L12 17.57l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"/>
    `)
  },
  'star-filled': {
    filled: true,
    body: `
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.58L12 17.57l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"/>
    `
  },
  search: {
    body: stroke(`
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
    `)
  },
  check: {
    body: stroke(`
      <path d="M20 6L9 17l-5-5"/>
    `)
  },
  'chevron-down': {
    body: stroke(`
      <path d="M6 9l6 6 6-6"/>
    `)
  },
  book: {
    body: stroke(`
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/>
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>
    `)
  },
  hash: {
    body: stroke(`
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>
    `)
  },
  target: {
    body: stroke(`
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1"/>
    `)
  },
  'arrow-right': {
    body: stroke(`
      <path d="M5 12h14M13 6l6 6-6 6"/>
    `)
  },
  'external-link': {
    body: stroke(`
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <path d="M15 3h6v6M10 14L21 3"/>
    `)
  },
  sparkles: {
    body: stroke(`
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/>
    `)
  },
  layers: {
    body: stroke(`
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
    `)
  },
  'circle-dot': {
    body: stroke(`
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
    `)
  }
}

export type IconName = keyof typeof icons

# Cursor 官网浅色风格 UI/UX 全面升级计划

## Context

本项目是基于 VitePress 的 LeetCode Hot 100 题解知识库（`docs/` 为站点源）。当前视觉为默认 VitePress 风格 + 一层自定义 CSS（indigo 主色、卡片阴影、渐变标题），并存在 Emoji 图标（☀️/🌙/⭐/🟢🟠🔴/🔍）与自定义 `data-theme` 主题切换（与 VitePress 原生 `dark` class 机制不一致，实际切换可能不生效）。

目标：完整复刻 Cursor 官网浅色模式的视觉语言（大留白、黑白主基调、发丝级边框、细腻阴影、圆角规范、现代无衬线字体），用统一的内联 SVG 图标系统替换全部 UI Emoji，补充微交互，且**功能零损失**（收藏、筛选、搜索、主题切换、KaTeX/Mermaid 渲染均保持原样）。

已确认决策：
- 字体方案：**Inter + Noto Sans SC**，代码字体 JetBrains Mono 不变
- 暗色模式：**保留切换按钮，双主题适配**（亮色按 Cursor 风格精调，暗色 token 映射到 VitePress 默认变量）
- review 正文 14 处「难度：⭐⭐⭐」：**保留原样**（属于内容语义，非 UI 图标）

---

## 1. 设计 Token 系统（重写 custom.css 头部）

以 Cursor 浅色风格为基准，在 [custom.css](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/styles/custom.css) 中重建 `:root` token（并新增 `html.dark` 映射）：

**色彩**
| Token | 亮色值 | 说明 |
|---|---|---|
| `--lc-bg` | `#ffffff` | 页面主背景 |
| `--lc-bg-soft` | `#fafafa` | 卡片/浮层背景 |
| `--lc-bg-mute` | `#f0f0f2` | 标签、hover 底 |
| `--lc-ink` | `#0a0a0a` | 主文字、主按钮（Cursor 核心黑） |
| `--lc-text-2` | `#52525b` | 次级文字 |
| `--lc-text-3` | `#a1a1aa` | 辅助文字 |
| `--lc-border` | `rgba(0,0,0,0.08)` | 发丝边框 |
| `--lc-brand` | `#0a0a0a`（主操作）/ 链接强调保留靛蓝 `#4f46e5` | 新增 `--lc-accent` 用于链接、题号 |
| 难度语义色 | 绿 `#10b981` / 橙 `#f59e0b` / 红 `#ef4444` | 保留，仅微调饱和度 |

**间距**：4px 基准刻度；卡片内边距 20→24px；栅格 gap 16→20px。

**圆角**：`--lc-radius-sm:6px / md:10px / lg:14px / pill:999px`（按钮、tab 激活态用 pill）。

**阴影层级**（Cursor 式"边框为主、阴影为辅"）：
- rest：`0 1px 2px rgba(0,0,0,0.04)`
- hover：`0 8px 24px rgba(0,0,0,0.06)`
- overlay（搜索弹窗等）：`0 12px 40px rgba(0,0,0,0.10)`

**动效曲线**：统一 `cubic-bezier(0.16, 1, 0.3, 1)`（ease-out-expo）；时长 150–300ms；新增 `@media (prefers-reduced-motion: reduce)` 降级。

## 2. 字体系统（config.ts）

[config.ts](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/config.ts) head 中 Google Fonts 链接更新为：
`Inter:wght@400;500;600;700 + Noto Sans SC:wght@400;500;700`，`theme-color` 改为 `#ffffff`。
`--lc-font-sans: 'Inter', 'Noto Sans SC', -apple-system, 'Segoe UI', sans-serif`，标题字重 600/700 + `letter-spacing:-0.02em`（Cursor 标志性排印）。

## 3. 自定义 SVG 图标系统（新建）

新建 [docs/.vitepress/theme/components/icons/](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/components/icons/)：
- `icons.ts`：SVG path 注册表（24×24 viewBox、`stroke="currentColor"`、`stroke-width="1.8`、圆角端点，Lucide 风格）：`sun / moon / star / star-filled / search / check / chevron-down / book / hash / target / arrow-right / external-link / sparkles / layers`
- `LcIcon.vue`：通用图标组件（`name`、`size` props，继承 currentColor）

矢量 SVG 天然满足 2x/3x 及任意分辨率清晰显示，无需多倍图位图。

**Emoji 替换落点**：
| 位置 | 现状 | 替换 |
|---|---|---|
| [Layout.vue](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/Layout.vue) 主题按钮 | ☀️/🌙 | sun/moon 图标 + 旋转淡入过渡 |
| [ProblemCard.vue](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/components/ProblemCard.vue) 收藏 | ⭐/☆ | star-filled/star 图标 + 点击弹跳动画 |
| [FilterBar.vue](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/components/FilterBar.vue) 难度下拉 | 🟢🟠🔴 | 原生 `<select>` 保留（移动端兼容），选项改为纯文本；选中值旁以 CSS 圆点指示当前难度色 |
| FilterBar 收藏按钮 | ⭐ | star 图标 + 「仅收藏」 |
| [ProblemList.vue](file:///d:/trae_projects/my-leetcode-blog/docs/.vitepress/theme/components/ProblemList.vue) 空状态 | 🔍 | search 图标 + 精致空状态文案排版 |
| config.ts 侧边栏分组 | 🟢🟠🔴 简单/中等/困难 | 纯文本（Cursor 式克制；难度色由卡片徽章承担） |

## 4. 微交互升级

- **按钮/卡片**：hover 微浮起 + 阴影过渡；`:active` 缩放 0.97
- **表单反馈**：输入框/下拉聚焦时 2px 强调色 focus ring（`box-shadow: 0 0 0 3px rgba(79,70,229,0.15)`），替代现单纯变色
- **Tab 切换**：激活态 pill 黑底白字 + 平滑过渡
- **主题切换**：sun/moon 图标交叉淡入 + 90° 旋转
- **收藏**：star 缩放弹跳（spring 曲线关键帧）
- **入场动画**：保留卡片 stagger fadeInUp，统一新曲线；加 `prefers-reduced-motion` 降级
- **导航/侧栏**（VitePress chrome 覆盖）：导航栏白色毛玻璃 + 底部发丝线；侧栏激活项圆角 pill 高亮；本地搜索弹窗按新 token 重绘圆角/阴影
- **代码块**：圆角 10px + 发丝边框，语言标签样式细化

## 5. 主题切换机制修复（功能无损）

Layout.vue 的 `toggleTheme` 当前写 `data-theme` 属性，与 VitePress 原生机制（html `dark` class + localStorage `vitepress-theme-appearance`）脱节。改为同步切换 `dark` class 并写入 VitePress 约定存储键，初始挂载读取逻辑对齐——按钮位置、交互方式不变，暗色样式经 `html.dark` token 映射生效。

## 6. 修改文件清单

1. `docs/.vitepress/theme/styles/custom.css` — 全面重构（token / base / 组件 / VP chrome / 动效 / dark 映射 六段式）
2. `docs/.vitepress/config.ts` — 字体链接、theme-color、侧边栏 Emoji 移除
3. 新建 `theme/components/icons/icons.ts`、`LcIcon.vue`
4. `Layout.vue` / `ProblemCard.vue` / `FilterBar.vue` / `ProblemList.vue` / `ReviewTab.vue` / `ReviewCard.vue` — 图标接入 + 样式类适配
5. `review/*.md`、`problems/*.md` — **不动**

## 验证

1. `npm run docs:dev` 启动后逐页检查：
   - 首页：hero/统计/进度条/tab 切换/筛选（难度、标签、收藏、搜索）/卡片 stagger 动画/空状态
   - 题目页与知识点页（各抽 2 篇）：KaTeX、Mermaid、代码块、侧栏、上一页/下一页
   - 明暗切换往返，刷新后主题保持（localStorage 生效）
   - 收藏 → 刷新验证持久化；筛选组合无回归
   - 本地搜索弹窗样式与可用性
   - 375px 移动视口检查响应式
2. `npm run docs:build` 确认生产构建无 CSS/SSR 报错。

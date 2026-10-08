#!/usr/bin/env node
/**
 * create-demo.mjs —— 从模板生成一个单文件图解演示
 *
 *   node scripts/create-demo.mjs <slug> [--archetype <a>] [--title <t>] [--force] [--dry-run]
 *   node scripts/create-demo.mjs --list-missing
 *
 * 产物：docs/public/demos/<slug>/index.html
 * 目录名 + 显式 index.html 是刻意的：CI 的 clean-URL 重写脚本用
 * `-not -name 'index.html'` 过滤（匹配 basename），这样布局会被它跳过，
 * 同一个 src 字符串在 dev / preview / GitHub Pages 三处都成立。
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DEMOS = join(ROOT, 'docs', 'public', 'demos')
const PROBLEMS = join(ROOT, 'docs', 'problems')
const TPL = join(ROOT, 'scripts', 'templates')

const ARCHETYPES = ['array-hash', 'linked-list', 'binary-tree', 'backtrack-tree', 'grid', 'dp-table']
const SLUG_RE = /^\d{3,4}-[a-z0-9]+(?:-[a-z0-9]+)*$/

const rel = (p) => relative(ROOT, p).split('\\').join('/')
const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1) }
/** 仓库现状是 LF；Windows 下读到的模板可能是 CRLF，统一归一 */
const lf = (s) => s.replace(/\r\n/g, '\n')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function problemSlugs() {
  return readdirSync(PROBLEMS)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => f.slice(0, -3))
    .sort()
}

function demoSlugs() {
  if (!existsSync(DEMOS)) return []
  return readdirSync(DEMOS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(DEMOS, d.name, 'index.html')))
    .map((d) => d.name)
    .sort()
}

function titleOf(slug) {
  const md = readFileSync(join(PROBLEMS, `${slug}.md`), 'utf8')
  const m = md.match(/^title:\s*["']?(.+?)["']?\s*$/m)
  return m ? m[1] : slug
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    archetype: { type: 'string', default: 'array-hash' },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    'list-missing': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false }
  }
})

if (values.help) {
  console.log(`用法：node scripts/create-demo.mjs <slug> [--archetype <a>] [--title <t>] [--force] [--dry-run]
      node scripts/create-demo.mjs --list-missing

  <slug>          题解文件名（不含 .md），如 001-two-sum
  --archetype     ${ARCHETYPES.join(' | ')}（默认 array-hash）
  --title         覆盖标题，默认取 md frontmatter 的 title
  --force         允许覆盖已存在的 demo
  --dry-run       只打印将做什么，不写文件
  --list-missing  列出还没有图解演示的题目`)
  process.exit(0)
}

if (values['list-missing']) {
  const have = new Set(demoSlugs())
  const missing = problemSlugs().filter((s) => !have.has(s))
  console.log(missing.join('\n'))
  console.error(`\n共 ${missing.length} 题待制作（已完成 ${have.size} 题）`)
  process.exit(0)
}

const slug = positionals[0]
if (!slug) fail('缺少 <slug>。用法见 --help')
if (!SLUG_RE.test(slug)) fail(`slug "${slug}" 不符合 NNN-kebab-slug 格式`)
if (!existsSync(join(PROBLEMS, `${slug}.md`))) fail(`docs/problems/${slug}.md 不存在`)
if (!ARCHETYPES.includes(values.archetype)) fail(`--archetype 必须是 ${ARCHETYPES.join(' | ')} 之一`)

const out = join(DEMOS, slug, 'index.html')
if (existsSync(out) && !values.force) {
  fail(`${rel(out)} 已存在，拒绝覆盖。确认要覆盖请加 --force。`)
}

const archJs = join(TPL, 'arch', `${values.archetype}.js`)
if (!existsSync(archJs)) fail(`模板缺失：${rel(archJs)}`)

for (const f of ['shell.html', 'tokens.css', 'kernel.js']) {
  if (!existsSync(join(TPL, f))) fail(`模板缺失：${rel(join(TPL, f))}`)
}

const title = values.title ?? titleOf(slug)
/* archetype 的补充样式是可选的 */
const archCssPath = join(TPL, 'arch', `${values.archetype}.css`)
const archCss = existsSync(archCssPath) ? readFileSync(archCssPath, 'utf8') : ''

const html = lf(
  readFileSync(join(TPL, 'shell.html'), 'utf8')
    .replace('/*__TOKENS__*/', lf(readFileSync(join(TPL, 'tokens.css'), 'utf8')).trimEnd())
    .replace('/*__ARCH_CSS__*/', lf(archCss).trimEnd())
    .replace('/*__ARCH__*/', lf(readFileSync(archJs, 'utf8')).trimEnd())
    .replace('/*__KERNEL__*/', lf(readFileSync(join(TPL, 'kernel.js'), 'utf8')).trimEnd())
    .replaceAll('{{SLUG}}', slug)
    .replaceAll('{{TITLE}}', esc(title))
)

const leftover = html.match(/\{\{[A-Z_]+\}\}|\/\*__[A-Z_]+__\*\//g)
if (leftover) fail(`模板占位符未被替换：${[...new Set(leftover)].join(', ')}`)

if (values['dry-run']) {
  console.log(`[dry-run] 将创建 ${rel(out)}（${Buffer.byteLength(html)} 字节，archetype=${values.archetype}，标题「${title}」）`)
  process.exit(0)
}

if (values.force && existsSync(out)) console.warn(`⚠ 覆盖 ${rel(out)}`)
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, html, 'utf8')
console.log(`✓ ${rel(out)}（archetype=${values.archetype}）`)
console.log(`  下一步：编辑该文件里的 buildSteps() / paint()，改成 ${slug} 自己的算法。`)

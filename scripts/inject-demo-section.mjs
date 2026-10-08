#!/usr/bin/env node
/**
 * inject-demo-section.mjs —— 把「## 图解演示」小节幂等地写进题解 md
 *
 *   node scripts/inject-demo-section.mjs <slug> [<slug>…]   只处理指定题目
 *   node scripts/inject-demo-section.mjs --all              所有「已有 demo」的题目
 *   node scripts/inject-demo-section.mjs --all --remove     对称回滚
 *   [--dry-run] [--force]
 *
 * 插入位置固定在 `## 复杂度分析` 之前：演示是对刚展示那段 Python 的直接演绎，
 * 紧邻收益最大。该锚点在 100 篇题解里各恰好出现一次，位置唯一确定。
 *
 * 幂等：已存在整行 `## 图解演示` 就跳过，重复执行不产生二次 diff。
 * 默认只处理已存在 docs/public/demos/<slug>/index.html 的题目，
 * 从根上杜绝 md 里出现指向 404 的组件标签。
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DEMOS = join(ROOT, 'docs', 'public', 'demos')
const PROBLEMS = join(ROOT, 'docs', 'problems')

const HEADING = '## 图解演示'
const ANCHOR = '## 复杂度分析'

const rel = (p) => relative(ROOT, p).split('\\').join('/')
const attrEsc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function titleOf(slug) {
  const md = readFileSync(join(PROBLEMS, `${slug}.md`), 'utf8')
  const m = md.match(/^title:\s*["']?(.+?)["']?\s*$/m)
  return m ? m[1] : slug
}

function demoSlugs() {
  if (!existsSync(DEMOS)) return []
  return readdirSync(DEMOS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(DEMOS, d.name, 'index.html')))
    .map((d) => d.name)
    .sort()
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    all: { type: 'boolean', default: false },
    remove: { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false }
  }
})

if (values.help) {
  console.log(`用法：node scripts/inject-demo-section.mjs <slug> [<slug>…] [--remove] [--dry-run] [--force]
      node scripts/inject-demo-section.mjs --all [--remove] [--dry-run]

  --all      处理所有已具备 demo 的题目（不是所有 100 题）
  --remove   删掉 ## 图解演示 小节（对称回滚）
  --force    即使 demo 还不存在也注入
  --dry-run  只打印将改哪些文件，不写盘`)
  process.exit(0)
}

const slugs = values.all ? demoSlugs() : positionals
if (!slugs.length) {
  console.error(values.all ? '✗ 还没有任何 demo，先用 scripts/create-demo.mjs 生成' : '✗ 缺少 <slug>。用法见 --help')
  process.exit(1)
}

let changed = 0
let skipped = 0
let failed = 0

for (const slug of slugs) {
  const file = join(PROBLEMS, `${slug}.md`)
  if (!existsSync(file)) { console.error(`✗ ${slug}：docs/problems/${slug}.md 不存在`); failed++; continue }

  const hasDemo = existsSync(join(DEMOS, slug, 'index.html'))
  if (!values.force && !values.remove && !hasDemo) {
    console.error(`- ${slug}：demo 不存在，跳过（加 --force 可强行注入）`)
    skipped++
    continue
  }

  const raw = readFileSync(file, 'utf8')
  const eol = raw.includes('\r\n') ? '\r\n' : '\n'   // 保留原文件行尾
  const lines = raw.split(/\r?\n/)
  const h = lines.findIndex((l) => l.trim() === HEADING)

  if (values.remove) {
    if (h < 0) { console.log(`- ${slug}：无 ${HEADING}，跳过`); skipped++; continue }
    const a = lines.findIndex((l, i) => i > h && l.trim() === ANCHOR)
    if (a < 0) { console.error(`✗ ${slug}：找不到 ${ANCHOR}，无法安全删除`); failed++; continue }
    lines.splice(h, a - h)
  } else {
    if (h >= 0) { console.log(`- ${slug}：已存在 ${HEADING}，跳过`); skipped++; continue }
    const a = lines.findIndex((l) => l.trim() === ANCHOR)
    if (a < 0) { console.error(`✗ ${slug}：找不到锚点 ${ANCHOR}`); failed++; continue }
    lines.splice(a, 0,
      HEADING,
      '',
      `<ProblemDemo slug="${slug}" title="${attrEsc(titleOf(slug))}" />`,
      ''
    )
  }

  if (values['dry-run']) {
    console.log(`[dry-run] ${values.remove ? '将删除' : '将注入'} ${rel(file)}`)
  } else {
    writeFileSync(file, lines.join(eol), 'utf8')
    console.log(`✓ ${rel(file)}${values.remove ? '（已移除）' : ''}`)
  }
  changed++
}

console.log(`\n${values['dry-run'] ? '[dry-run] ' : ''}改动 ${changed} 个，跳过 ${skipped} 个，失败 ${failed} 个`)
process.exit(failed ? 1 : 0)

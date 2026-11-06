/**
 * Regenerate the two-example walkthroughs. The original six hand-built SVG
 * demos have no scenario entry, so this command never writes to their paths.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDemo, template } from './render-demo.mjs'
import early from './walkthroughs/early.mjs'
import middle from './walkthroughs/middle.mjs'
import late from './walkthroughs/late.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const problems = join(root, 'docs/problems')
const demos = join(root, 'docs/public/demos')
const slugs = readdirSync(problems).filter(name => /^\d+-.*\.md$/.test(name)).map(name => name.slice(0, -3))
const check = process.argv.includes('--check')

function validate(slug, examples) {
  const assert = (ok) => { if (!ok) throw new Error(slug + ' 的用例或状态行格式有误') }
  const hasText = value => typeof value === 'string' && value.trim() !== ''
  assert(Array.isArray(examples) && examples.length === 2)
  assert(examples[0].name !== examples[1].name)
  for (const { name, input, result, steps, heights, tree } of examples) {
    assert(hasText(name) && hasText(input) && hasText(result))
    if (heights) assert(heights.length && heights.every(value => Number.isFinite(value) && value >= 0))
    if (tree) {
      let slots = 1
      for (const value of tree) {
        assert(slots > 0 && (value === null || Number.isFinite(value)))
        slots += value === null ? -1 : 1
      }
      assert(tree[0] !== null)
    }
    assert(Array.isArray(steps) && steps.length >= 2)
    for (const [caption, rows] of steps) {
      assert(hasText(caption) && rows && typeof rows === 'object' && !Array.isArray(rows) && Object.keys(rows).length)
      for (const [label, values] of Object.entries(rows)) {
        assert(hasText(label) && Array.isArray(values))
        assert(values.every(value => typeof value === 'string' || Number.isFinite(value)))
      }
    }
  }
}

const pending = new Map()
for (const group of [early, middle, late]) {
  for (const [id, examples] of Object.entries(group)) {
    const slug = slugs.find(name => Number(name.split('-')[0]) === Number(id))
    if (!slug || pending.has(slug)) throw new Error('题号缺失或重复：' + id)
    validate(slug, examples)
    const md = readFileSync(join(problems, slug + '.md'), 'utf8')
    const title = md.match(/^title:\s*"(.+)"\s*$/m)[1]
    // Escape '<' even inside JSON strings so user-visible text cannot close the inline script.
    const data = JSON.stringify(examples).replace(/</g, '\\u003c')
    let js = template('walkthrough.js').replace('/*__SCENARIOS__*/', () => data)
    if (examples.every(example => Array.isArray(example.tree))) js += '\n' + template('tree-structure.js')
    if (examples.every(example => Array.isArray(example.heights))) js += '\n' + template('height-profile.js')
    pending.set(slug, renderDemo({ slug, title, js, css: template('walkthrough.css'), stage: template('walkthrough.html') }))
  }
}

let changed = 0
for (const [slug, html] of pending) {
  const path = join(demos, slug, 'index.html')
  if (existsSync(path) && readFileSync(path, 'utf8').replace(/\r\n/g, '\n') === html) continue
  if (check) throw new Error(slug + ' 的演示需要运行 npm run demo:generate 重新生成')
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, html)
  changed++
}
console.log('已核对 ' + pending.size + ' 道题的演示，更新 ' + changed + ' 个文件')

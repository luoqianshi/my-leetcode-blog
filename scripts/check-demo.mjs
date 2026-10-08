#!/usr/bin/env node
/**
 * check-demo.mjs —— 在 Node 里用 DOM 桩验证一个生成好的图解演示
 *
 *   node scripts/check-demo.mjs docs/public/demos/001-two-sum/index.html [期望步数]
 *   node scripts/check-demo.mjs --all
 *
 * 覆盖四类回归，全部不需要浏览器：
 *   1. 脚本能跑完（语法错误 / 未定义引用 / paint 崩溃都会在这里炸出来）
 *   2. 每一步的快照互不共享容器引用（🔴 最高频的「每步都显示最终态」bug）
 *   3. paint() 对每一步都不抛异常
 *   4. KERNEL 的键盘单步 / 重置真的推进了状态
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DEMOS = join(ROOT, 'docs', 'public', 'demos')

let bad = 0
const fail = (m) => { console.error(`  ✗ ${m}`); bad++ }
const ok = (m) => console.log(`  ✓ ${m}`)

/* ---------- 最小 DOM 桩 ---------- */

function makeStub() {
  const listeners = {}
  const byId = new Map()

  /* 假定时器队列：setTimeout 不自动触发，由测试显式 flush，
     这样自动播放的推进可以被确定性地断言。 */
  let timers = []
  let timerSeq = 0
  const fakeSetTimeout = (fn, ms) => { const id = ++timerSeq; timers.push({ id, fn, ms }); return id }
  const fakeClearTimeout = (id) => { timers = timers.filter((t) => t.id !== id) }
  /** 触发最早挂起的那个定时器；返回是否真的触发了 */
  const flushTimer = () => {
    if (!timers.length) return false
    const t = timers.shift()
    t.fn()
    return true
  }

  function makeEl(tag) {
    const el = {
      tagName: (tag || 'div').toUpperCase(),
      style: new Proxy({}, { set: (t, k, v) => { t[k] = v; return true }, get: (t, k) => (k === 'setProperty' ? (p, v) => { t[p] = v } : t[k]) }),
      attrs: {},
      childNodes: [],
      _text: '',
      disabled: false,
      value: '',
      max: '0',
      classList: {
        _s: new Set(),
        add(...c) { c.forEach((x) => this._s.add(x)) },
        remove(...c) { c.forEach((x) => this._s.delete(x)) },
        toggle(c, f) { if (f === undefined) f = !this._s.has(c); f ? this._s.add(c) : this._s.delete(c); return f },
        contains(c) { return this._s.has(c) }
      },
      setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'class') this.className = String(v) },
      getAttribute(k) { return this.attrs[k] },
      appendChild(c) { this.childNodes.push(c); c.parentNode = this; return c },
      remove() { if (this.parentNode) { const i = this.parentNode.childNodes.indexOf(this); if (i >= 0) this.parentNode.childNodes.splice(i, 1) } },
      addEventListener(t, fn) { (this._ev ||= {})[t] = fn },
      dispatch(t, ev) { if (this._ev && this._ev[t]) this._ev[t](ev) },
      getBoundingClientRect() { return { height: 400, width: 600, top: 0, left: 0 } },
      querySelector() { return null }
    }
    Object.defineProperty(el, 'textContent', { get() { return this._text }, set(v) { this._text = String(v) } })
    return el
  }

  const documentElement = makeEl('html')
  const body = makeEl('body')

  const document = {
    documentElement,
    body,
    fonts: { ready: Promise.resolve() },
    getElementById(id) { if (!byId.has(id)) byId.set(id, makeEl('div')); return byId.get(id) },
    createElementNS(ns, tag) { return makeEl(tag) },
    createElement(tag) { return makeEl(tag) },
    querySelector() { return null },
    addEventListener(t, fn) { (listeners[t] ||= []).push(fn) },
    dispatch(t, ev) { (listeners[t] || []).forEach((fn) => fn(ev)) }
  }

  /* file:// 下 Chrome 会对 localStorage 抛 SecurityError —— 刻意复现，
     这样主题引导的降级分支每次都被走到。 */
  const window = {
    document,
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    addEventListener(t, fn) { (listeners[t] ||= []).push(fn) },
    dispatch(t, ev) { (listeners[t] || []).forEach((fn) => fn(ev)) },
    requestAnimationFrame: (fn) => { fn(); return 1 },
    cancelAnimationFrame() {},
    ResizeObserver: class { observe() {} disconnect() {} },
    URL,
    getComputedStyle: () => ({ getPropertyValue: () => '' })
  }
  window.window = window
  window.parent = window   // 模拟独立打开：post() 会直接 return

  return {
    sandbox: {
      window, document, console, Math, Object, Number, String, Array, JSON, Set, Map, Boolean, Error, Promise, URL,
      requestAnimationFrame: window.requestAnimationFrame,
      cancelAnimationFrame: window.cancelAnimationFrame,
      setTimeout: fakeSetTimeout,
      clearTimeout: fakeClearTimeout,
      ResizeObserver: window.ResizeObserver,
      matchMedia: window.matchMedia,
      get localStorage() { throw new Error('SecurityError: file:// 下不可用') },
      navigator: { userAgent: 'node' }
    },
    document, window, listeners, makeEl, flushTimer,
    pendingTimers: () => timers.length
  }
}

/* ---------- 从产物 HTML 抽出内联脚本 ---------- */

function extractScripts(html) {
  return [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
}

function checkOne(file, expected) {
  console.log(`\n=== ${file.replace(/\\/g, '/').split('/').slice(-3).join('/')} ===`)
  const before = bad
  const html = readFileSync(file, 'utf8')
  const scripts = extractScripts(html)
  if (scripts.length < 2) { fail(`只找到 ${scripts.length} 个内联 <script>，期望至少 2 个（主题引导 + 主脚本）`); return }

  /* 零外部依赖是硬约束：出现 src= 就意味着不再是单文件 */
  if (/<script[^>]+\bsrc=/.test(html)) fail('存在外部 <script src>，违反零依赖约束')
  if (/type="module"/.test(html.replace(/\/\*[\s\S]*?\*\//g, ''))) fail('存在 type="module"，file:// 下会被 CORS 拦死')

  const stub = makeStub()
  const sandbox = stub.sandbox
  vm.createContext(sandbox)

  /* 主题引导脚本：localStorage 抛异常时必须降级而不是整体崩掉 */
  try {
    vm.runInContext(scripts[0], sandbox, { filename: 'bootstrap' })
    ok('主题引导脚本在 localStorage 不可用时未抛异常')
  } catch (e) {
    fail(`主题引导脚本抛异常：${e.message}`)
    return
  }

  /* 主脚本：把 steps / paint 暴露出来供断言。
     它是包在 IIFE 里的，所以导出语句必须插在收尾的 `})();` 之前才在作用域内。 */
  let steps, paint
  try {
    const main = scripts[1]
    const CLOSE = '})();'
    const at = main.lastIndexOf(CLOSE)
    if (at < 0) { fail('主脚本不是预期的 IIFE 结构，无法插桩'); return }
    const instrumented = main.slice(0, at) + ';globalThis.__out = { steps: steps, paint: paint };\n' + main.slice(at)
    vm.runInContext(instrumented, sandbox, { filename: 'main' })
    steps = sandbox.__out.steps
    paint = sandbox.__out.paint
    ok('主脚本执行完毕，控件与消息监听已挂载')
  } catch (e) {
    fail(`主脚本抛异常：${e.message}\n      ${e.stack.split('\n')[1] || ''}`)
    return
  }

  /* ---- 1. 步数与旁白 ---- */
  if (!Array.isArray(steps) || !steps.length) { fail('steps 为空'); return }
  if (expected && steps.length !== Number(expected)) fail(`步数 ${steps.length}，期望 ${expected}`)
  else ok(`步数 = ${steps.length}`)

  steps.forEach((s, i) => {
    if (!s.caption || !String(s.caption).trim()) fail(`第 ${i + 1} 步旁白为空`)
    if (!s.phase) fail(`第 ${i + 1} 步缺 phase 字段`)
  })
  ok('每步都有 phase 与非空 caption')

  /* ---- 2. 🔴 快照别名检查 ---- */
  const CONTAINERS = ['seen', 'path', 'used', 'grid', 'nodes', 'alive', 'results', 'stack', 'dp', 'depth', 'map']
  let aliasChecked = 0
  for (const key of CONTAINERS) {
    const present = steps.filter((s) => s[key] != null)
    if (present.length < 2) continue
    aliasChecked++
    for (let a = 0; a < present.length; a++) {
      for (let b = a + 1; b < present.length; b++) {
        if (present[a][key] === present[b][key]) {
          fail(`容器 "${key}" 在第 ${steps.indexOf(present[a]) + 1} 步与第 ${steps.indexOf(present[b]) + 1} 步共享同一引用（未深拷贝）`)
        }
        const A = present[a][key], B = present[b][key]
        if (Array.isArray(A) && Array.isArray(B)) {
          for (let r = 0; r < Math.min(A.length, B.length); r++) {
            /* 只比较对象的引用同一性。基本类型（数字/字符串/布尔）按值相等，
               两步都存着数字 1 并不是别名 bug，否则 path:[1,2] 这类会误报。 */
            if (A[r] && typeof A[r] === 'object' && A[r] === B[r]) {
              fail(`容器 "${key}[${r}]" 在第 ${steps.indexOf(present[a]) + 1} 步与第 ${steps.indexOf(present[b]) + 1} 步共享引用`)
            }
          }
        }
      }
    }
    /* 内容完全不变 = 录制没在推进 */
    if (new Set(present.map((s) => JSON.stringify(s[key]))).size === 1) {
      fail(`容器 "${key}" 在 ${present.length} 步里内容完全一致，录制可能没有推进`)
    }
  }
  if (aliasChecked) ok(`${aliasChecked} 个容器快照引用互不相同且内容在推进`)

  /* ---- 3. paint() 逐步不抛 ---- */
  try {
    steps.forEach((s, i) => paint(s))
    ok(`paint() 对全部 ${steps.length} 步均未抛异常`)
  } catch (e) {
    fail(`paint() 抛异常：${e.message}\n      ${e.stack.split('\n')[1] || ''}`)
  }

  /* ---- 4. KERNEL 键盘单步 / 重置 ---- */
  const captionEl = stub.sandbox.document.getElementById('caption')
  const countEl = stub.sandbox.document.getElementById('count')
  const key = (k) => stub.sandbox.document.dispatch('keydown', { key: k, preventDefault() {}, target: { tagName: 'BODY' } })

  const c0 = captionEl.textContent
  key('ArrowRight'); const c1 = captionEl.textContent
  key('ArrowRight'); const c2 = captionEl.textContent
  if (steps.length > 2) {
    if (c0 === c1 || c1 === c2) fail('连按 → 旁白没有变化，单步未生效')
    else ok('→ 单步推进正常（旁白逐步变化）')
  }
  key('End')
  if (steps.length > 1 && countEl.textContent !== `第 ${steps.length} / ${steps.length} 步`) {
    fail(`End 后计数为「${countEl.textContent}」，期望「第 ${steps.length} / ${steps.length} 步」`)
  } else ok(`End 跳到末步（${countEl.textContent}）`)

  key('r')
  if (countEl.textContent !== `第 1 / ${steps.length} 步`) fail(`R 重置后计数为「${countEl.textContent}」`)
  else ok('R 重置回到第 1 步')

  key('ArrowLeft')
  if (countEl.textContent !== `第 1 / ${steps.length} 步`) fail('第 1 步再按 ← 越界了')
  else ok('边界钳制正常（首步按 ← 不越界）')

  /* 空格播放：文案切「暂停」，且定时器推进真的换步 */
  const playEl = stub.sandbox.document.getElementById('btn-play')
  key(' ')
  if (playEl.textContent !== '暂停') fail(`空格后播放按钮文案为「${playEl.textContent}」，期望「暂停」`)
  else ok('空格切换为播放中（按钮文案「暂停」）')

  const beforeCount = countEl.textContent
  if (!stub.flushTimer()) fail('播放中没有挂起任何定时器，自动播放不会推进')
  else if (countEl.textContent === beforeCount) fail('定时器触发后步数没有推进')
  else ok(`自动播放推进：${beforeCount} → ${countEl.textContent}`)

  key(' ')
  if (playEl.textContent === '暂停') fail('再按空格没有暂停')
  else ok(`再按空格暂停（按钮文案「${playEl.textContent}」）`)
  const pausedCount = countEl.textContent
  stub.flushTimer()
  if (countEl.textContent !== pausedCount) fail('暂停后仍有定时器在推进')
  else ok('暂停后不再推进')

  /* 一路播到末步：应自动停住并把文案切成「重播」 */
  key(' ')
  let guard = steps.length + 5
  while (guard-- > 0 && stub.flushTimer()) { /* 逐个触发挂起的定时器 */ }
  if (countEl.textContent !== `第 ${steps.length} / ${steps.length} 步`) {
    fail(`播到底后停在「${countEl.textContent}」，期望末步`)
  } else if (playEl.textContent !== '重播') {
    fail(`末步时播放按钮文案为「${playEl.textContent}」，期望「重播」`)
  } else ok('自动播放到末步后停止，按钮文案变「重播」')
  if (stub.pendingTimers()) fail('末步后仍挂着定时器，会一直空转')
  key('r')

  /* ---- 5. 主题消息 ---- */
  const msgHandler = (stub.listeners['message'] || [])[0]
  if (!msgHandler) fail('没有注册 message 监听器，父页无法同步主题')
  else {
    msgHandler({ source: sandbox.window.parent, data: { type: 'lc-demo:theme', theme: 'dark' } })
    if (!sandbox.document.documentElement.classList.contains('dark')) fail('收到 theme:dark 后 html 上没有 dark class')
    else ok('postMessage 主题同步生效（html.dark 已加上）')
    msgHandler({ source: sandbox.window.parent, data: { type: 'lc-demo:theme', theme: 'light' } })
    if (sandbox.document.documentElement.classList.contains('dark')) fail('收到 theme:light 后 dark class 未移除')
    else ok('切回浅色正常')
    /* 非父窗口来源必须被忽略 */
    msgHandler({ source: {}, data: { type: 'lc-demo:theme', theme: 'dark' } })
    if (sandbox.document.documentElement.classList.contains('dark')) fail('来源校验失效：非父窗口的消息也被采纳了')
    else ok('来源校验生效（非父窗口消息被忽略）')
  }

  if (bad === before) console.log('  —— 全部通过')
}

/* ---------- 入口 ---------- */

const args = process.argv.slice(2)
if (args[0] === '--all') {
  const slugs = existsSync(DEMOS)
    ? readdirSync(DEMOS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : []
  if (!slugs.length) { console.error('✗ docs/public/demos 下没有任何演示'); process.exit(1) }
  slugs.forEach((s) => checkOne(join(DEMOS, s, 'index.html')))
} else if (args[0]) {
  checkOne(args[0], args[1])
} else {
  console.error('用法：node scripts/check-demo.mjs <demo.html> [期望步数]\n      node scripts/check-demo.mjs --all')
  process.exit(1)
}

console.log(bad ? `\n✗ 共 ${bad} 项失败` : '\n✓ 全部检查通过')
process.exit(bad ? 1 : 0)

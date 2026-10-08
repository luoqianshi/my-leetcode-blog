/* ============================================================
   KERNEL —— 主题通信 + 播放控制 + 高度上报（全部 archetype 共用）

   契约：ARCH 段必须提供
     var steps            快照数组，每项含 phase / caption 及 archetype 专属字段
     function paint(s)    渲染一帧快照
   可选提供
     var STAGE = { w, h, minW }   viewBox 尺寸；minW 为窄屏横向滚动触发宽度
   ============================================================ */

var CFG = (typeof STAGE !== 'undefined' && STAGE) ? STAGE : { w: 660, h: 300, minW: 0 };

var app = document.getElementById('app');
var svg = document.getElementById('svg');
svg.setAttribute('viewBox', '0 0 ' + CFG.w + ' ' + CFG.h);
if (CFG.minW) document.documentElement.style.setProperty('--dm-stage-minw', CFG.minW + 'px');

var el = {
  prev: document.getElementById('btn-prev'),
  play: document.getElementById('btn-play'),
  next: document.getElementById('btn-next'),
  reset: document.getElementById('btn-reset'),
  speed: document.getElementById('btn-speed'),
  scrub: document.getElementById('scrub'),
  count: document.getElementById('count'),
  caption: document.getElementById('caption')
};

/* ---------- 与父页通信 ---------- */

var MSG = 'lc-demo';

/* 目标 origin：嵌入时从 referrer 取（精确投递）；file:// 下取不到就退回 '*'。
   载荷只有主题名和像素高度，不含敏感信息。 */
var PARENT_ORIGIN = (function () {
  try { return new URL(document.referrer).origin || '*'; } catch (_) { return '*'; }
})();

function post(type, payload) {
  if (window.parent === window) return;   // 双击离线打开时没有父窗口
  var msg = { type: MSG + ':' + type };
  for (var k in (payload || {})) msg[k] = payload[k];
  try { window.parent.postMessage(msg, PARENT_ORIGIN); } catch (_) {}
}

/* ---------- 高度上报 ---------- */

var lastH = 0;
var rafId = 0;

function reportHeight() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(function () {
    rafId = 0;
    var h = Math.ceil(app.getBoundingClientRect().height);
    if (h > 0 && Math.abs(h - lastH) >= 1) {
      lastH = h;
      post('height', { height: h });
    }
  });
}

/* 🔴 只 observe #app。observe documentElement 或 body 会与父页设定的 iframe
      高度互相触发，形成 ResizeObserver 死循环（页面卡顿 + 高度来回抖）。 */
if ('ResizeObserver' in window) new ResizeObserver(reportHeight).observe(app);
window.addEventListener('resize', reportHeight);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(reportHeight);

/* ---------- 播放控制 ---------- */

var BASE_MS = 900;
var SPEEDS = [0.5, 1, 1.5, 2];
var idx = 0;
var playing = false;
var speedIdx = 1;
var timer = null;

function lastIdx() { return steps.length - 1; }

function go(n) {
  idx = Math.max(0, Math.min(lastIdx(), n));
  var s = steps[idx];
  paint(s);
  el.caption.textContent = s.caption;
  el.caption.setAttribute('data-phase', s.phase);
  el.scrub.value = String(idx);
  el.count.textContent = '第 ' + (idx + 1) + ' / ' + steps.length + ' 步';
  el.prev.disabled = idx === 0;
  el.next.disabled = idx === lastIdx();
  var label = playing ? '暂停' : (idx === lastIdx() ? '重播' : '播放');
  el.play.textContent = label;
  el.play.setAttribute('aria-label', label);
  reportHeight();   // 旁白换行会改变高度
}

/* 用 setTimeout 递归而非 setInterval：变速能立刻生效，末尾自动停也精确。 */
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(tick, BASE_MS / SPEEDS[speedIdx]);
}

function tick() {
  if (idx >= lastIdx()) { pause(); return; }
  go(idx + 1);
  if (!playing) return;
  if (idx >= lastIdx()) pause();   // 到末步立即停，按钮马上变「重播」
  else schedule();
}

function play() {
  if (idx >= lastIdx()) go(0);   // 末步点播放 = 重播
  playing = true;
  go(idx);
  schedule();
}

function pause() {
  playing = false;
  clearTimeout(timer);
  go(idx);
}

function toggle() { if (playing) pause(); else play(); }

function reset() { pause(); go(0); }

function stepBy(d) {
  if (playing) pause();
  go(idx + d);
}

el.prev.addEventListener('click', function () { stepBy(-1); });
el.next.addEventListener('click', function () { stepBy(1); });
el.play.addEventListener('click', toggle);
el.reset.addEventListener('click', reset);
el.speed.addEventListener('click', function () {
  speedIdx = (speedIdx + 1) % SPEEDS.length;
  el.speed.textContent = SPEEDS[speedIdx] + '×';
  if (playing) schedule();
});
el.scrub.addEventListener('input', function () {
  if (playing) pause();
  go(Number(el.scrub.value));
});

document.addEventListener('keydown', function (e) {
  var t = e.target;
  /* range 上的方向键要留给原生行为，否则进度条拖不动 */
  if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  switch (e.key) {
    case 'ArrowRight': e.preventDefault(); stepBy(1); break;
    case 'ArrowLeft': e.preventDefault(); stepBy(-1); break;
    case ' ': e.preventDefault(); toggle(); break;
    case 'Home': e.preventDefault(); if (playing) pause(); go(0); break;
    case 'End': e.preventDefault(); if (playing) pause(); go(lastIdx()); break;
    case 'r': case 'R': e.preventDefault(); reset(); break;
  }
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('no-motion');
}

/* ---------- 主题同步 ---------- */

window.addEventListener('message', function (e) {
  /* 与 origin 无关的强校验：来源窗口必须是自己的父窗口，且消息形状必须匹配 */
  if (e.source !== window.parent) return;
  var d = e.data;
  if (!d || d.type !== MSG + ':theme') return;
  document.documentElement.classList.toggle('dark', d.theme === 'dark');
  reportHeight();
});

/* ---------- 启动 ---------- */

/* 空步骤是 archetype 编写期的真实失误，直接崩会白屏且难定位，所以给一条明确提示。 */
if (!steps.length) {
  el.caption.textContent = '该演示尚未生成任何步骤，请检查 buildSteps()。';
  el.count.textContent = '第 0 / 0 步';
  el.prev.disabled = el.next.disabled = true;
} else {
  el.scrub.max = String(lastIdx());
  /* 由 iframe 主动喊 ready，父页收到后才回发主题 —— 解决父页抢先 post 被丢掉的竞态。
     必须放在 message 监听器挂好之后。 */
  post('ready', { slug: SLUG, steps: steps.length });
  go(0);
  reportHeight();
}

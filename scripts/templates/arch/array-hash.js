/* ============================================================
   archetype: array-hash
   参考实现 = 001. 两数之和（LeetCode 示例 2：nums=[3,2,4], target=6 → [1,2]）

   这是「数组条 + 滑动指针 + 侧栏面板」家族的样板；双指针 / 滑动窗口 /
   二分 / 栈 / 哈希 等约 39 题都从它改起。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 NUMS / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

var NUMS = [3, 2, 4];
var TARGET = 6;
var STAGE = { w: 620, h: 292, minW: 460 };

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

function cloneSeen(o) {
  var r = {};
  for (var k in o) r[k] = o[k];
  return r;
}

/* ---------- 录制：真跑一遍算法，每步存一份纯数据快照 ----------
   🔴 seen 必须每次拷贝。直接存引用的话所有步骤会指向同一个不断变化的对象，
      动画就变成「每一步都显示最终态」。path / grid / nodes[].next 同理。 */
function buildSteps() {
  var seen = Object.create(null);   // 值 -> 下标

  record({ phase: 'init', i: -1, need: null, seen: {}, hit: null },
    '初始化：nums = [' + NUMS.join(', ') + ']，target = ' + TARGET + '，哈希表 seen 为空。');

  for (var i = 0; i < NUMS.length; i++) {
    var need = TARGET - NUMS[i];

    record({ phase: 'lookup', i: i, need: need, seen: cloneSeen(seen), hit: null },
      'i = ' + i + '，nums[' + i + '] = ' + NUMS[i] + '，去哈希表里找 complement = ' +
      TARGET + ' − ' + NUMS[i] + ' = ' + need + '。');

    if (need in seen) {
      record({ phase: 'hit', i: i, need: need, seen: cloneSeen(seen), hit: [seen[need], i] },
        '命中！' + need + ' 已经在表里（下标 ' + seen[need] + '），直接返回 [' +
        seen[need] + ', ' + i + ']，无需继续遍历。');
      return;
    }

    seen[NUMS[i]] = i;
    record({ phase: 'store', i: i, need: need, seen: cloneSeen(seen), hit: null },
      '表里没有 ' + need + '，把 { ' + NUMS[i] + ' → ' + i + ' } 存进去，指针右移。');
  }

  record({ phase: 'none', i: NUMS.length, need: null, seen: cloneSeen(seen), hit: null },
    '遍历结束仍未找到配对，返回空数组。');
}

buildSteps();

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / transform / textContent。
      位移一律走 style.transform 而非重设 x 属性，transition 才会滑动。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);
var ptrLabel = null;

var CELL = 62, GAP = 16, Y0 = 50;
var X0 = (STAGE.w - (NUMS.length * CELL + (NUMS.length - 1) * GAP)) / 2;
var PTR_Y = Y0 + CELL + 24;
var NEED_Y = 186;
var SEEN_LBL_Y = 240;
var CHIP_Y = 250, CHIP_W = 92, CHIP_H = 28, CHIP_GAP = 10;

function cx(k) { return X0 + k * (CELL + GAP) + CELL / 2; }

function ensure(key, tag) {
  var e = cache[key];
  if (!e) {
    e = document.createElementNS(NS, tag);
    e.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
      ' opacity var(--dm-dur) var(--lc-ease),' +
      ' fill var(--dm-dur) var(--lc-ease),' +
      ' stroke var(--dm-dur) var(--lc-ease)';
    cache[key] = e;
    svg.appendChild(e);
  }
  return e;
}

function attr(e, o) { for (var k in o) e.setAttribute(k, o[k]); }
function txt(e, s) { if (e.textContent !== s) e.textContent = s; }

/* 清掉上一步残留的动态元素（本题只有哈希 chip 会增删） */
function reconcile(used) {
  for (var k in cache) {
    if (!used[k]) { cache[k].remove(); delete cache[k]; }
  }
}

function paint(s) {
  var used = Object.create(null);
  var i, k, e;

  /* target 药丸（右上角，静态） */
  e = ensure('tgt-bg', 'rect'); used['tgt-bg'] = 1;
  attr(e, { x: STAGE.w - 108, y: 12, width: 96, height: 24, rx: 12, class: 'chip-bg' });
  e = ensure('tgt-tx', 'text'); used['tgt-tx'] = 1;
  attr(e, { x: STAGE.w - 60, y: 28, class: 'chip-tx' });
  txt(e, 'target = ' + TARGET);

  /* 命中弧线（画在格子上方，与下方的指针分开，互不遮挡） */
  e = ensure('arc', 'path'); used['arc'] = 1;
  attr(e, { class: 'edge edge-done', 'stroke-dasharray': '4 3', fill: 'none' });
  if (s.hit) {
    var a = cx(s.hit[0]), b = cx(s.hit[1]), mid = (a + b) / 2;
    attr(e, { d: 'M' + a + ' ' + Y0 + ' Q' + mid + ' ' + (Y0 - 34) + ' ' + b + ' ' + Y0 });
    e.style.opacity = '1';
  } else {
    e.style.opacity = '0';
  }

  e = ensure('arc-tx', 'text'); used['arc-tx'] = 1;
  attr(e, { x: STAGE.w / 2, y: 26, class: 'badge-tx' });
  if (s.hit) { txt(e, '答案 [' + s.hit.join(', ') + ']'); e.style.opacity = '1'; }
  else { txt(e, ''); e.style.opacity = '0'; }

  /* 数组格子 */
  for (k = 0; k < NUMS.length; k++) {
    var x = X0 + k * (CELL + GAP);
    var cls = 'cell';
    if (s.hit && (s.hit[0] === k || s.hit[1] === k)) cls += ' cell-hit';
    else if (s.i === k) cls += ' cell-active';
    else if (k < s.i) cls += ' cell-done';

    e = ensure('c' + k, 'rect'); used['c' + k] = 1;
    attr(e, { x: x, y: Y0, width: CELL, height: CELL, rx: 10, class: cls });

    e = ensure('v' + k, 'text'); used['v' + k] = 1;
    attr(e, { x: x + CELL / 2, y: Y0 + CELL / 2 + 6, class: 'cell-val' });
    txt(e, String(NUMS[k]));

    e = ensure('d' + k, 'text'); used['d' + k] = 1;
    attr(e, { x: x + CELL / 2, y: Y0 + CELL + 16, class: 'cell-idx' });
    txt(e, String(k));
  }

  /* 指针 i */
  e = ensure('ptr', 'g'); used['ptr'] = 1;
  if (!ptrLabel) {
    var arrow = document.createElementNS(NS, 'path');
    attr(arrow, { d: 'M0 0 L-6 12 L6 12 Z', class: 'ptr-arrow' });
    ptrLabel = document.createElementNS(NS, 'text');
    attr(ptrLabel, { y: 28, class: 'ptr-label' });
    e.appendChild(arrow);
    e.appendChild(ptrLabel);
  }
  e.style.opacity = s.i < 0 ? '0' : '1';
  e.style.transform = 'translate(' + cx(Math.max(s.i, 0)) + 'px,' + PTR_Y + 'px)';
  txt(ptrLabel, 'i = ' + (s.i < 0 ? '—' : s.i));

  /* need 计算气泡 */
  var needLine;
  if (s.phase === 'init') needLine = '哈希表为空，从 i = 0 开始遍历';
  else if (s.need === null) needLine = '遍历结束，未找到配对';
  else needLine = 'need = target − nums[' + s.i + '] = ' + TARGET + ' − ' + NUMS[s.i] + ' = ' + s.need;

  e = ensure('need-bg', 'rect'); used['need-bg'] = 1;
  attr(e, {
    x: STAGE.w / 2 - 158, y: NEED_Y, width: 316, height: 26, rx: 13,
    class: s.phase === 'hit' ? 'badge-bg' : 'chip-bg'
  });
  e = ensure('need-tx', 'text'); used['need-tx'] = 1;
  attr(e, { x: STAGE.w / 2, y: NEED_Y + 17, class: s.phase === 'hit' ? 'badge-tx' : 'chip-tx' });
  txt(e, needLine);

  /* 哈希表面板 */
  e = ensure('seen-lbl', 'text'); used['seen-lbl'] = 1;
  attr(e, { x: X0, y: SEEN_LBL_Y, class: 'panel-title' });
  txt(e, '哈希表 SEEN（值 → 下标）');

  var keys = Object.keys(s.seen);
  if (!keys.length) {
    e = ensure('seen-empty', 'text'); used['seen-empty'] = 1;
    attr(e, { x: X0, y: CHIP_Y + 19, class: 'lbl-dim' });
    txt(e, '∅ 空');
  }
  for (var n = 0; n < keys.length; n++) {
    var key = keys[n];
    var ck = 'chip-' + key;
    var isNew = s.phase === 'store' && Number(s.seen[key]) === s.i;
    var isHitSrc = !!(s.hit && Number(s.seen[key]) === s.hit[0]);

    var g = cache[ck];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.style.transition = 'transform var(--dm-dur) var(--lc-ease), opacity var(--dm-dur) var(--lc-ease)';
      g.appendChild(document.createElementNS(NS, 'rect'));
      g.appendChild(document.createElementNS(NS, 'text'));
      cache[ck] = g;
      svg.appendChild(g);
    }
    used[ck] = 1;

    attr(g, {
      class: 'chip' + (isNew ? ' chip-new' : ''),
      transform: 'translate(' + (X0 + n * (CHIP_W + CHIP_GAP)) + ',' + CHIP_Y + ')'
    });
    attr(g.childNodes[0], {
      width: CHIP_W, height: CHIP_H, rx: 14,
      class: isHitSrc ? 'badge-bg' : 'chip-bg'
    });
    attr(g.childNodes[1], { x: CHIP_W / 2, y: 19, class: isHitSrc ? 'badge-tx' : 'chip-tx' });
    txt(g.childNodes[1], key + ' → ' + s.seen[key]);
  }

  reconcile(used);
}

/* ============================================================
   archetype: dp-table
   参考实现 = 070. 爬楼梯（n = 6 → 13），严格照题解页「## 代码实现」那段 Python：

     dp = {0:0}          # 🔴 dp[0] = 0，不是教科书里的 1
     dp[1] = 1
     dp[2] = 2
     for i in range(3, n+1):
         dp[i] = dp[i-1] + dp[i-2]
     return dp[n]

   这是「DP 表 + 柱状递推 + 依赖箭头」家族的样板；爬楼梯 / 使用最小花费爬楼梯 /
   打家劫舍 / 斐波那契数 / 第 N 个泰波那契数 等一维填表题都从它改起，
   二维填表题（不同路径 / 最小路径和）把一根柱子换成一行格子即可。

   🔴 忠实度优先：容器是字典就画字典，两个基础值都写死就从 i = 3 开始循环。
      读者刚看完上面那段代码，图画错了比不画更糟。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 N / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

var N = 6;                              // 题目输入：爬到第 6 阶
var STAGE = { w: 680, h: 350, minW: 560 };

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

function cloneDp(o) {
  var r = {};
  for (var k in o) r[k] = o[k];
  return r;
}

/* ---------- 录制：真跑一遍那段 Python，每步存一份纯数据快照 ----------
   🔴 dp 必须每次拷贝（cloneDp）。直接存引用的话所有步骤会指向同一个不断变化的
      字典，动画就变成「每一步都显示最终态」。src / grid / nodes 同理。
   🔴 这里刻意用「对象」而不是「数组」装 dp：一是 Python 原文就是 dict，
      二是 check-demo 的元素级引用探针假定容器里装的是行对象，扁平数字数组
      会被它当成「两步共享引用」误报。key = 下标，value = 方法数，
      「这个下标还没算」就表现为「没有这个 key」。 */
function buildSteps() {
  var dp = {};

  dp[0] = 0;
  record({ phase: 'init', i: 0, dp: cloneDp(dp), src: null },
    'dp = {0: 0} —— 这份实现把「0 阶台阶」记作 0 种走法（教科书常写 dp[0] = 1，' +
    '那是把「原地不动」也算一种）。循环从 i = 3 起、只读 dp[i-1] 和 dp[i-2]，' +
    '所以 n ≥ 1 时 dp[0] 根本读不到，填 0 还是 1 都不影响答案 —— 柱高也就是 0，第 0 根柱子是空的。');

  dp[1] = 1;
  record({ phase: 'init', i: 1, dp: cloneDp(dp), src: null },
    'dp[1] = 1 —— 只有「直接跨 1 阶」这一种走法。它是写死的基础值、不由递推得出，所以柱子换一种颜色。');

  dp[2] = 2;
  record({ phase: 'init', i: 2, dp: cloneDp(dp), src: null },
    'dp[2] = 2 —— 「1 + 1」和「一次跨 2 阶」两种走法。两个基础值都预先给好，' +
    '所以 for i in range(3, n+1) 是从 i = 3 才开始的（只给一个基础值的版本才从 i = 2 起）。');

  for (var i = 3; i <= N; i++) {
    var a = dp[i - 1], b = dp[i - 2];

    record({ phase: 'read', i: i, dp: cloneDp(dp), src: [i - 1, i - 2] },
      '要算 dp[' + i + ']，读 dp[' + (i - 1) + '] = ' + a + ' 和 dp[' + (i - 2) + '] = ' + b +
      ' —— 到第 ' + i + ' 阶要么从第 ' + (i - 1) + ' 阶跨 1 步，要么从第 ' + (i - 2) +
      ' 阶跨 2 步，两类走法互不重叠，所以相加。');

    dp[i] = a + b;
    record({ phase: 'write', i: i, dp: cloneDp(dp), src: [i - 1, i - 2] },
      'dp[' + i + '] = dp[' + (i - 1) + '] + dp[' + (i - 2) + '] = ' + a + ' + ' + b + ' = ' +
      dp[i] + '，写回字典，柱子长到 ' + dp[i] + '。每格只依赖左边两格，所以一趟从左到右就能填完，时间 O(n)。');
  }

  record({ phase: 'done', i: N, dp: cloneDp(dp), src: null },
    'i 走到 n = ' + N + ' 之后循环结束，return dp[' + N + '] = ' + dp[N] +
    '。（页面要点说的「空间优化为两个变量」指只滚动保留前两个值、把空间降到 O(1)；' +
    '这份代码实际用的是字典，动画照代码画。）');
}

buildSteps();

/* 🔴 柱高按「最终值」定标：buildSteps() 跑完拿 dp[N] = 13 当满刻度，
      而不是按当前最大值 —— 否则每写一格所有柱子都要重新缩放，整张图一起抖。 */
var MAXV = steps[steps.length - 1].dp[N];

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / transform / textContent。
      柱子生长走 scaleY，位移一律走 style.transform 而非重设 x/y 属性。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);
var picto = null;                 // 台阶示意的子元素只建一次

var BAR_W = 56, GAP = 24, BASE_Y = 290, MAX_H = 130;
var SLOTS = N + 1;                // dp[0..N] 共 7 根柱子
var X0 = (STAGE.w - (SLOTS * BAR_W + (SLOTS - 1) * GAP)) / 2;
var PICTO_Y = 34;                 // 台阶示意所在横带的顶部
var SRC_LIFT = 30;                // 依赖箭头起点抬到柱顶数值标签之上
var IDX_Y = 306, EQ_Y = 316, LEG_Y = 322;

function bx(k) { return X0 + k * (BAR_W + GAP); }       // 第 k 根柱子左边缘
function cx(k) { return bx(k) + BAR_W / 2; }            // 第 k 根柱子中线
function barH(v) { return v / MAXV * MAX_H; }
function barTop(v) { return BASE_Y - barH(v); }

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

/* 清掉上一步残留的动态元素（本 archetype 的元素都是常驻的，这里是保险丝） */
function reconcile(used) {
  for (var k in cache) {
    if (!used[k]) { cache[k].remove(); delete cache[k]; }
  }
}

/* 台阶示意：3 级台阶 + 两跳（+1 实线 / +2 虚线），都落在最高那级 = 第 i 阶。
   局部坐标以「最高级台阶正下方」为原点，整块靠 style.transform 平移到当前柱上方。 */
function ensurePicto() {
  if (picto) return picto;
  var g = document.createElementNS(NS, 'g');
  g.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
    ' opacity var(--dm-dur) var(--lc-ease)';

  var stair = document.createElementNS(NS, 'path');
  attr(stair, {
    class: 'dp-stair',
    d: 'M-22.5 62 L-22.5 50 L-7.5 50 L-7.5 38 L7.5 38 L7.5 26 L22.5 26 L22.5 62 Z'
  });
  var top = document.createElementNS(NS, 'path');      // 最高一级 = 第 i 阶
  attr(top, { class: 'dp-stair-top', d: 'M8.5 26 L21.5 26' });

  var hop2 = document.createElementNS(NS, 'path');     // 从 i-2 跨 2 阶
  attr(hop2, { class: 'dp-hop dp-hop-2', d: 'M-15 47 Q0 5 15 23' });
  var hop1 = document.createElementNS(NS, 'path');     // 从 i-1 跨 1 阶
  attr(hop1, { class: 'dp-hop', d: 'M0 35 Q7.5 19 15 23' });

  var dot = document.createElementNS(NS, 'circle');
  attr(dot, { class: 'dp-hop-dot', cx: 15, cy: 23, r: 2.6 });

  var t2 = document.createElementNS(NS, 'text');
  attr(t2, { class: 'dp-hop-tx dp-hop-tx-2', x: -13, y: 11 });
  txt(t2, '+2');
  var t1 = document.createElementNS(NS, 'text');
  attr(t1, { class: 'dp-hop-tx dp-hop-tx-1', x: 14, y: 12 });
  txt(t1, '+1');

  g.appendChild(stair);
  g.appendChild(top);
  g.appendChild(hop2);
  g.appendChild(hop1);
  g.appendChild(dot);
  g.appendChild(t2);
  g.appendChild(t1);

  cache.picto = g;                // 交给 reconcile 统一管
  svg.appendChild(g);
  picto = g;
  return g;
}

function paint(s) {
  var used = Object.create(null);
  var k, e;

  /* 顶部标题 + n 药丸（静态） */
  e = ensure('title', 'text'); used.title = 1;
  attr(e, { x: 8, y: 24, class: 'panel-title' });
  txt(e, 'DP 表 · dp[i] = 走到第 i 阶的方法数');

  e = ensure('n-bg', 'rect'); used['n-bg'] = 1;
  attr(e, { x: STAGE.w - 96, y: 8, width: 88, height: 24, rx: 12, class: 'chip-bg' });
  e = ensure('n-tx', 'text'); used['n-tx'] = 1;
  attr(e, { x: STAGE.w - 52, y: 24, class: 'chip-tx' });
  txt(e, 'n = ' + N);

  /* 基线 + 下标行说明 */
  e = ensure('axis', 'line'); used.axis = 1;
  attr(e, { x1: X0 - 8, y1: BASE_Y, x2: bx(N) + BAR_W + 8, y2: BASE_Y, class: 'dp-axis' });

  e = ensure('axis-lbl', 'text'); used['axis-lbl'] = 1;
  attr(e, { x: 8, y: IDX_Y, class: 'lbl-dim' });
  txt(e, '下标 i');

  /* 柱子：轨道（满刻度虚线）+ 柱体（scaleY 生长）+ 柱顶数值 + 下标 */
  for (k = 0; k <= N; k++) {
    var v = s.dp[k];
    var has = v !== undefined;                      // 字典里还没这个 key = 还没算
    var isSrc = !!(s.src && (s.src[0] === k || s.src[1] === k));
    var isTgt = (s.i === k && s.phase !== 'done');
    var isAns = (s.i === k && s.phase === 'done');

    e = ensure('t' + k, 'rect'); used['t' + k] = 1;
    attr(e, {
      x: bx(k), y: BASE_Y - MAX_H, width: BAR_W, height: MAX_H, rx: 4,
      class: 'dp-track' + (isTgt ? ' dp-track-on' : '')
    });

    /* 柱体永远是满刻度高，靠 scaleY 从基线往上长（transform-origin 见 CSS） */
    var barCls = 'dp-bar';
    if (isAns) barCls += ' dp-bar-ans';
    else if (!has) barCls += ' dp-bar-pending';
    else if (isTgt) barCls += ' dp-bar-write';
    else if (k <= 2) barCls += ' dp-bar-base';       // dp[0..2] 是写死的基础值
    else barCls += ' dp-bar-rec';                    // dp[3..] 由递推得出
    if (isSrc && has) barCls += ' dp-bar-read';

    e = ensure('b' + k, 'rect'); used['b' + k] = 1;
    attr(e, { x: bx(k), y: BASE_Y - MAX_H, width: BAR_W, height: MAX_H, rx: 3, class: barCls });
    e.style.transform = 'scaleY(' + (has ? barH(v) / MAX_H : 0) + ')';

    /* 数值：高柱子塞进柱子内部，矮柱子放柱子上方（否则会和依赖箭头打架） */
    var valCls, valTx, valY;
    if (!has) { valCls = 'dp-val-dim'; valTx = '—'; valY = BASE_Y - 8; }
    else {
      valY = barH(v) >= 24 ? barTop(v) + 18 : barTop(v) - 8;
      valTx = String(v);
      valCls = isAns ? 'dp-val-ans' : (isSrc ? 'dp-val-read' : (isTgt ? 'dp-val-write' : 'dp-val'));
    }
    e = ensure('v' + k, 'text'); used['v' + k] = 1;
    attr(e, { x: cx(k), y: 0, class: valCls });
    e.style.transform = 'translate(0px,' + valY + 'px)';
    txt(e, valTx);

    e = ensure('d' + k, 'text'); used['d' + k] = 1;
    attr(e, { x: cx(k), y: 0, class: 'cell-idx' + (isTgt || isAns ? ' dp-idx-on' : '') });
    e.style.transform = 'translate(0px,' + IDX_Y + 'px)';
    txt(e, String(k));
  }

  /* 依赖箭头：dp[i-1] 和 dp[i-2] 两条弧线汇进 dp[i]，把转移方程画出来。
     汇聚点取「两个来源柱顶、目标柱顶」三者最高处再抬 26px，
     这样 read / write 两相位置一致（不会跳），且永远压不到柱顶数值。 */
  var fa = ensure('flow-a', 'path'); used['flow-a'] = 1;
  var fb = ensure('flow-b', 'path'); used['flow-b'] = 1;
  var fd = ensure('flow-drop', 'path'); used['flow-drop'] = 1;
  var fh = ensure('flow-head', 'path'); used['flow-head'] = 1;
  if (s.src) {
    var xi = cx(s.i);
    var v1 = s.dp[s.src[0]], v2 = s.dp[s.src[1]];
    var y1 = barTop(v1) - SRC_LIFT, y2 = barTop(v2) - SRC_LIFT;
    var convY = Math.min(y1, y2, barTop(v1 + v2)) - 26;
    var done = s.phase === 'write';
    var lineCls = 'edge ' + (done ? 'edge-done' : 'edge-active');

    attr(fa, { class: lineCls, d: 'M' + cx(s.src[0]) + ' ' + y1 + ' Q' + cx(s.src[0]) + ' ' + convY + ' ' + xi + ' ' + convY });
    attr(fb, { class: lineCls, d: 'M' + cx(s.src[1]) + ' ' + y2 + ' Q' + cx(s.src[1]) + ' ' + convY + ' ' + xi + ' ' + convY });
    attr(fd, { class: lineCls, 'stroke-dasharray': '3 3', d: 'M' + xi + ' ' + convY + ' L' + xi + ' ' + (convY + 9) });
    attr(fh, {
      class: done ? 'dp-head dp-head-done' : 'dp-head',
      d: 'M0 0 L-5 -9 L5 -9 Z',
      transform: 'translate(' + xi + ',' + (convY + 18) + ')'
    });
    fa.style.opacity = fb.style.opacity = fd.style.opacity = fh.style.opacity = '1';
  } else {
    fa.style.opacity = fb.style.opacity = fd.style.opacity = fh.style.opacity = '0';
  }

  /* 台阶示意：滑到当前柱正上方（夹一下，防止最右柱把它推出 viewBox） */
  e = ensurePicto(); used.picto = 1;
  var px = Math.max(30, Math.min(STAGE.w - 30, cx(s.i)));
  e.style.transform = 'translate(' + px + 'px,' + PICTO_Y + 'px)';

  /* 等式读数：本题的数值主线，末步换成绿色徽章 */
  var eqLine;
  if (s.phase === 'init') eqLine = s.i === 0 ? 'dp = {0: 0}' : 'dp[' + s.i + '] = ' + s.dp[s.i];
  else if (s.phase === 'read') eqLine = 'dp[' + s.i + '] = dp[' + s.src[0] + '] + dp[' + s.src[1] + '] = ?';
  else if (s.phase === 'write') {
    eqLine = 'dp[' + s.i + '] = dp[' + s.src[0] + '] + dp[' + s.src[1] + '] = ' +
      s.dp[s.src[0]] + ' + ' + s.dp[s.src[1]] + ' = ' + s.dp[s.i];
  } else eqLine = 'return dp[' + N + '] = ' + s.dp[N];

  e = ensure('eq-bg', 'rect'); used['eq-bg'] = 1;
  attr(e, {
    x: STAGE.w / 2 - 160, y: EQ_Y, width: 320, height: 26, rx: 13,
    class: s.phase === 'done' ? 'badge-bg' : 'chip-bg'
  });
  e = ensure('eq-tx', 'text'); used['eq-tx'] = 1;
  attr(e, { x: 0, y: 0, class: 'dp-eq' + (s.phase === 'done' ? ' dp-eq-done' : '') });
  e.style.transform = 'translate(' + (STAGE.w / 2) + 'px,' + (EQ_Y + 17) + 'px)';
  txt(e, eqLine);

  /* 图例：区分「写死的基础值」和「递推算出来的」 */
  e = ensure('lg1-sw', 'rect'); used['lg1-sw'] = 1;
  attr(e, { x: 8, y: LEG_Y, width: 11, height: 11, rx: 3, class: 'dp-sw dp-sw-base' });
  e = ensure('lg1-tx', 'text'); used['lg1-tx'] = 1;
  attr(e, { x: 0, y: 0, class: 'lbl-dim' });
  e.style.transform = 'translate(24px,' + (LEG_Y + 10) + 'px)';
  txt(e, '基础值');

  e = ensure('lg2-sw', 'rect'); used['lg2-sw'] = 1;
  attr(e, { x: 76, y: LEG_Y, width: 11, height: 11, rx: 3, class: 'dp-sw dp-sw-rec' });
  e = ensure('lg2-tx', 'text'); used['lg2-tx'] = 1;
  attr(e, { x: 0, y: 0, class: 'lbl-dim' });
  e.style.transform = 'translate(92px,' + (LEG_Y + 10) + 'px)';
  txt(e, '递推得出');

  reconcile(used);
}

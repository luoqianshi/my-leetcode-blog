/* ============================================================
   archetype: linked-list
   参考实现 = 206. 反转链表（head = 1 → 2 → 3 → 4 → 5 → null）
   动画严格照着题解「## 代码实现」里那段迭代三指针 Python 走：
   prev / curr / next_node，一步不多、一步不少。

   这是「定距节点行 + 上下双侧边 + 滑动指针徽章」家族的样板；
   反转 / 合并 / 删除 / 快慢指针 / 相交链表 等链表题都从它改起。

   🔴 布局铁律：节点横坐标只由它在**原链表**里的下标决定，全程不动。
      指针移动 = 徽章滑动；链表反转 = 边从下方翻到上方。
      一旦跟着指针重排节点，读者就失去参照系，「反转」根本看不出来。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 VALS / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

var VALS = [1, 2, 3, 4, 5];
var N = VALS.length;
var STAGE = { w: 680, h: 264, minW: 560 };

/* 每个节点在**原链表**里的后继。paint() 靠它判断某条 next 是否已经翻转过：
   翻转后 nodes[i].next !== ORIG_NEXT[i] 恒成立（回指左邻 vs 前指右邻）。 */
var ORIG_NEXT = (function () {
  var a = [];
  for (var i = 0; i < N; i++) a.push(i + 1 < N ? i + 1 : null);
  return a;
})();

/* 顶栏那枚「当前正在执行哪行 Python」的药丸，逐字抄自题解代码块 */
var CODE_LINE = {
  'init': 'prev = None · curr = head',
  'save-next': 'next_node = curr.next',
  'rewire': 'curr.next = prev',
  'advance': 'prev = curr · curr = next_node',
  'done': 'return prev'
};

var REV_CHAIN = VALS.slice().reverse().join(' → ');

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

function buildList() {
  var a = [];
  for (var i = 0; i < N; i++) {
    a.push({ id: i, val: VALS[i], next: ORIG_NEXT[i] });
  }
  return a;
}

/* ---------- 录制：真跑一遍算法，每步存一份纯数据快照 ----------
   🔴 nodes 必须每步整份深拷贝，**连元素一起拷**。链表题改的就是 next 本身，
      存引用的话所有快照会共享同一批节点对象，动画直接退化成「每帧都是最终态」。
      check-demo.mjs 对数组元素也做引用同一性比较，所以 map 出新对象是硬要求。 */
function cloneNodes(nodes) {
  return nodes.map(function (n) { return { id: n.id, val: n.val, next: n.next }; });
}

function buildSteps() {
  var nodes = buildList();
  var prev = null;        // Python 里的 prev，存节点下标；null = None
  var curr = 0;           // head 的下标
  var next_node = null;   // 循环体里临时保存的后继
  var round = 0;

  record({ phase: 'init', prev: prev, curr: curr, next: null, nodes: cloneNodes(nodes) },
    '初始化：prev = None，curr = head 指向节点 ' + VALS[0] +
    '。左边那个 null 就是 prev 此刻的值，反转结束后它会变成新链表尾巴的 next。');

  while (curr !== null) {
    round++;
    var v = nodes[curr].val;

    next_node = nodes[curr].next;
    record({ phase: 'save-next', prev: prev, curr: curr, next: next_node, nodes: cloneNodes(nodes) },
      next_node === null
        ? '第 ' + round + ' 轮：curr 是尾节点，next_node = curr.next = null。先把这个 null 存住，它正是 while 循环的退出条件。'
        : '第 ' + round + ' 轮：先用 next_node 记住 curr.next = ' + nodes[next_node].val +
          '，否则一旦改写 curr.next 就再也找不到后面的节点了（断链）。');

    nodes[curr].next = prev;
    record({ phase: 'rewire', prev: prev, curr: curr, next: next_node, nodes: cloneNodes(nodes) },
      prev === null
        ? 'curr.next = prev = null：节点 ' + v + ' 的 next 从下方翻到上方，接回最左边那个 null —— 它成了反转后链表的尾巴。'
        : 'curr.next = prev：节点 ' + v + ' 的 next 掉头指回 ' + nodes[prev].val +
          '。这条边由下方灰色翻成上方绿色，前面这一段已经反转好了。');

    prev = curr;
    curr = next_node;
    record({ phase: 'advance', prev: prev, curr: curr, next: next_node, nodes: cloneNodes(nodes) },
      curr === null
        ? 'prev = curr（节点 ' + v + '），curr = next_node = null。while curr 不再成立，循环结束。'
        : 'prev = curr，curr = next_node：三个指针整体右移一格。prev 守住已反转部分的头，curr 去处理下一个节点。');
  }

  record({ phase: 'done', prev: prev, curr: curr, next: next_node, nodes: cloneNodes(nodes) },
    '返回 prev —— 它指向节点 ' + nodes[prev].val + '，就是反转后的新头节点。整条链变成 ' +
    REV_CHAIN + ' → null，每条 next 都从下方翻到了上方。');
}

buildSteps();

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / opacity / transform / textContent。
      位移一律走 style.transform 而非重设 x 属性，transition 才会滑动。
      本 archetype 的元素数量是定值（节点数固定，每个节点恰好一条上方弧 + 一条下方边），
      所以不需要 array-hash 里的 reconcile()：没有元素增删，只有显隐与改色。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);

/* 列号：-1 = 左边的 null，0..N-1 = 节点，N = 右边的 null。
   🔴 cx() 只吃列号，任何一步都不会变 —— 这就是那个「稳定参照系」。 */
var COLW = 88;
var MX = (STAGE.w - (N + 1) * COLW) / 2;
function cx(c) { return MX + (c + 1) * COLW; }

var NODE_W = 56, NODE_H = 44;
var NODE_TOP = 96, NODE_CY = NODE_TOP + NODE_H / 2, NODE_BOT = NODE_TOP + NODE_H;
var NULL_W = 48, NULL_H = 28;
var NULL_TOP = NODE_CY - NULL_H / 2, NULL_BOT = NULL_TOP + NULL_H;

var BACK_RISE = 76;   // 上方回指弧的拱起量（弧顶落在 y≈58，避开顶栏图例）
var FWD_SAG = 40;     // 下方前指边的下垂量（谷底落在 y≈160）
var LANE_A = 176;     // prev / next_node 徽章的箭头尖端 y
var LANE_B = 218;     // curr 徽章单独占一行：advance 时它与 next_node 同列，分行才不会叠字

function isNullCol(c) { return c < 0 || c >= N; }
function halfW(c) { return isNullCol(c) ? NULL_W / 2 : NODE_W / 2; }
function topY(c) { return isNullCol(c) ? NULL_TOP : NODE_TOP; }
function botY(c) { return isNullCol(c) ? NULL_BOT : NODE_BOT; }

/* 该节点的 next 是否已经翻转过（回指左边） */
function isBack(s, i) { return s.nodes[i].next !== ORIG_NEXT[i]; }

/* 上方回指弧：从 a 顶部拱起、落回 b 顶部（b 在 a 左边），箭头指向 b */
function arcUp(a, b) {
  var x1 = cx(a) - halfW(a) + 12, y1 = topY(a);
  var x2 = cx(b) + halfW(b) - 12, y2 = topY(b);
  return 'M' + x1 + ' ' + y1 + ' Q' + ((x1 + x2) / 2) + ' ' +
    (Math.min(y1, y2) - BACK_RISE) + ' ' + x2 + ' ' + y2;
}

/* 下方前指边：从 a 底部垂下、抬进 b 底部（b 在 a 右边），箭头指向 b */
function arcDown(a, b) {
  var x1 = cx(a) + halfW(a) - 12, y1 = botY(a);
  var x2 = cx(b) - halfW(b) + 12, y2 = botY(b);
  return 'M' + x1 + ' ' + y1 + ' Q' + ((x1 + x2) / 2) + ' ' +
    (Math.max(y1, y2) + FWD_SAG) + ' ' + x2 + ' ' + y2;
}

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

/* 箭头一律用 marker：曲率到处变，手绘三角形要自己算切线角，得不偿失。
   marker 内容不吃 .edge 的 stroke，颜色只能靠 linked-list.css 里的 .ll-ah-* 给 fill。 */
function ensureMarkers() {
  if (cache['defs']) return;
  var defs = document.createElementNS(NS, 'defs');
  var kinds = { dim: 'll-ah-dim', accent: 'll-ah-accent', done: 'll-ah-done' };
  for (var k in kinds) {
    var m = document.createElementNS(NS, 'marker');
    attr(m, {
      id: 'dm-ah-' + k, markerUnits: 'userSpaceOnUse',
      markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: 'auto'
    });
    var p = document.createElementNS(NS, 'path');
    attr(p, { d: 'M0 0 L8 4 L0 8 Z', class: kinds[k] });
    m.appendChild(p);
    defs.appendChild(m);
  }
  cache['defs'] = defs;
  svg.appendChild(defs);
}

/* 指针徽章：箭头朝上戳住节点底边，整组靠 style.transform 平移（这样才会滑动） */
function paintPtr(key, cls, label, col, laneY, opacity) {
  var g = cache[key];
  if (!g) {
    g = document.createElementNS(NS, 'g');
    g.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
      ' opacity var(--dm-dur) var(--lc-ease)';
    var arrow = document.createElementNS(NS, 'path');
    attr(arrow, { d: 'M0 0 L-6 12 L6 12 Z', class: 'ptr-arrow' });
    var lab = document.createElementNS(NS, 'text');
    attr(lab, { y: 26, class: 'ptr-label' });
    g.appendChild(arrow);
    g.appendChild(lab);
    cache[key] = g;
    svg.appendChild(g);
  }
  attr(g, { class: cls });
  g.style.opacity = opacity;
  g.style.transform = 'translate(' + cx(col) + 'px,' + laneY + 'px)';
  txt(g.childNodes[1], label);
}

function paint(s) {
  var i, e;

  ensureMarkers();

  /* ---------- 顶栏：图例（两条迷你曲线各自示范上方 / 下方的边） ---------- */
  e = ensure('lg-up', 'path');
  attr(e, { d: 'M18 24 Q29 14 40 24', class: 'edge edge-done ll-lg' });
  e = ensure('lg-up-tx', 'text');
  attr(e, { x: 46, y: 24, class: 'lbl-dim' });
  txt(e, '已反转的 next');

  e = ensure('lg-dn', 'path');
  attr(e, { d: 'M150 20 Q161 30 172 20', class: 'edge ll-lg' });
  e = ensure('lg-dn-tx', 'text');
  attr(e, { x: 178, y: 24, class: 'lbl-dim' });
  txt(e, '未反转的 next');

  /* ---------- 顶栏：当前执行到哪行 Python（done 时换成绿色结论色） ---------- */
  var fin = s.phase === 'done';
  e = ensure('code-bg', 'rect');
  attr(e, { x: STAGE.w - 256, y: 9, width: 240, height: 22, rx: 11, class: fin ? 'badge-bg' : 'chip-bg' });
  e = ensure('code-tx', 'text');
  attr(e, { x: STAGE.w - 136, y: 24, class: fin ? 'badge-tx' : 'chip-tx' });
  txt(e, CODE_LINE[s.phase]);

  /* ---------- 两个 null 端点：prev = None 和 curr 走到头都指着它们 ---------- */
  e = ensure('null-l-bg', 'rect');
  /* 节点 0 一旦回指左边，这个 null 就成了新链表尾巴的 next，跟着染绿 */
  attr(e, {
    x: cx(-1) - NULL_W / 2, y: NULL_TOP, width: NULL_W, height: NULL_H, rx: NULL_H / 2,
    class: 'll-null' + (isBack(s, 0) ? ' ll-null-hit' : '')
  });
  e = ensure('null-l-tx', 'text');
  attr(e, { x: cx(-1), y: NULL_TOP + 18, class: 'll-null-tx' });
  txt(e, 'null');

  e = ensure('null-r-bg', 'rect');
  attr(e, { x: cx(N) - NULL_W / 2, y: NULL_TOP, width: NULL_W, height: NULL_H, rx: NULL_H / 2, class: 'll-null' });
  e = ensure('null-r-tx', 'text');
  attr(e, { x: cx(N), y: NULL_TOP + 18, class: 'll-null-tx' });
  txt(e, 'null');

  /* ---------- 节点行：定距，永不重排 ---------- */
  for (i = 0; i < N; i++) {
    var x = cx(i);
    var back = isBack(s, i);
    var cls = 'node';
    if (s.curr === i) cls += ' node-active';
    else if (back) cls += ' node-done';

    e = ensure('nb' + i, 'rect');
    attr(e, { x: x - NODE_W / 2, y: NODE_TOP, width: NODE_W, height: NODE_H, rx: 9, class: cls });

    /* val | next 两个字段之间的分隔线 */
    e = ensure('nf' + i, 'line');
    attr(e, { x1: x + 8, y1: NODE_TOP + 7, x2: x + 8, y2: NODE_BOT - 7, class: 'll-field' });

    e = ensure('nv' + i, 'text');
    attr(e, { x: x - 10, y: NODE_CY + 5, class: 'node-val' });
    txt(e, String(VALS[i]));

    /* next 字段小圆点：颜色跟着这条边有没有翻转过走 */
    e = ensure('nd' + i, 'circle');
    attr(e, { cx: x + 18, cy: NODE_CY, r: 3.5, class: back ? 'll-dot ll-dot-back' : 'll-dot' });
  }

  /* ---------- 边：每个节点恰好一条 next，未反转在下方（灰），已反转在上方（绿） ----------
     翻转那一步两条路径互换 opacity，配合 ensure() 里的 transition 就是一次交叉淡入淡出，
     看上去正是「这条边从下面翻到了上面」。 */
  for (i = 0; i < N; i++) {
    var isb = isBack(s, i);
    var bt = isb ? (s.nodes[i].next === null ? -1 : s.nodes[i].next) : (i === 0 ? -1 : i - 1);
    var ft = ORIG_NEXT[i] === null ? N : ORIG_NEXT[i];
    /* 高亮：save-next 时点亮「正在被读」的下方边，rewire 时点亮「刚刚翻上去」的上方弧 */
    var hotB = isb && s.phase === 'rewire' && s.curr === i;
    var hotF = !isb && s.phase === 'save-next' && s.curr === i;

    e = ensure('eb' + i, 'path');
    attr(e, {
      d: arcUp(i, bt), fill: 'none',
      class: 'edge ' + (hotB ? 'edge-active' : 'edge-done'),
      'marker-end': 'url(#dm-ah-' + (hotB ? 'accent' : 'done') + ')'
    });
    e.style.opacity = isb ? '1' : '0';

    e = ensure('ef' + i, 'path');
    attr(e, {
      d: arcDown(i, ft), fill: 'none',
      class: 'edge' + (hotF ? ' edge-active' : ''),
      'marker-end': 'url(#dm-ah-' + (hotF ? 'accent' : 'dim') + ')'
    });
    e.style.opacity = isb ? '0' : '1';
  }

  /* ---------- 三个滑动指针徽章 ----------
     prev = None → 左边那个 null；curr / next_node = null → 右边那个 null。
     init 时 next_node 还没被赋值，先藏起来，别让它假装站在某个位置上。 */
  paintPtr('ptr-prev', 'ptr-prev', 'prev', s.prev === null ? -1 : s.prev, LANE_A, '1');
  paintPtr('ptr-curr', '', 'curr', s.curr === null ? N : s.curr, LANE_B, '1');
  paintPtr('ptr-next', 'ptr-next', 'next_node', s.next === null ? N : s.next, LANE_A,
    s.phase === 'init' ? '0' : '1');
}

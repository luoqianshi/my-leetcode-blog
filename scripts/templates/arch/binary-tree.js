/* ============================================================
   archetype: binary-tree
   参考实现 = 104. 二叉树的最大深度
   （LeetCode 官方示例：root = [3,9,20,null,null,15,7] → 3）

   这是「树 + 右侧递归调用栈面板 + 自底向上回填角标」家族的样板；
   树的直径 / 平衡二叉树 / 翻转二叉树 / 路径总和 / 最近公共祖先
   等题都从它改起。

   布局铁律：节点坐标在启动时算一次（x = 中序序号，y = 深度），
   之后任何一步都不许动 —— 位置一跳，读者刚建立的空间记忆就废了。
   paint() 里只改 class / opacity / transform / textContent。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 NODES / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

/* 邻接表写法：id 即数组下标，left / right 为空孩子时用 -1（对应 Python 的 None） */
var NODES = [
  { id: 0, val: 3,  left: 1,  right: 2  },
  { id: 1, val: 9,  left: -1, right: -1 },
  { id: 2, val: 20, left: 3,  right: 4  },
  { id: 3, val: 15, left: -1, right: -1 },
  { id: 4, val: 7,  left: -1, right: -1 }
];
var ROOT = 0;
var STAGE = { w: 700, h: 330, minW: 580 };

/* ---------- 几何常量：全部一次定死，paint() 只读不算 ---------- */
var NODE_R = 19;      /* 真实节点半径，对齐 --dm-node-r */
var NULL_R = 6;       /* 空节点小空心圈半径 */
var SLOT_W = 80;      /* 中序序号 → x 的槽宽 */
var LEVEL_H = 74;     /* 层间距 */
var Y0 = 58;          /* 根节点 cy */
var TREE_X0 = 28;     /* 树区左边界（树区约占 viewBox 左 60%） */
var NULL_DX = 32;     /* 空节点相对父节点的水平偏移 */
var LEGEND_Y = 306;

var PANEL_X = 452, PANEL_Y = 10, PANEL_W = 232, PANEL_H = 308;
var FRAME_X = PANEL_X + 12;
var FRAME_Y0 = PANEL_Y + 34;
var FRAME_W = PANEL_W - 24, FRAME_H = 28, FRAME_GAP = 8;
var FRAME_SLOTS = 5;  /* 本题最深 4 帧，多留 1 格余量 */
var DIV_Y = FRAME_Y0 + FRAME_SLOTS * (FRAME_H + FRAME_GAP) - FRAME_GAP + 14;
var RET_TTL_Y = DIV_Y + 20;
var RET_Y = DIV_Y + 44;
var NOTE_Y = DIV_Y + 66;

/* 帧状态 → 帧右侧小字。L=正在求左子树 R=左已返回正在求右 M=两侧都返回 B=空节点基线 */
var STATE_TX = { L: '等左子树', R: '等右子树', M: '即将返回', B: '空节点' };

/* ---------- 布局：启动时算一次，永不重算 ---------- */
var POS = Object.create(null);       /* id        -> { x, y } 真实节点圆心 */
var NULL_POS = Object.create(null);  /* 'id|L/R'  -> { x, y } 空节点圈心 */
var MAX_LEVEL = 0;
var DEEPEST = 0;                     /* 调用栈最深帧数（含空节点那一帧） */

function layoutTree() {
  var slot = 0;
  /* 中序遍历给 x 序号：叶子之间不会互相压住，斜树也不会挤成一坨 */
  function walk(id, level) {
    if (id < 0) return;
    var n = NODES[id];
    walk(n.left, level + 1);
    POS[id] = { x: TREE_X0 + SLOT_W / 2 + (slot++) * SLOT_W, y: Y0 + level * LEVEL_H };
    if (level > MAX_LEVEL) MAX_LEVEL = level;
    walk(n.right, level + 1);
  }
  walk(ROOT, 0);

  for (var i = 0; i < NODES.length; i++) {
    var p = POS[i];
    if (NODES[i].left < 0) NULL_POS[i + '|L'] = { x: p.x - NULL_DX, y: p.y + LEVEL_H };
    if (NODES[i].right < 0) NULL_POS[i + '|R'] = { x: p.x + NULL_DX, y: p.y + LEVEL_H };
  }
  /* 最深调用栈 = 树高（非空帧）+ 1（叶子下面那一次 maxDepth(None)） */
  DEEPEST = MAX_LEVEL + 2;
}
layoutTree();

/* 按层序还原 LeetCode 的数组写法，尾部多余 null 去掉 */
function srcText() {
  var out = [], queue = [ROOT];
  while (queue.length) {
    var id = queue.shift();
    if (id < 0) { out.push('null'); continue; }
    out.push(String(NODES[id].val));
    queue.push(NODES[id].left, NODES[id].right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return 'root = [' + out.join(', ') + ']';
}
var SRC_TEXT = srcText();

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

/* 🔴 depth / stack 每步都必须新拷一份。直接存引用的话所有步骤会指向同一个
   不断变化的对象，动画就变成「每一步都显示最终态」。
   stack 装的是帧对象，check-demo 按**元素**比对引用，所以要逐帧重建。 */
function cloneDepth(o) {
  var r = {};
  for (var k in o) r[k] = o[k];
  return r;
}

function cloneStack(a) {
  var r = [];
  for (var i = 0; i < a.length; i++) r.push({ id: a[i].id, state: a[i].state });
  return r;
}

function valOf(id) { return id < 0 ? 'null' : String(NODES[id].val); }

/* 每步都挑深度更大的那一侧往下走，得到一条最长路径，用于收尾旁白 */
function longestPath(depth) {
  var out = [], id = ROOT;
  while (id >= 0) {
    var n = NODES[id];
    out.push(n.val);
    var dl = n.left < 0 ? 0 : depth[n.left];
    var dr = n.right < 0 ? 0 : depth[n.right];
    id = dl >= dr ? n.left : n.right;
  }
  return out.join(' → ');
}

/* ---------- 录制：真跑一遍 maxDepth，每步存一份纯数据快照 ----------
   🔴 严格照着题解里那段 Python 走：
        if not root: return 0
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1
   所以①空节点也是一次真实调用，要在栈里占一帧；②左子树必须先于右子树求值；
   ③+1 发生在 max 之后、return 之前。 */
function buildSteps() {
  var stack = [];    /* 运行时调用栈，元素 { id, state } */
  var depth = {};    /* 已算出深度的节点：id -> 深度 */

  record({ phase: 'init', nodeId: null, stack: cloneStack(stack), depth: cloneDepth(depth), ret: null },
    '初始化：root 指向值为 ' + NODES[ROOT].val + ' 的节点，调用 maxDepth(root)。' +
    '递归调用栈是空的，还没有任何节点算出自己的深度。');

  function dfs(id) {
    /* ---- 基线分支：if not root: return 0 ---- */
    if (id < 0) {
      stack.push({ id: -1, state: 'B' });
      record({ phase: 'base', nodeId: null, stack: cloneStack(stack), depth: cloneDepth(depth), ret: 0 },
        'maxDepth(null)：root 为空，命中 if not root: return 0 —— 空节点的深度就是 0，' +
        '这一帧立刻出栈，递归不再往下走。' +
        (stack.length === DEEPEST
          ? '此刻栈深 ' + stack.length + ' 帧，正是空间复杂度 O(h) 的来源。'
          : ''));
      stack.pop();
      return 0;
    }

    var n = NODES[id];
    stack.push({ id: id, state: 'L' });

    record({ phase: 'visit', nodeId: id, stack: cloneStack(stack), depth: cloneDepth(depth), ret: null },
      '进入 maxDepth(节点 ' + n.val + ')：root 非空，if not root 不成立，压入一帧。' +
      '它必须等左右子树都返回才能算出自己的深度。当前栈深 ' + stack.length + ' 帧。');

    record({ phase: 'go-left', nodeId: id, stack: cloneStack(stack), depth: cloneDepth(depth), ret: null },
      'return max(self.maxDepth(root.left), …) + 1 从左往右求值，先递归 root.left：节点 ' +
      n.val + ' 的左孩子是 ' + (n.left < 0 ? 'null' : '节点 ' + NODES[n.left].val) +
      '，调用 maxDepth(' + valOf(n.left) + ')。');

    var L = dfs(n.left);

    stack[stack.length - 1].state = 'R';
    record({ phase: 'go-right', nodeId: id, stack: cloneStack(stack), depth: cloneDepth(depth), ret: null },
      '左子树返回 ' + L + '。接着递归 root.right：节点 ' + n.val + ' 的右孩子是 ' +
      (n.right < 0 ? 'null' : '节点 ' + NODES[n.right].val) + '，调用 maxDepth(' + valOf(n.right) + ')。');

    var R = dfs(n.right);

    stack[stack.length - 1].state = 'M';
    var z = Math.max(L, R) + 1;
    depth[id] = z;   /* 先记下再录，这一步的角标就要亮起来 */
    record({ phase: 'return', nodeId: id, stack: cloneStack(stack), depth: cloneDepth(depth), ret: z },
      '左子树返回 ' + L + '，右子树返回 ' + R + '，取 max 再 +1（节点 ' + n.val +
      ' 自己算一层）= ' + z + '。绿色角标记下这个深度，本帧出栈，控制权交回上一层。');

    stack.pop();
    return z;
  }

  var ans = dfs(ROOT);

  record({ phase: 'done', nodeId: null, stack: cloneStack(stack), depth: cloneDepth(depth), ret: ans },
    '栈已清空，递归结束：maxDepth(root) 返回 ' + ans + '。最长路径 ' + longestPath(depth) +
    ' 上一共 ' + ans + ' 个节点，所以这棵树的最大深度是 ' + ans + '。');
}

buildSteps();

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / opacity / transform / textContent。
      角标、高亮环这类会反复出现消失的元素一律首帧就建好、靠 opacity 显隐，
      这样 z 序固定，也不会因为反复 remove/append 而跳到最上层。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);
var nullRetTx = null;

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

/* 清掉上一步残留的动态元素（本题只有调用栈的帧会增删） */
function reconcile(used) {
  for (var k in cache) {
    if (!used[k]) { cache[k].remove(); delete cache[k]; }
  }
}

/* 面板里「本步返回值」那一行。全用代码原样，避免中文挤进等宽字体里对不齐 */
function retExpr(s) {
  if (s.phase === 'base') return 'return 0';
  if (s.phase === 'return') {
    var n = NODES[s.nodeId];
    var L = n.left < 0 ? 0 : s.depth[n.left];
    var R = n.right < 0 ? 0 : s.depth[n.right];
    return 'max(' + L + ', ' + R + ') + 1 = ' + s.ret;
  }
  if (s.phase === 'done') return 'maxDepth(root) = ' + s.ret;
  return 'ret = ?';
}

function paint(s) {
  var used = Object.create(null);
  var i, e, g, k;

  /* ---- 派生本步焦点 ---- */
  var aimSide = s.phase === 'go-left' ? 'L' : (s.phase === 'go-right' ? 'R' : null);
  var focusNull = null;   /* 本步命中的空节点 { p: 父 id, side: 'L'|'R' } */
  if (s.phase === 'base') {
    /* 空帧的上一帧就是发起这次调用的父帧，它的 state 恰好指出递归的是哪一侧 */
    var pf = s.stack[s.stack.length - 2];
    if (pf && pf.id >= 0 && (pf.state === 'L' || pf.state === 'R')) {
      focusNull = { p: pf.id, side: pf.state };
    }
  }
  var returning = s.phase === 'return' || s.phase === 'done';

  /* ---- 顶栏：输入数组 + 收尾答案 ---- */
  e = ensure('src-lbl', 'text'); used['src-lbl'] = 1;
  attr(e, { x: TREE_X0, y: 22, class: 'lbl-dim' });
  txt(e, SRC_TEXT);

  e = ensure('ans-bg', 'rect'); used['ans-bg'] = 1;
  attr(e, { x: 300, y: 8, width: 124, height: 22, rx: 11, class: 'badge-bg' });
  e.style.opacity = s.phase === 'done' ? '1' : '0';
  e = ensure('ans-tx', 'text'); used['ans-tx'] = 1;
  attr(e, { x: 362, y: 23, class: 'badge-tx bt-sans' });
  txt(e, '最大深度 = ' + (s.ret === null ? '—' : s.ret));
  e.style.opacity = s.phase === 'done' ? '1' : '0';

  /* ---- 真实节点之间的边 ---- */
  for (i = 0; i < NODES.length; i++) {
    var n = NODES[i], p = POS[i];
    for (var q = 0; q < 2; q++) {
      var side = q ? 'R' : 'L';
      var ch = q ? n.right : n.left;
      if (ch < 0) continue;
      k = 'e' + i + side;
      e = ensure(k, 'line'); used[k] = 1;
      attr(e, {
        x1: p.x, y1: p.y, x2: POS[ch].x, y2: POS[ch].y,
        class: 'edge' + (s.nodeId === i && aimSide === side ? ' edge-active'
          : (s.depth[ch] != null ? ' edge-done' : ''))
      });
    }
  }

  /* ---- 空节点：虚线短边 + 小空心圈。
         if not root: return 0 是本题一半的教学价值，不画出来就等于没讲。 ---- */
  for (i = 0; i < NODES.length; i++) {
    for (var q2 = 0; q2 < 2; q2++) {
      var sd = q2 ? 'R' : 'L';
      var nk = i + '|' + sd;
      var np = NULL_POS[nk];
      if (!np) continue;
      var on = !!((focusNull && focusNull.p === i && focusNull.side === sd) ||
                  (s.nodeId === i && aimSide === sd));
      var pp = POS[i];

      k = 'ne' + i + sd;
      e = ensure(k, 'line'); used[k] = 1;
      attr(e, {
        x1: pp.x, y1: pp.y, x2: np.x, y2: np.y,
        class: 'edge bt-edge-null' + (on ? ' bt-edge-null-on' : '')
      });

      k = 'nd-null-' + nk;
      e = ensure(k, 'circle'); used[k] = 1;
      attr(e, { cx: np.x, cy: np.y, r: NULL_R, class: 'bt-null' + (on ? ' bt-null-on' : '') });
    }
  }

  /* ---- 当前节点的高亮环（return 阶段转绿，表示这一帧正在交回答案） ---- */
  for (i = 0; i < NODES.length; i++) {
    k = 'ring' + i;
    e = ensure(k, 'circle'); used[k] = 1;
    attr(e, {
      cx: POS[i].x, cy: POS[i].y, r: NODE_R + 6,
      class: 'bt-ring' + (returning ? ' bt-ring-done' : '')
    });
    e.style.opacity = s.nodeId === i ? '1' : '0';
  }

  /* ---- 节点圆 + 值 ---- */
  for (i = 0; i < NODES.length; i++) {
    var cls = 'node';
    if (s.depth[i] != null) cls += ' node-done';
    else if (s.nodeId === i) cls += ' node-active';

    k = 'nd' + i;
    e = ensure(k, 'circle'); used[k] = 1;
    attr(e, { cx: POS[i].x, cy: POS[i].y, r: NODE_R, class: cls });

    k = 'nv' + i;
    e = ensure(k, 'text'); used[k] = 1;
    attr(e, { x: POS[i].x, y: POS[i].y + 5, class: 'node-val' });
    txt(e, String(NODES[i].val));
  }

  /* ---- 右下角绿色角标：深度自底向上逐个亮起，这是整段动画的回报 ---- */
  for (i = 0; i < NODES.length; i++) {
    var d = s.depth[i];
    var bx = POS[i].x + 10, by = POS[i].y + 9;

    k = 'bdg' + i;
    e = ensure(k, 'rect'); used[k] = 1;
    attr(e, { x: bx, y: by, width: 22, height: 16, rx: 8, class: 'badge-bg' });
    e.style.opacity = d == null ? '0' : '1';

    k = 'bdt' + i;
    e = ensure(k, 'text'); used[k] = 1;
    attr(e, { x: bx + 11, y: by + 11.5, class: 'badge-tx' });
    txt(e, d == null ? '' : String(d));
    e.style.opacity = d == null ? '0' : '1';
  }

  /* ---- 命中基线时挂在空节点上方的「返回 0」气泡 ---- */
  e = ensure('nullret', 'g'); used['nullret'] = 1;
  if (!nullRetTx) {
    var nb = document.createElementNS(NS, 'rect');
    attr(nb, { x: -23, y: -9, width: 46, height: 18, rx: 9, class: 'chip-bg' });
    nullRetTx = document.createElementNS(NS, 'text');
    attr(nullRetTx, { y: 4, class: 'chip-tx bt-sans' });
    e.appendChild(nb);
    e.appendChild(nullRetTx);
  }
  if (focusNull) {
    var fp = NULL_POS[focusNull.p + '|' + focusNull.side];
    txt(nullRetTx, '返回 0');
    /* -19 而不是 -16：气泡下沿（+9）要离空节点圈的上沿（-6-0.6）留出 3 个单位，
       否则两条描边贴在一起，看起来像气泡压在圈上。 */
    e.style.transform = 'translate(' + fp.x + 'px,' + (fp.y - 19) + 'px)';
    e.style.opacity = '1';
  } else {
    e.style.opacity = '0';
  }

  /* ---- 图例 ---- */
  k = 'lg-dot';
  e = ensure(k, 'circle'); used[k] = 1;
  attr(e, { cx: TREE_X0 + 6, cy: LEGEND_Y, r: 5, class: 'bt-null' });

  k = 'lg-dot-tx';
  e = ensure(k, 'text'); used[k] = 1;
  attr(e, { x: TREE_X0 + 18, y: LEGEND_Y + 4, class: 'lbl-dim bt-sans' });
  txt(e, '空节点 → return 0');

  k = 'lg-badge-bg';
  e = ensure(k, 'rect'); used[k] = 1;
  attr(e, { x: TREE_X0 + 142, y: LEGEND_Y - 7, width: 20, height: 14, rx: 7, class: 'badge-bg' });

  k = 'lg-badge-tx';
  e = ensure(k, 'text'); used[k] = 1;
  attr(e, { x: TREE_X0 + 152, y: LEGEND_Y + 3.5, class: 'badge-tx' });
  txt(e, '2');

  k = 'lg-badge-lb';
  e = ensure(k, 'text'); used[k] = 1;
  attr(e, { x: TREE_X0 + 170, y: LEGEND_Y + 4, class: 'lbl-dim bt-sans' });
  txt(e, '已算出的深度');

  /* ---- 递归调用栈面板：本演示真正的主角，O(h) 空间就长这样 ---- */
  e = ensure('panel-bg', 'rect'); used['panel-bg'] = 1;
  attr(e, {
    x: PANEL_X, y: PANEL_Y, width: PANEL_W, height: PANEL_H, rx: 10, class: 'panel-bg'
  });

  e = ensure('panel-ttl', 'text'); used['panel-ttl'] = 1;
  attr(e, { x: FRAME_X, y: PANEL_Y + 22, class: 'panel-title bt-sans' });
  txt(e, '递归调用栈');

  e = ensure('panel-cnt', 'text'); used['panel-cnt'] = 1;
  attr(e, { x: PANEL_X + PANEL_W - 12, y: PANEL_Y + 22, class: 'lbl-dim bt-r bt-sans' });
  txt(e, s.stack.length + ' 帧');

  for (i = 0; i < s.stack.length; i++) {
    var f = s.stack[i];
    var isTop = i === s.stack.length - 1;
    /* 只有 visit / base 这两步真的压了栈，脉冲动画也只在这两步放 */
    var isNew = isTop && (s.phase === 'visit' || s.phase === 'base');
    var isNull = f.id < 0;
    var isRet = f.state === 'M';
    var fk = 'f' + i;

    g = cache[fk];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
        ' opacity var(--dm-dur) var(--lc-ease)';
      g.appendChild(document.createElementNS(NS, 'rect'));
      g.appendChild(document.createElementNS(NS, 'text'));
      g.appendChild(document.createElementNS(NS, 'text'));
      cache[fk] = g;
      svg.appendChild(g);
    }
    used[fk] = 1;

    /* 帧的槽位只由它在栈里的序号决定，压栈追加、弹栈摘尾，永不重排 */
    attr(g, {
      class: 'chip' + (isNew ? ' chip-new' : ''),
      transform: 'translate(' + FRAME_X + ',' + (FRAME_Y0 + i * (FRAME_H + FRAME_GAP)) + ')'
    });
    attr(g.childNodes[0], {
      x: 0, y: 0, width: FRAME_W, height: FRAME_H, rx: 8,
      class: isRet ? 'badge-bg' : (isNull ? 'chip-bg bt-frame-null' : 'chip-bg')
    });
    attr(g.childNodes[1], {
      x: 12, y: 18, class: 'chip-tx bt-l' + (isRet ? ' bt-tx-ret' : '')
    });
    txt(g.childNodes[1], 'maxDepth(' + valOf(f.id) + ')');
    attr(g.childNodes[2], {
      x: FRAME_W - 10, y: 18,
      class: 'bt-state' + (isRet ? ' bt-state-ret' : (isNull ? ' bt-state-null' : ''))
    });
    txt(g.childNodes[2], STATE_TX[f.state]);
  }

  e = ensure('panel-div', 'line'); used['panel-div'] = 1;
  attr(e, { x1: FRAME_X, y1: DIV_Y, x2: PANEL_X + PANEL_W - 12, y2: DIV_Y, class: 'bt-div' });

  e = ensure('ret-ttl', 'text'); used['ret-ttl'] = 1;
  attr(e, { x: FRAME_X, y: RET_TTL_Y, class: 'panel-title bt-sans' });
  txt(e, '本步返回值');

  e = ensure('ret-tx', 'text'); used['ret-tx'] = 1;
  attr(e, { x: FRAME_X, y: RET_Y, class: 'bt-ret-tx' + (s.ret === null ? ' bt-ret-dim' : '') });
  txt(e, retExpr(s));

  e = ensure('panel-note', 'text'); used['panel-note'] = 1;
  attr(e, { x: FRAME_X, y: NOTE_Y, class: 'lbl-dim bt-sans' });
  txt(e, '最深 ' + DEEPEST + ' 帧 → 空间 O(h)');

  reconcile(used);
}

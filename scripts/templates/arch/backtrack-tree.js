/* ============================================================
   archetype: backtrack-tree
   参考实现 = 046. 全排列（nums = [1, 2, 3] → 6 个排列），严格照题解页
   「## 代码实现」那段 Python：

     result = []
     path = []
     used = [False] * len(nums)
     def backtrack():                    # 🔴 不接收任何参数，
         if len(path) == len(nums):      #    path / used / result 全是闭包变量
             result.append(path[:])      # 🔴 切片拷贝，不是 path
             return
         for i in range(len(nums)):      # 🔴 每层都从 i = 0 重扫，靠 used[] 跳过
             if used[i]:
                 continue
             used[i] = True
             path.append(nums[i])
             backtrack()
             path.pop()
             used[i] = False
     backtrack()

   这是「递归树 + 选择/撤销 + 结果收集」家族的样板；全排列 / 全排列 II /
   子集 / 组合 / 组合总和 / 括号生成 / 电话号码的字母组合 等回溯题都从它改起。

   🔴 忠实度优先：排列类每层 for 都从 i = 0 重扫、用 used[] 挡重复，
      不是从 start 开始（那是组合类题目的写法，画错了整棵树的形状都不对）。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 NUMS / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

/* 🔴 输入只用 3 个数：n = 4 时递归树有 65 个节点（1+4+12+24+24），
      叶子列根本排不下；n = 3 是 16 个节点（1+3+6+6），刚好一屏。 */
var NUMS = [1, 2, 3];
var STAGE = { w: 760, h: 430, minW: 640 };

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

function fmt(a) { return '[' + a.join(', ') + ']'; }

/* ---------- 预排布：启动时把「完整 n 层递归树」的坐标一次算死 ----------
   🔴 本 archetype 最重要的一条：坐标绝不随 alive 重算。
      节点长出来时整棵树若跟着挪位，「回溯」这件事就彻底看不出来 ——
      观众只会看到一团乱动的点，而不是「沿同一条边原路退回去」。
      所以这里先把 16 个节点全部排好，paint() 每步只切 opacity / class。 */

var R = 18;                                     // 节点半径
var LV_Y = [52, 120, 188, 256];                 // 四层节点的 cy（一次算死）
var X_EDGE = 44;                                // 叶子列最左一根的 cx
var X_PITCH = (STAGE.w - 2 * X_EDGE) / 5;       // 叶子列列距 = 134.4

var NODES = [];                                 // 前序 = 实际生成顺序
var EDGES = [];                                 // 每条边记「子节点 key + 边上的数字」
var BY_KEY = Object.create(null);
var TOTAL = 0;                                  // 叶子数 = n! = 最终排列个数

function buildTree() {
  var leafSlot = 0;
  var path = [];
  var used = [];
  var q;
  for (q = 0; q < NUMS.length; q++) used.push(false);

  /* x 走「后序回填」：叶子按 DFS 次序各占一个固定列，
     内部节点的 x = 其子节点 x 的平均值 —— 父亲永远坐在孩子们正中间，
     于是根落在画布正中，整棵树左右对称。 */
  function dfs(lv) {
    var key = path.join('-');
    var node = {
      key: key,
      lv: lv,
      path: path.slice(),                        // 只读，永不改
      val: lv ? path[lv - 1] : null,
      x: 0,
      y: LV_Y[lv]
    };
    NODES.push(node);
    BY_KEY[key] = node;

    if (lv === NUMS.length) {                    // 叶子 = 一个完整排列
      node.x = X_EDGE + (leafSlot++) * X_PITCH;
      TOTAL++;
      return node;
    }

    var sum = 0, cnt = 0, i;
    for (i = 0; i < NUMS.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(NUMS[i]);
      var kid = dfs(lv + 1);
      EDGES.push({ key: kid.key, from: key, lbl: String(NUMS[i]) });
      sum += kid.x; cnt++;
      path.pop();
      used[i] = false;
    }
    node.x = sum / cnt;
    return node;
  }

  dfs(0);

  /* 边的 d 与边标签坐标同样是静态量，一次算完；paint() 里只改 class / opacity。
     两端各收进 R + 2，免得线头从节点圆圈底下露出来（节点变淡时尤其明显）。 */
  for (var m = 0; m < EDGES.length; m++) {
    var ed = EDGES[m], p = BY_KEY[ed.from], c = BY_KEY[ed.key];
    var dx = c.x - p.x, dy = c.y - p.y;
    var L = Math.sqrt(dx * dx + dy * dy) || 1;
    var g = R + 2;
    ed.d = 'M' + (p.x + dx / L * g).toFixed(1) + ' ' + (p.y + dy / L * g).toFixed(1) +
      ' L' + (c.x - dx / L * g).toFixed(1) + ' ' + (c.y - dy / L * g).toFixed(1);
    /* 标签放中点，再沿水平方向让开一点：斜线甩到外侧，竖线甩到右边 */
    ed.lx = (p.x + c.x) / 2 + (dx === 0 ? 11 : (dx > 0 ? 10 : -10));
    ed.ly = (p.y + c.y) / 2 + 4;
  }
}

buildTree();

/* ---------- 录制：真跑一遍那段 Python，每步存一份纯数据快照 ----------
   🔴 path / used / alive / results 必须每次拷贝。直接存引用的话所有步骤会指向
      同一批不断变化的对象，动画就变成「每一步都显示最终态」。
      results 是「数组的数组」，光 slice 外层不够，里层每个排列也要 slice ——
      这恰好就是本题要讲的 path[:] 那件事。
   步数 = 16 次 backtrack() 调用（recurse）+ 15 次选择（choose）
        + 6 次收集（collect）+ 15 次撤销（unchoose）+ 1 次收尾（done）= 53。 */
function buildSteps() {
  var result = [];                              // ← Python 的 result
  var path = [];                                // ← Python 的 path
  var used = [];                                // ← Python 的 used
  var alive = [''];                             // 树上已经长出来的节点 key（只增不减）
  var i;
  for (i = 0; i < NUMS.length; i++) used.push(false);   // used = [False] * len(nums)

  function key() { return path.join('-'); }

  function shot(phase, activeKey, caption) {
    record({
      phase: phase,
      path: path.slice(),
      used: used.slice(),
      alive: alive.slice(),
      activeKey: activeKey,
      results: result.map(function (r) { return r.slice(); })
    }, caption);
  }

  /* 这一层 for 循环进门时的扫描结果：哪些 i 会被 continue 跳过、哪些还能选。
     旁白里把它说出来，「每层都从 0 重扫」这件事才看得见。 */
  function scan() {
    var skip = [], free = [], j;
    for (j = 0; j < NUMS.length; j++) (used[j] ? skip : free).push(j);
    return { skip: skip, free: free };
  }

  function nextFree(after) {
    for (var j = after + 1; j < NUMS.length; j++) if (!used[j]) return j;
    return -1;
  }

  function backtrack() {
    var k = key();
    var sc = scan();

    /* ---- 终止条件 ---- */
    if (path.length === NUMS.length) {
      shot('recurse', k,
        '进入 backtrack()：path = ' + fmt(path) + '，len(path) = ' + path.length +
        ' == len(nums) = ' + NUMS.length + ' —— 命中终止条件，这一层不再进 for 循环，直接收集后 return。');

      result.push(path.slice());                // ← result.append(path[:])
      shot('collect', k,
        'path 已满 ' + NUMS.length + ' 个，执行 result.append(path[:])：用切片拷出一份 ' + fmt(path) +
        ' 放进 result，这是第 ' + result.length + ' 个排列。必须拷贝 —— path 自始至终是同一个列表对象，' +
        '紧接着就会被 pop 改掉；要是直接 append(path)，result 里六个元素会全指向它，最后统统变成空列表。');
      return;
    }

    /* ---- 进门：报一下这一层的扫描情况 ---- */
    shot('recurse', k,
      (path.length
        ? '进入 backtrack()：path = ' + fmt(path) + '，len(path) = ' + path.length +
          ' != ' + NUMS.length + '，还没到底。'
        : '初始化 result = []、path = []、used = [False, False, False]，调用 backtrack()。' +
          '根节点代表空路径，len(path) = 0 != ' + NUMS.length + '。') +
      'for i in range(' + NUMS.length + ') 每一层都从 i = 0 重扫：' +
      (sc.skip.length
        ? 'i = ' + sc.skip.join('、') + ' 的 used 已是 True，continue 跳过；'
        : '三个下标都还空着，谁都不用跳；') +
      '这一层实际能选的是 i = ' + sc.free.join('、') + '（数字 ' +
      sc.free.map(function (x) { return NUMS[x]; }).join('、') + '）。');

    for (var i2 = 0; i2 < NUMS.length; i2++) {
      if (used[i2]) continue;                   // ← if used[i]: continue

      var parPath = path.slice();
      used[i2] = true;                          // ← used[i] = True
      path.push(NUMS[i2]);                      // ← path.append(nums[i])
      var childKey = key();
      alive.push(childKey);

      shot('choose', childKey,
        '选择：在节点 ' + fmt(parPath) + ' 里取 i = ' + i2 + '（nums[' + i2 + '] = ' + NUMS[i2] +
        '）—— used[' + i2 + '] = True，path.append 后 path = ' + fmt(path) +
        '，树上沿标着「' + NUMS[i2] + '」的边长出新节点，深度 +1。');

      backtrack();                              // ← backtrack()

      path.pop();                               // ← path.pop()
      used[i2] = false;                         // ← used[i] = False
      var backKey = key();
      var nxt = nextFree(i2);
      var isLeaf = BY_KEY[childKey].lv === NUMS.length;

      shot('unchoose', backKey,
        '撤销选择：子调用返回，path.pop() 弹出 ' + NUMS[i2] + '、used[' + i2 + '] = False，path 退回 ' +
        fmt(path) + '，状态还原成递归前的样子。' +
        (isLeaf
          ? '叶子 ' + fmt(BY_KEY[childKey].path) + ' 的排列已经拷进 result，所以它留在树上标绿。'
          : '节点 ' + fmt(BY_KEY[childKey].path) + ' 的 for 循环走完，整棵子树探索完毕，颜色变淡 —— 这就是回溯。') +
        (nxt >= 0
          ? '回到 ' + fmt(parPath) + ' 继续 for，下一个能选的是 i = ' + nxt + '（数字 ' + NUMS[nxt] + '）。'
          : '这一层的 for 也走完，继续往上返回。'));
    }
  }

  backtrack();                                  // ← 最外层那一次调用

  shot('done', '',
    'backtrack() 层层返回、调用栈清空，result = ' +
    '[' + result.map(fmt).join(', ') + ']' + '，' + result.length + ' 个排列一个不落。' +
    '整棵递归树 ' + NODES.length + ' 个节点 = 1 个空路径 + 3 个一层 + 6 个二层 + 6 个叶子，' +
    '叶子与排列一一对应；每个排列都要切片拷一遍，所以时间是 O(n × n!)。');
}

buildSteps();

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / transform / textContent。
      本 archetype 的元素全是常驻的（连 6 个结果槽位都预先建好），
      每步只切 opacity 与 class，所以坐标永远不动。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);
var ghost = null;                 // 切片拷贝的「飞行副本」，子元素只建一次

/* 面板几何（全部一次算死） */
var PNL = { x: 10, y: 300, w: STAGE.w - 20, h: 120 };
var TITLE_Y = 317, NOTE_Y = 404, LEG_Y = 280;
var PATH_X = 24, PATH_Y = 326, CHIP_W = 46, CHIP_H = 32, CHIP_GAP = 6;
var HALO = { x: 18, y: 320, w: 162, h: 44 };
var USED_X = 278, USED_Y = 322, UBOX_W = 54, UBOX_H = 38, UBOX_GAP = 6;
var RES_X = 466, RES_Y = 324, RCH_W = 82, RCH_H = 25, RCH_GX = 7, RCH_GY = 7;
var CHK = 'M-4.6 0.2 L-1.6 3.4 L4.8 -3.6';
var CROSS = 'M-3.6 -3.6 L3.6 3.6 M3.6 -3.6 L-3.6 3.6';

function ux(k) { return USED_X + k * (UBOX_W + UBOX_GAP); }
function resPos(j) {
  return { x: RES_X + (j % 3) * (RCH_W + RCH_GX), y: RES_Y + Math.floor(j / 3) * (RCH_H + RCH_GY) };
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

/* 清掉上一步残留的动态元素（本 archetype 的元素都是常驻的，这里是保险丝） */
function reconcile(used) {
  for (var k in cache) {
    if (!used[k]) { cache[k].remove(); delete cache[k]; }
  }
}

/* 节点状态四态：'active' 此刻正站在上面 / 'done' 叶子已收进 result /
   'path'  在当前 path 上 / 'dim' 已经回溯出去了。
   🔴 全部由 alive + activeKey + results 三个快照字段推出来，不另存状态 ——
      DFS 的不变式保证「已长出但不在当前 path 上」的节点，其子树必然已走完，
      所以「不在路上」就等价于「探索完毕、该变淡」。 */
function nodeState(key, ak, got) {
  if (BY_KEY[key].lv === NUMS.length && got[key]) return 'done';
  if (key === ak) return 'active';
  if (!key || ak.indexOf(key + '-') === 0) return 'path';
  return 'dim';
}

/* 飞行副本：collect 那一步，一份 path[:] 从左侧 path 条飞到右侧 result 槽位，
   把「拷贝了一份、而不是把 path 本身挪过去」这件事画出来。 */
function ensureGhost() {
  if (ghost) return ghost;
  var g = document.createElementNS(NS, 'g');
  /* 飞得比 --dm-dur 慢一点：这一步是全片最关键的洞察，值回一次长镜头 */
  g.style.transition = 'transform 520ms var(--lc-ease), opacity 300ms var(--lc-ease)';
  var r = document.createElementNS(NS, 'rect');
  attr(r, { x: 0, y: 0, width: RCH_W, height: RCH_H, rx: 7, class: 'badge-bg' });
  var t = document.createElementNS(NS, 'text');
  attr(t, { x: RCH_W / 2, y: 16, class: 'badge-tx' });
  g.appendChild(r);
  g.appendChild(t);
  cache.ghost = g;                // 交给 reconcile 统一管
  svg.appendChild(g);
  ghost = g;
  return g;
}

function paint(s) {
  var used = Object.create(null);
  var i, k, e, g, nd, ed;

  /* alive / 已收集排列 都转成查找表 */
  var aliveSet = Object.create(null);
  for (i = 0; i < s.alive.length; i++) aliveSet[s.alive[i]] = 1;
  var got = Object.create(null);
  for (i = 0; i < s.results.length; i++) got[s.results[i].join('-')] = 1;

  var ak = s.activeKey;
  var isCollect = s.phase === 'collect';

  /* ---------- 顶栏：标题 / nums / len(path) 读数 ---------- */
  e = ensure('title', 'text'); used.title = 1;
  attr(e, { x: 12, y: 20, class: 'panel-title' });
  txt(e, '递归树 · 节点 = path 的一个前缀，边 = 这一层选了哪个数');

  e = ensure('nums-bg', 'rect'); used['nums-bg'] = 1;
  attr(e, { x: 452, y: 8, width: 136, height: 22, rx: 11, class: 'chip-bg' });
  e = ensure('nums-tx', 'text'); used['nums-tx'] = 1;
  attr(e, { x: 520, y: 23, class: 'chip-tx' });
  txt(e, 'nums = ' + fmt(NUMS));

  /* 终止条件读数：每步都在，collect 那一步换成绿色徽章 */
  e = ensure('st-bg', 'rect'); used['st-bg'] = 1;
  attr(e, {
    x: 598, y: 8, width: 152, height: 22, rx: 11,
    class: isCollect ? 'badge-bg' : 'chip-bg'
  });
  e = ensure('st-tx', 'text'); used['st-tx'] = 1;
  attr(e, { x: 674, y: 23, class: isCollect ? 'badge-tx' : 'chip-tx' });
  txt(e, 'len(path) = ' + s.path.length + ' / ' + NUMS.length);

  /* ---------- 底部面板 ---------- */
  e = ensure('pnl', 'rect'); used.pnl = 1;
  attr(e, { x: PNL.x, y: PNL.y, width: PNL.w, height: PNL.h, rx: 12, class: 'panel-bg' });

  e = ensure('rule1', 'line'); used.rule1 = 1;
  attr(e, { x1: 264, y1: 312, x2: 264, y2: 390, class: 'bt-rule' });
  e = ensure('rule2', 'line'); used.rule2 = 1;
  attr(e, { x1: 460, y1: 312, x2: 460, y2: 390, class: 'bt-rule' });

  /* 常驻结论行：切片拷贝这件事不只在 collect 那一步讲 */
  e = ensure('note', 'text'); used.note = 1;
  attr(e, { x: 24, y: NOTE_Y, class: 'lbl-dim' + (isCollect ? ' bt-note-on' : '') });
  txt(e, 'result.append(path[:]) —— 切片拷贝一份再存：path 随后会被 pop 改掉，存引用的话最后会全变成空列表');

  /* ---------- 图例 ---------- */
  var LEG = [
    { x: 12, cls: 'node node-active', tx: '当前节点' },
    { x: 84, cls: 'node bt-onpath', tx: '在 path 上' },
    { x: 176, cls: 'node node-done', tx: '已收集叶子' },
    { x: 260, cls: 'node node-dim', tx: '已回溯子树' }
  ];
  for (i = 0; i < LEG.length; i++) {
    e = ensure('lg' + i + '-sw', 'rect'); used['lg' + i + '-sw'] = 1;
    attr(e, { x: LEG[i].x, y: LEG_Y, width: 10, height: 10, rx: 3, class: LEG[i].cls });
    e = ensure('lg' + i + '-tx', 'text'); used['lg' + i + '-tx'] = 1;
    attr(e, { x: LEG[i].x + 15, y: LEG_Y + 9, class: 'lbl-dim' });
    txt(e, LEG[i].tx);
  }

  /* ---------- 边（先画，压在节点下面） ---------- */
  for (i = 0; i < EDGES.length; i++) {
    ed = EDGES[i];
    var ek = 'e-' + ed.key;
    var live = !!aliveSet[ed.key];
    var st = nodeState(ed.key, ak, got);
    var dim = live && st === 'dim';

    e = ensure(ek, 'path'); used[ek] = 1;
    attr(e, {
      d: ed.d,
      class: 'edge' + (st === 'done' ? ' edge-done' : st === 'active' ? ' edge-active' : '')
    });
    e.style.opacity = live ? (dim ? '0.3' : '1') : '0';

    var lk = 'el-' + ed.key;
    e = ensure(lk, 'text'); used[lk] = 1;
    attr(e, {
      x: ed.lx, y: ed.ly,
      class: 'bt-edge-lbl' + (st === 'done' ? ' bt-edge-lbl-done' : st === 'active' ? ' bt-edge-lbl-on' : '')
    });
    txt(e, ed.lbl);
    e.style.opacity = live ? (dim ? '0.3' : '1') : '0';
  }

  /* ---------- 节点 ---------- */
  for (i = 0; i < NODES.length; i++) {
    nd = NODES[i];
    var nk = 'n-' + nd.key;
    var grown = !!aliveSet[nd.key];
    var ns = nodeState(nd.key, ak, got);

    g = cache[nk];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
        ' opacity var(--dm-dur) var(--lc-ease)';
      var circ = document.createElementNS(NS, 'circle');
      attr(circ, { cx: 0, cy: 0, r: R });
      circ.style.transition = 'opacity var(--dm-dur) var(--lc-ease),' +
        ' fill var(--dm-dur) var(--lc-ease), stroke var(--dm-dur) var(--lc-ease)';
      var val = document.createElementNS(NS, 'text');
      attr(val, { x: 0, y: 5 });
      val.style.transition = 'opacity var(--dm-dur) var(--lc-ease)';
      g.appendChild(circ);
      g.appendChild(val);
      cache[nk] = g;
      svg.appendChild(g);
    }
    used[nk] = 1;

    /* 位置写死在 transform 里；没长出来的节点只是缩到 0.6 倍 + 透明，
       长出来时原地放大淡入 —— 绝不会挪动别的节点。 */
    g.style.transform = 'translate(' + nd.x.toFixed(1) + 'px,' + nd.y + 'px) scale(' + (grown ? 1 : 0.6) + ')';
    g.style.opacity = grown ? '1' : '0';
    attr(g.childNodes[0], {
      class: 'node' + (ns === 'active' ? ' node-active'
        : ns === 'done' ? ' node-done'
        : ns === 'dim' ? ' node-dim' : ' bt-onpath')
    });
    attr(g.childNodes[1], { class: 'node-val' + (ns === 'dim' ? ' bt-val-dim' : '') });
    txt(g.childNodes[1], nd.lv ? String(nd.val) : '[]');
  }

  /* ---------- PATH 条 ---------- */
  e = ensure('p-title', 'text'); used['p-title'] = 1;
  attr(e, { x: PATH_X, y: TITLE_Y, class: 'panel-title' });
  txt(e, 'PATH · 当前路径');

  for (k = 0; k < NUMS.length; k++) {
    var filled = k < s.path.length;
    var isNew = filled && s.phase === 'choose' && k === s.path.length - 1;
    var vacated = !filled && s.phase === 'unchoose' && k === s.path.length;
    var ck = 'pc-' + k;

    g = cache[ck];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.appendChild(document.createElementNS(NS, 'rect'));
      g.appendChild(document.createElementNS(NS, 'text'));
      cache[ck] = g;
      svg.appendChild(g);
    }
    used[ck] = 1;
    attr(g, {
      class: 'chip' + (isNew ? ' chip-new' : ''),
      transform: 'translate(' + (PATH_X + k * (CHIP_W + CHIP_GAP)) + ',' + PATH_Y + ')'
    });
    attr(g.childNodes[0], {
      width: CHIP_W, height: CHIP_H, rx: 8,
      class: filled ? 'chip-bg' : 'bt-slot' + (vacated ? ' bt-slot-hot' : '')
    });
    attr(g.childNodes[1], { x: CHIP_W / 2, y: 21, class: 'chip-tx bt-path-tx' });
    txt(g.childNodes[1], filled ? String(s.path[k]) : '');
  }

  /* 切片拷贝高亮框：collect 那一步把整段 path 圈起来，旁边标 path[:] */
  e = ensure('p-halo', 'rect'); used['p-halo'] = 1;
  attr(e, { x: HALO.x, y: HALO.y, width: HALO.w, height: HALO.h, rx: 10, class: 'bt-copy-halo' });
  e.style.opacity = isCollect ? '1' : '0';
  e = ensure('p-halo-tx', 'text'); used['p-halo-tx'] = 1;
  attr(e, { x: 188, y: 345, class: 'bt-copy-tag' });
  txt(e, 'path[:]');
  e.style.opacity = isCollect ? '1' : '0';

  /* ---------- USED 条 ---------- */
  e = ensure('u-title', 'text'); used['u-title'] = 1;
  attr(e, { x: USED_X, y: TITLE_Y, class: 'panel-title' });
  txt(e, 'USED · 已占用');

  for (k = 0; k < NUMS.length; k++) {
    var on = !!s.used[k];
    var x = ux(k);

    e = ensure('ub' + k, 'rect'); used['ub' + k] = 1;
    attr(e, { x: x, y: USED_Y, width: UBOX_W, height: UBOX_H, rx: 8, class: 'bt-used' + (on ? ' bt-used-on' : '') });

    e = ensure('uv' + k, 'text'); used['uv' + k] = 1;
    attr(e, { x: x + 19, y: USED_Y + 19, class: 'bt-used-val' + (on ? ' bt-used-val-on' : '') });
    txt(e, String(NUMS[k]));

    e = ensure('um' + k, 'path'); used['um' + k] = 1;
    attr(e, {
      class: 'bt-mark' + (on ? ' bt-mark-on' : ''),
      d: on ? CHK : CROSS,
      transform: 'translate(' + (x + 38) + ',' + (USED_Y + 14) + ')'
    });

    e = ensure('ui' + k, 'text'); used['ui' + k] = 1;
    attr(e, { x: x + UBOX_W / 2, y: USED_Y + 32, class: 'bt-used-idx' + (on ? ' bt-used-idx-on' : '') });
    txt(e, 'used[' + k + ']');
  }

  /* ---------- RESULT 条：6 个槽位从第一步就画满，收一个亮一个 ---------- */
  e = ensure('r-title', 'text'); used['r-title'] = 1;
  attr(e, { x: RES_X, y: TITLE_Y, class: 'panel-title' });
  txt(e, 'RESULT · 已收集 ' + s.results.length + ' / ' + TOTAL);

  for (k = 0; k < TOTAL; k++) {
    var pos = resPos(k);
    var has = k < s.results.length;
    var newest = has && isCollect && k === s.results.length - 1;
    var rk = 'r-' + k;

    g = cache[rk];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.appendChild(document.createElementNS(NS, 'rect'));
      g.appendChild(document.createElementNS(NS, 'text'));
      cache[rk] = g;
      svg.appendChild(g);
    }
    used[rk] = 1;
    attr(g, {
      class: 'chip' + (newest ? ' chip-new' : ''),
      transform: 'translate(' + pos.x + ',' + pos.y + ')'
    });
    attr(g.childNodes[0], {
      width: RCH_W, height: RCH_H, rx: 7,
      class: has ? 'badge-bg' : 'bt-slot'
    });
    attr(g.childNodes[1], { x: RCH_W / 2, y: 16, class: has ? 'badge-tx' : 'chip-tx' });
    txt(g.childNodes[1], has ? fmt(s.results[k]) : '');
  }

  /* ---------- 飞行副本（永远在最上层） ---------- */
  g = ensureGhost(); used.ghost = 1;
  if (isCollect && s.results.length) {
    var tp = resPos(s.results.length - 1);
    txt(g.childNodes[1], fmt(s.results[s.results.length - 1]));
    g.style.transform = 'translate(' + tp.x + 'px,' + tp.y + 'px)';
    g.style.opacity = '1';
  } else {
    /* 停在 path 条上待命：下一步若是 collect，就从这里飞过去 */
    g.style.transform = 'translate(45px,329px)';
    g.style.opacity = '0';
  }

  reconcile(used);
}

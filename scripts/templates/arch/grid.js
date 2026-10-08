/* ============================================================
   archetype: grid
   参考实现 = 200. 岛屿数量（LeetCode 示例 2：4×5 网格，3 座岛 → 3）

   这是「二维网格 + 滑动扫描游标 + DFS 调用栈」家族的样板；岛屿最大面积 /
   被围绕的区域 / 腐烂的橘子 / 单词搜索 / 图像渲染 等题都从它改起。

   ⚠️ 用法：脚手架把本文件内联进 docs/public/demos/<slug>/index.html 之后，
   直接改**产物文件**里的 GRID / buildSteps() / paint()。
   不要改本模板 —— 它是样板，不是运行时依赖。
   ============================================================ */

/* 🔴 保真三连，改产物时最容易写错的就是这三条：
   1. grid 里存的是**字符** '1' / '0'，不是整数，所以判断写 grid[i][j] != '1'；
   2. 递归顺序是 下 → 上 → 右 → 左（dfs(i+1,j) / dfs(i-1,j) / dfs(i,j+1) / dfs(i,j-1)），
      不是习惯上的上下左右，动画的探索次序必须一模一样；
   3. visited 是**原地**改 grid[i][j] = '0'，改完就和原生水无法区分，
      所以必须另存一份 sunk 记录，渲染层才画得出「已沉没的陆地」这第三态。 */
var GRID = ['11000', '11000', '00100', '00011'];

var STAGE = { w: 700, h: 346, minW: 580 };

var steps = [];

function record(patch, caption) {
  patch.caption = caption;
  steps.push(patch);
}

/* dfs 的四个方向。数组顺序 = 题解里的调用顺序，不要重排。 */
var DIRS = [
  { d: '↓', expr: 'dfs(i+1,j)', di: 1, dj: 0 },
  { d: '↑', expr: 'dfs(i-1,j)', di: -1, dj: 0 },
  { d: '→', expr: 'dfs(i,j+1)', di: 0, dj: 1 },
  { d: '←', expr: 'dfs(i,j-1)', di: 0, dj: -1 }
];

var TOTAL_LAND = 0;
for (var gr = 0; gr < GRID.length; gr++) {
  for (var gc = 0; gc < GRID[0].length; gc++) if (GRID[gr][gc] === '1') TOTAL_LAND++;
}

/* ---------- 录制：真跑一遍算法，每步存一份纯数据快照 ----------
   🔴 grid 是二维的，只 slice() 外层等于没拷：所有快照会共享同一批行数组，
      动画就变成「每一步都显示最终态」。stack 里的帧对象同理，也要逐个新建。 */
function buildSteps() {
  var grid = [];
  for (var r = 0; r < GRID.length; r++) grid.push(GRID[r].split(''));
  var m = grid.length, n = grid[0].length;
  var count = 0;
  var sunk = Object.create(null);   // "i,j" -> 1，纯粹给渲染用，算法本身不需要
  var stack = [];                   // dfs 调用栈，栈顶在数组末尾
  var scanI = 0, scanJ = 0;         // 外层循环停在哪里（DFS 期间它是不动的）

  function copyGrid() {
    return grid.map(function (row) { return row.slice(); });
  }
  function copySunk() {
    var c = {};
    for (var k in sunk) c[k] = sunk[k];
    return c;
  }
  function copyStack() {
    return stack.map(function (f) { return { i: f.i, j: f.j }; });
  }
  function snap(phase, curI, curJ, probe) {
    return {
      phase: phase, scanI: scanI, scanJ: scanJ, curI: curI, curJ: curJ,
      grid: copyGrid(), sunk: copySunk(), count: count,
      stack: copyStack(), probe: probe
    };
  }

  /* 旁白：扫描格有三种情况，说清楚「为什么这格不计数」才是重点 */
  function scanCaption(i, j) {
    var at = '(' + i + ',' + j + ')';
    if (grid[i][j] === '1') {
      return '扫描到 ' + at + '：外层循环检查 grid[' + i + '][' + j + "] == '1' 是否成立。";
    }
    if (sunk[i + ',' + j]) {
      return '扫描到 ' + at + '：grid[' + i + '][' + j + "] 已经是 '0'。它原本是陆地，" +
        '但被之前那次 DFS 就地沉没了，所以这里不会重复计数 —— ' +
        '这正是「原地改 grid 当 visited 标记」的效果：不用额外的 visited 数组，也不会漏判重判。';
    }
    return '扫描到 ' + at + '：grid[' + i + '][' + j + "] == '0'，本来就是水，" +
      '不构成新岛屿，游标按行优先继续右移。';
  }

  function sinkCaption(i, j, goList, racedList, plainRet, depth, parent) {
    var head = 'dfs(' + i + ',' + j + ')：越界检查通过且 grid[' + i + '][' + j +
      "] == '1'，先就地改成 '0' 当 visited 标记，再按 下 → 上 → 右 → 左 递归" +
      '（此时栈深 ' + depth + '）。';
    var tail = '';
    if (goList.length) tail += goList.join('、') + ' 是陆地，压栈继续深入。';
    if (racedList.length) {
      tail += racedList.join('、') + ' 此刻明明还是陆地，可排在它前面的分支已经抢先把它沉没了，' +
        '于是进函数就 return —— visited 标记就是这样保证一块陆地绝不会被数两次。';
    }
    if (plainRet > 0) tail += '其余 ' + plainRet + ' 个方向越界、是水或已被沉没，同样立刻 return。';
    if (!goList.length) {
      tail += (depth === 1)
        ? '四个邻居没有一个能继续递归，这一帧出栈后整次 DFS 就结束了 —— 这座岛只有它自己一个格子。'
        : '四个邻居没有一个能继续递归，这一帧出栈，控制权交回上一层 dfs(' +
          parent.i + ',' + parent.j + ')，由它接着试自己剩下的方向。';
    }
    return head + tail;
  }

  function dfs(i, j) {
    /* 🔴 短路守卫与题解逐字一致：先四个越界，再判 grid[i][j] != '1'。
          返回值不参与算法，只用来喂右侧的探针面板。 */
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') {
      if (i < 0 || i >= m || j < 0 || j >= n) return 'oob';
      return sunk[i + ',' + j] ? 'sunk' : 'water';
    }

    stack.push({ i: i, j: j });
    var depth = stack.length;
    grid[i][j] = '0';         // 标记已访问
    sunk[i + ',' + j] = 1;    // 另存一份，否则渲染时分不清原生水和沉没的陆地

    /* 记下四个邻居**此刻**的取值：等真的轮到某个方向时，它可能已经被更早的
       分支沉掉了，事后拿这个和返回值一比，就能指出「本来能递归却被抢先」。 */
    var wasLand = [];
    for (var k = 0; k < DIRS.length; k++) {
      var wi = i + DIRS[k].di, wj = j + DIRS[k].dj;
      wasLand.push(wi >= 0 && wi < m && wj >= 0 && wj < n && grid[wi][wj] === '1');
    }

    /* 🔴 这一步必须在递归**之前**入列，否则父帧会排到它所有子帧后面。
          但探针结局只有等四次调用真跑完才知道，所以先录一份 probe 为空的快照
          （grid / sunk / stack 都已经拷贝定格），事后回填 probe 和 caption。 */
    var patch = snap('sink', i, j, null);
    record(patch, '');

    /* 递归顺序 = 题解里的书写顺序：下、上、右、左。四条独立语句，不合并、不换序。 */
    var kinds = [];
    kinds.push(dfs(i + 1, j));
    kinds.push(dfs(i - 1, j));
    kinds.push(dfs(i, j + 1));
    kinds.push(dfs(i, j - 1));

    var probe = [], goList = [], racedList = [], plainRet = 0;
    for (k = 0; k < DIRS.length; k++) {
      var ni = i + DIRS[k].di, nj = j + DIRS[k].dj;
      var kind = kinds[k], raced = (kind === 'sunk' && wasLand[k]), note;
      if (kind === 'recurse') {
        note = '陆地，压栈递归';
        goList.push(DIRS[k].d + ' dfs(' + ni + ',' + nj + ')');
      } else if (kind === 'oob') {
        note = '越界，return'; plainRet++;
      } else if (raced) {
        note = '本是陆地，已被抢先沉没';
        racedList.push(DIRS[k].d + ' dfs(' + ni + ',' + nj + ')');
      } else if (kind === 'sunk') {
        note = '已沉没，return'; plainRet++;
      } else {
        note = "是水 '0'，return"; plainRet++;
      }
      probe.push({ d: DIRS[k].d, expr: DIRS[k].expr, i: ni, j: nj, kind: kind, raced: raced, note: note });
    }

    patch.probe = probe;
    patch.caption = sinkCaption(i, j, goList, racedList, plainRet, depth, stack[depth - 2]);

    stack.pop();
    return 'recurse';
  }

  for (var i = 0; i < m; i++) {
    for (var j = 0; j < n; j++) {
      scanI = i; scanJ = j;

      record(snap('scan', -1, -1, null),
        (i === 0 && j === 0)
          ? 'grid 是 ' + m + '×' + n + " 的字符矩阵，格子里存的是字符 '1'（陆地）和 '0'（水），" +
            '不是整数，所以判断必须写成 grid[i][j] == \'1\'。外层 i、内层 j 按行优先扫描，' +
            '游标从 (0,0) 出发，count 从 0 开始。'
          : scanCaption(i, j));

      if (grid[i][j] === '1') {
        record(snap('found', -1, -1, null),
          'grid[' + i + '][' + j + "] == '1' 成立，这是一座还没被数过的新岛屿 —— " +
          '因为凡是数过的岛都已经被 DFS 抹成 \'0\' 了，所以扫到 \'1\' 就一定是新岛。');

        count += 1;
        record(snap('count', -1, -1, null),
          'count += 1 → count = ' + count + '。必须先计数再 DFS：接下来 dfs(' + i + ',' + j + ')' +
          " 会把与它相连的整片陆地全部就地改成 '0'，抹完之后就再也认不出这里曾经是一座岛；" +
          '也正因为抹平了，外层循环后面再扫到同一座岛的其它格子时看到的都是 \'0\'，不会重复计数。');

        dfs(i, j);
      }
    }
  }

  record(snap('done', -1, -1, null),
    '双重循环扫完 ' + m + ' × ' + n + ' = ' + (m * n) + ' 个格子，返回 count = ' + count +
    '。递归虽然看起来吓人，但每个格子最多被沉没一次、最多被扫描一次，' +
    '所以总时间仍是 O(m×n)，额外空间只有递归栈的 O(m×n)。');
}

buildSteps();

/* ---------- 渲染 ----------
   🔴 绝不每步 innerHTML 重建 —— 那会杀掉所有 CSS transition，动画就没了。
      用 keyed 元素缓存：首帧创建，之后只改 class / transform / textContent。
      扫描游标和 DFS 光环一律走 style.transform 而非重设 x 属性，transition 才会滑动。 */

var NS = 'http://www.w3.org/2000/svg';
var cache = Object.create(null);

var ROWS = GRID.length, COLS = GRID[0].length;
var CELL = 44, GAP = 6;
var GX = 78, GY = 54;                 // 网格左上角
var HEAD_Y = 22;                      // 左上角说明文字基线
var COL_LBL_Y = 44, ROW_LBL_X = 58;   // 列号基线 / 行号中线
var LEG_R1 = 266, LEG_R2 = 288;       // 图例两行

var PX = 348, PW = 336;                                   // 右侧面板
var CNT_Y = 16, CNT_H = 70;                               // 计数面板
var STK_Y = 96, STK_H = 132;                              // 调用栈面板
var PRB_Y = 238, PRB_H = 92;                              // 四方向探针面板
var CHIP_X = PX + 14, CHIP_Y0 = 120, CHIP_W = 62, CHIP_H = 22, CHIP_PITCH = 26;

function cellX(j) { return GX + j * (CELL + GAP); }
function cellY(i) { return GY + i * (CELL + GAP); }

/* 图例：五态分两行，第三项「已沉没」是本题的题眼。
   x 是量过字宽后写死的 —— DOM 桩里没有 getComputedTextLength，
   动态排版反而没法在 check-demo 里验证。 */
var LEGEND = [
  { x: 40, y: LEG_R1, cls: 'cell g-water', tx: "'0' 水" },
  { x: 114, y: LEG_R1, cls: 'cell g-land', tx: "'1' 陆地" },
  { x: 188, y: LEG_R1, cls: 'cell g-sunk', tx: "'0' 已沉没" },
  { x: 40, y: LEG_R2, cls: 'g-scan-ring', tx: '扫描中' },
  { x: 114, y: LEG_R2, cls: 'cell g-cur', tx: 'DFS 当前' }
];

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

/* 清掉上一步残留的动态元素（本题只有调用栈 chip 会增删） */
function reconcile(used) {
  for (var k in cache) {
    if (!used[k]) { cache[k].remove(); delete cache[k]; }
  }
}

function paint(s) {
  var used = Object.create(null);
  var i, j, k, e;

  /* ---- 左上说明 + 坐标轴刻度 ---- */
  e = ensure('head', 'text'); used.head = 1;
  attr(e, { x: 40, y: HEAD_Y, class: 'panel-title' });
  txt(e, "GRID " + ROWS + "×" + COLS + " · 字符 '1' 陆地 / '0' 水");

  e = ensure('axis', 'text'); used.axis = 1;
  attr(e, { x: ROW_LBL_X, y: COL_LBL_Y, class: 'cell-idx' });
  txt(e, '(i,j)');

  for (j = 0; j < COLS; j++) {
    e = ensure('cl' + j, 'text'); used['cl' + j] = 1;
    attr(e, { x: cellX(j) + CELL / 2, y: COL_LBL_Y, class: 'cell-idx' });
    txt(e, String(j));
  }
  for (i = 0; i < ROWS; i++) {
    e = ensure('rl' + i, 'text'); used['rl' + i] = 1;
    attr(e, { x: ROW_LBL_X, y: cellY(i) + CELL / 2 + 4, class: 'cell-idx' });
    txt(e, String(i));
  }

  /* ---- 网格本体 ----
     三态由 s.sunk 而不是 grid 里的值决定：沉没过的陆地在数据上已经是 '0'，
     只有查 sunk 才知道它该画成绿色。 */
  for (i = 0; i < ROWS; i++) {
    for (j = 0; j < COLS; j++) {
      var key = i + ',' + j;
      var isSunk = !!s.sunk[key];
      var isCur = (s.curI === i && s.curJ === j);
      var cls, vcls = 'cell-val';
      if (isCur) { cls = 'cell g-sunk g-cur'; vcls += ' g-val-inv'; }
      else if (isSunk) { cls = 'cell g-sunk'; }
      else if (s.grid[i][j] === '1') { cls = 'cell g-land'; }
      else { cls = 'cell g-water'; vcls += ' g-val-dim'; }

      var x = cellX(j), y = cellY(i);

      e = ensure('c' + key, 'rect'); used['c' + key] = 1;
      attr(e, { x: x, y: y, width: CELL, height: CELL, rx: 9, class: cls });

      e = ensure('v' + key, 'text'); used['v' + key] = 1;
      attr(e, { x: x + CELL / 2, y: y + CELL / 2 + 5, class: vcls });
      txt(e, "'" + s.grid[i][j] + "'");
    }
  }

  /* ---- 图例 ---- */
  for (k = 0; k < LEGEND.length; k++) {
    var it = LEGEND[k];

    e = ensure('lg-s' + k, 'rect'); used['lg-s' + k] = 1;
    attr(e, { x: it.x, y: it.y, width: 12, height: 12, rx: 3, class: it.cls });

    e = ensure('lg-t' + k, 'text'); used['lg-t' + k] = 1;
    attr(e, { x: it.x + 17, y: it.y + 10, class: 'lbl-dim' });
    txt(e, it.tx);
  }

  /* ---- 右：计数面板 ---- */
  e = ensure('p-cnt', 'rect'); used['p-cnt'] = 1;
  attr(e, { x: PX, y: CNT_Y, width: PW, height: CNT_H, rx: 10, class: 'panel-bg' });

  e = ensure('p-cnt-t', 'text'); used['p-cnt-t'] = 1;
  attr(e, { x: PX + 14, y: CNT_Y + 18, class: 'panel-title' });
  txt(e, '岛屿数量 COUNT');

  e = ensure('cnt-num', 'text'); used['cnt-num'] = 1;
  attr(e, { x: PX + 16, y: CNT_Y + 60, class: 'g-count-num' });
  txt(e, String(s.count));

  var sunkN = 0;
  for (var sk in s.sunk) sunkN++;
  var leftN = 0;
  for (var ri = 0; ri < ROWS; ri++) {
    for (var rj = 0; rj < COLS; rj++) if (s.grid[ri][rj] === '1') leftN++;
  }

  e = ensure('cnt-n1', 'text'); used['cnt-n1'] = 1;
  attr(e, { x: PX + 74, y: CNT_Y + 40, class: 'lbl-dim' });
  txt(e, '已沉没陆地 ' + sunkN + ' / ' + TOTAL_LAND);

  e = ensure('cnt-n2', 'text'); used['cnt-n2'] = 1;
  attr(e, { x: PX + 74, y: CNT_Y + 58, class: 'lbl-dim' });
  txt(e, "剩余未访问 '1' = " + leftN);

  /* ---- 右：DFS 调用栈面板（栈顶画在最上面，压栈时下面的帧会滑下去） ---- */
  e = ensure('p-stk', 'rect'); used['p-stk'] = 1;
  attr(e, { x: PX, y: STK_Y, width: PW, height: STK_H, rx: 10, class: 'panel-bg' });

  e = ensure('p-stk-t', 'text'); used['p-stk-t'] = 1;
  attr(e, { x: PX + 14, y: STK_Y + 18, class: 'panel-title' });
  txt(e, 'DFS 调用栈（栈顶在上）');

  e = ensure('p-stk-d', 'text'); used['p-stk-d'] = 1;
  attr(e, { x: PX + PW - 14, y: STK_Y + 18, class: 'panel-title', 'text-anchor': 'end' });
  txt(e, '深度 ' + s.stack.length);

  var L = s.stack.length;
  if (!L) {
    e = ensure('stk-empty', 'text'); used['stk-empty'] = 1;
    attr(e, { x: PX + 14, y: CHIP_Y0 + 15, class: 'lbl-dim' });
    txt(e, '∅ 空：当前不在 dfs 里，外层循环正在扫描');
  }
  for (k = 0; k < L; k++) {
    var fr = s.stack[L - 1 - k];        // k = 0 → 栈顶
    var top = (k === 0);
    var ck = 'st' + fr.i + ',' + fr.j;

    var g = cache[ck];
    if (!g) {
      g = document.createElementNS(NS, 'g');
      g.style.transition = 'transform var(--dm-dur) var(--lc-ease),' +
        ' opacity var(--dm-dur) var(--lc-ease)';
      g.appendChild(document.createElementNS(NS, 'rect'));
      g.appendChild(document.createElementNS(NS, 'text'));
      g.appendChild(document.createElementNS(NS, 'text'));
      cache[ck] = g;
      svg.appendChild(g);
    }
    used[ck] = 1;

    attr(g, { class: 'chip' + (top ? ' chip-new' : '') });
    g.style.opacity = '1';
    g.style.transform = 'translate(' + CHIP_X + 'px,' + (CHIP_Y0 + k * CHIP_PITCH) + 'px)';
    attr(g.childNodes[0], { x: 0, y: 0, width: CHIP_W, height: CHIP_H, rx: 11, class: 'chip-bg' });
    attr(g.childNodes[1], { x: CHIP_W / 2, y: 15, class: 'chip-tx' });
    txt(g.childNodes[1], '(' + fr.i + ',' + fr.j + ')');
    attr(g.childNodes[2], { x: CHIP_W + 12, y: 15, class: 'lbl-dim' });
    txt(g.childNodes[2], top ? '栈顶，正在递归' : '等子调用返回');
  }

  /* ---- 右：四方向探针（把「立刻 return 的那些调用」交代清楚） ---- */
  e = ensure('p-prb', 'rect'); used['p-prb'] = 1;
  attr(e, { x: PX, y: PRB_Y, width: PW, height: PRB_H, rx: 10, class: 'panel-bg' });

  e = ensure('p-prb-t', 'text'); used['p-prb-t'] = 1;
  attr(e, { x: PX + 14, y: PRB_Y + 18, class: 'panel-title' });
  txt(e, 'dfs(i,j) 的四次递归 · 下 → 上 → 右 → 左');

  var rows;
  if (s.probe) {
    rows = s.probe.map(function (p) {
      return {
        l: p.d + ' ' + p.expr,
        r: p.note + ' (' + p.i + ',' + p.j + ')',
        tone: p.kind === 'recurse' ? 'go' : (p.raced ? 'race' : 'ret')
      };
    });
  } else {
    rows = [{
      l: '',
      r: (s.phase === 'found' || s.phase === 'count')
        ? '下一步调用 dfs(' + s.scanI + ',' + s.scanJ + ')'
        : '外层循环扫描中，还没进入 dfs',
      tone: 'ret'
    }];
  }
  for (k = 0; k < 4; k++) {
    var row = rows[k];
    var py = PRB_Y + 36 + k * 15;

    e = ensure('pd' + k, 'text'); used['pd' + k] = 1;
    attr(e, { x: PX + 16, y: py, class: 'g-probe-dir' });
    txt(e, row ? row.l : '');

    e = ensure('pn' + k, 'text'); used['pn' + k] = 1;
    attr(e, {
      x: PX + PW - 14, y: py,
      class: 'g-probe-' + (row ? row.tone : 'ret')
    });
    txt(e, row ? row.r : '');
  }

  /* ---- 两个滑动光标：放在最后创建，保证盖在格子之上 ---- */
  var sjc = Math.max(0, Math.min(s.scanJ, COLS - 1));
  var sic = Math.max(0, Math.min(s.scanI, ROWS - 1));
  var scanOn = s.phase !== 'done';
  /* DFS 停在扫描格上时把橙色游标收起来，免得和 accent 光环叠在一起糊成一团 */
  if (s.phase === 'sink' && s.curI === s.scanI && s.curJ === s.scanJ) scanOn = false;

  e = ensure('scan-ring', 'rect'); used['scan-ring'] = 1;
  attr(e, { x: 0, y: 0, width: CELL, height: CELL, rx: 9, class: 'g-scan-ring' });
  e.style.transform = 'translate(' + cellX(sjc) + 'px,' + cellY(sic) + 'px)';
  e.style.opacity = scanOn ? (s.phase === 'sink' ? '0.4' : '1') : '0';

  var hasCur = s.curI >= 0 && s.curJ >= 0;
  e = ensure('dfs-ring', 'rect'); used['dfs-ring'] = 1;
  /* 外扩 3：格子间距只有 6，扩多了光环会压到邻格上停着的扫描游标 */
  attr(e, { x: -3, y: -3, width: CELL + 6, height: CELL + 6, rx: 12, class: 'g-dfs-ring' });
  e.style.transform = 'translate(' + cellX(hasCur ? s.curJ : 0) + 'px,' +
    cellY(hasCur ? s.curI : 0) + 'px)';
  e.style.opacity = hasCur ? '1' : '0';

  reconcile(used);
}

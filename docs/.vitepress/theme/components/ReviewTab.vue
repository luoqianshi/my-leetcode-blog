<template>
  <div class="review-tab">
    <div class="review-map-section">
      <h2 class="review-section-title">学习路径</h2>
      <p class="review-section-desc">按难度渐进排列，建议按顺序学习，前置知识为后续基础</p>
      <div class="review-mermaid">
        <Mermaid id="review-learning-path" :graph="mermaidCode" />
      </div>
    </div>

    <div class="review-level-section">
      <h2 class="review-section-title">
        <span class="level-dot level-dot-beginner"></span>
        初级篇 — 入门必刷
      </h2>
      <div class="review-grid">
        <ReviewCard
          v-for="(mod, index) in beginnerModules"
          :key="mod.id"
          :id="mod.id"
          :title="mod.title"
          :level="mod.level"
          :count="mod.count"
          :description="mod.description"
          :link="mod.link"
          :problem-links="mod.problemLinks"
          :index="index"
        />
      </div>
    </div>

    <div class="review-level-section">
      <h2 class="review-section-title">
        <span class="level-dot level-dot-intermediate"></span>
        中级篇 — 进阶提升
      </h2>
      <div class="review-grid">
        <ReviewCard
          v-for="(mod, index) in intermediateModules"
          :key="mod.id"
          :id="mod.id"
          :title="mod.title"
          :level="mod.level"
          :count="mod.count"
          :description="mod.description"
          :link="mod.link"
          :problem-links="mod.problemLinks"
          :index="index"
        />
      </div>
    </div>

    <div class="review-level-section">
      <h2 class="review-section-title">
        <span class="level-dot level-dot-advanced"></span>
        高级篇 — 冲刺大厂
      </h2>
      <div class="review-grid">
        <ReviewCard
          v-for="(mod, index) in advancedModules"
          :key="mod.id"
          :id="mod.id"
          :title="mod.title"
          :level="mod.level"
          :count="mod.count"
          :description="mod.description"
          :link="mod.link"
          :problem-links="mod.problemLinks"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ReviewCard from './ReviewCard.vue'

interface ReviewModule {
  id: string
  title: string
  level: 'beginner' | 'intermediate' | 'advanced'
  count: number
  description: string
  link: string
  problemLinks: { number: number; link: string }[]
}

const modules: ReviewModule[] = [
  {
    id: '01', title: '位运算技巧', level: 'beginner', count: 3,
    description: '位运算直接对整数的二进制位进行操作，覆盖异或消同、摩尔投票、Brian Kernighan 逐位消除三个核心技巧。',
    link: '/review/01-bit-manipulation',
    problemLinks: [
      { number: 136, link: '/problems/136-single-number' },
      { number: 169, link: '/problems/169-majority-element' },
      { number: 461, link: '/problems/461-hamming-distance' },
    ]
  },
  {
    id: '02', title: '哈希表基础', level: 'beginner', count: 3,
    description: '哈希表通过哈希函数将键映射到存储位置，查找、插入、删除均为 O(1)，覆盖查找补数、特征分组、连续性判断三大场景。',
    link: '/review/02-hash-table',
    problemLinks: [
      { number: 1, link: '/problems/001-two-sum' },
      { number: 49, link: '/problems/049-group-anagrams' },
      { number: 128, link: '/problems/128-longest-consecutive-sequence' },
    ]
  },
  {
    id: '03', title: '双指针入门', level: 'beginner', count: 3,
    description: '双指针通过两个指针协同遍历，将 O(n²) 降为 O(n)，覆盖快慢指针、对向指针、排序后双指针三种模式。',
    link: '/review/03-two-pointers',
    problemLinks: [
      { number: 283, link: '/problems/283-move-zeroes' },
      { number: 11, link: '/problems/011-container-with-most-water' },
      { number: 15, link: '/problems/015-3sum' },
    ]
  },
  {
    id: '04', title: '栈基础', level: 'beginner', count: 2,
    description: '栈是后进先出数据结构，主要用于处理需要回溯的场景，覆盖括号匹配和辅助栈设计两个经典问题。',
    link: '/review/04-stack',
    problemLinks: [
      { number: 20, link: '/problems/020-valid-parentheses' },
      { number: 155, link: '/problems/155-min-stack' },
    ]
  },
  {
    id: '05', title: '链表入门', level: 'beginner', count: 4,
    description: '链表是面试高频数据结构，覆盖相交检测、反转、合并、环检测四个基础操作，掌握指针操控的核心技巧。',
    link: '/review/05-linked-list-basics',
    problemLinks: [
      { number: 160, link: '/problems/160-intersection-of-two-linked-lists' },
      { number: 206, link: '/problems/206-reverse-linked-list' },
      { number: 21, link: '/problems/021-merge-two-sorted-lists' },
      { number: 141, link: '/problems/141-linked-list-cycle' },
    ]
  },
  {
    id: '06', title: '二叉树入门', level: 'beginner', count: 4,
    description: '二叉树是递归思想的最佳训练场，覆盖翻转、深度计算、中序遍历、层序遍历四个入门问题。',
    link: '/review/06-binary-tree-basics',
    problemLinks: [
      { number: 226, link: '/problems/226-invert-binary-tree' },
      { number: 104, link: '/problems/104-maximum-depth-of-binary-tree' },
      { number: 94, link: '/problems/094-binary-tree-inorder-traversal' },
      { number: 102, link: '/problems/102-binary-tree-level-order-traversal' },
    ]
  },
  {
    id: '07', title: '滑动窗口', level: 'intermediate', count: 3,
    description: '用左右两个指针维护窗口，右指针扩张、左指针收缩，在 O(n) 时间内解决子串/子数组问题。',
    link: '/review/07-sliding-window',
    problemLinks: [
      { number: 3, link: '/problems/003-longest-substring-without-repeating-characters' },
      { number: 438, link: '/problems/438-find-all-anagrams-in-a-string' },
      { number: 76, link: '/problems/076-minimum-window-substring' },
    ]
  },
  {
    id: '08', title: '数组进阶技巧', level: 'intermediate', count: 4,
    description: '前缀和、分治、原地操作——数组问题的三大杀手锏，掌握 Kadane、排序合并、前缀积、三次翻转等核心技巧。',
    link: '/review/08-array-advanced',
    problemLinks: [
      { number: 53, link: '/problems/053-maximum-subarray' },
      { number: 56, link: '/problems/056-merge-intervals' },
      { number: 238, link: '/problems/238-product-of-array-except-self' },
      { number: 189, link: '/problems/189-rotate-array' },
    ]
  },
  {
    id: '09', title: '二分查找', level: 'intermediate', count: 4,
    description: '二分查找不只是有序数组查找，更是一种将搜索空间减半的思维模式，覆盖标准二分、边界查找、旋转数组、矩阵搜索。',
    link: '/review/09-binary-search',
    problemLinks: [
      { number: 35, link: '/problems/035-search-insert-position' },
      { number: 34, link: '/problems/034-find-first-and-last-position-of-element-in-sorted-array' },
      { number: 33, link: '/problems/033-search-in-rotated-sorted-array' },
      { number: 74, link: '/problems/074-search-a-2d-matrix' },
    ]
  },
  {
    id: '10', title: '字符串技巧', level: 'intermediate', count: 2,
    description: '前缀和与递归解码——字符串问题往往是数组问题的伪装，加上编码技巧。',
    link: '/review/10-string-techniques',
    problemLinks: [
      { number: 560, link: '/problems/560-subarray-sum-equals-k' },
      { number: 394, link: '/problems/394-decode-string' },
    ]
  },
  {
    id: '11', title: '贪心算法', level: 'intermediate', count: 4,
    description: '贪心每步选择局部最优，覆盖股票买卖、跳跃游戏、区间划分等经典场景，核心是证明局部最优能推导全局最优。',
    link: '/review/11-greedy',
    problemLinks: [
      { number: 121, link: '/problems/121-best-time-to-buy-and-sell-stock' },
      { number: 55, link: '/problems/055-jump-game' },
      { number: 45, link: '/problems/045-jump-game-ii' },
      { number: 763, link: '/problems/763-partition-labels' },
    ]
  },
  {
    id: '12', title: '回溯算法', level: 'intermediate', count: 5,
    description: '穷举所有可能，通过选择→递归→撤销三步走，在解空间树上搜索，配合剪枝可大幅优化。',
    link: '/review/12-backtracking',
    problemLinks: [
      { number: 46, link: '/problems/046-permutations' },
      { number: 78, link: '/problems/078-subsets' },
      { number: 39, link: '/problems/039-combination-sum' },
      { number: 22, link: '/problems/022-generate-parentheses' },
      { number: 79, link: '/problems/079-word-search' },
    ]
  },
  {
    id: '13', title: '堆', level: 'intermediate', count: 2,
    description: '堆是特殊的完全二叉树，Python heapq 提供高效最小堆操作，核心应用是 Top-K 问题和动态极值。',
    link: '/review/13-heap',
    problemLinks: [
      { number: 215, link: '/problems/215-kth-largest-element-in-an-array' },
      { number: 347, link: '/problems/347-top-k-frequent-elements' },
    ]
  },
  {
    id: '14', title: '一维动态规划', level: 'intermediate', count: 5,
    description: '将大问题分解为重叠子问题，用数组记录子问题的解，覆盖线性DP、完全背包、LIS等核心模式。',
    link: '/review/14-1d-dp',
    problemLinks: [
      { number: 70, link: '/problems/070-climbing-stairs' },
      { number: 198, link: '/problems/198-house-robber' },
      { number: 279, link: '/problems/279-perfect-squares' },
      { number: 322, link: '/problems/322-coin-change' },
      { number: 300, link: '/problems/300-longest-increasing-subsequence' },
    ]
  },
  {
    id: '15', title: '链表进阶', level: 'intermediate', count: 6,
    description: '链表的进阶操作，覆盖入环点检测、归并排序、K路合并、LRU缓存、大数加法等综合应用。',
    link: '/review/15-linked-list-advanced',
    problemLinks: [
      { number: 142, link: '/problems/142-linked-list-cycle-ii' },
      { number: 148, link: '/problems/148-sort-list' },
      { number: 23, link: '/problems/023-merge-k-sorted-lists' },
      { number: 146, link: '/problems/146-lru-cache' },
      { number: 2, link: '/problems/002-add-two-numbers' },
    ]
  },
  {
    id: '16', title: '图论', level: 'advanced', count: 4,
    description: '将实际问题抽象为图模型，掌握 DFS、BFS、拓扑排序、字典树等基本算法。',
    link: '/review/16-graph',
    problemLinks: [
      { number: 200, link: '/problems/200-number-of-islands' },
      { number: 994, link: '/problems/994-rotting-oranges' },
      { number: 207, link: '/problems/207-course-schedule' },
      { number: 208, link: '/problems/208-implement-trie-prefix-tree' },
    ]
  },
  {
    id: '17', title: '多维动态规划', level: 'advanced', count: 4,
    description: '从一维扩展到二维，状态转移变为 dp[i][j]，覆盖路径计数、回文子串、LCS、编辑距离四大经典。',
    link: '/review/17-multidim-dp',
    problemLinks: [
      { number: 62, link: '/problems/062-unique-paths' },
      { number: 5, link: '/problems/005-longest-palindromic-substring' },
      { number: 1143, link: '/problems/1143-longest-common-subsequence' },
      { number: 72, link: '/problems/072-edit-distance' },
    ]
  },
  {
    id: '18', title: '二叉树进阶', level: 'advanced', count: 7,
    description: '二叉树的高阶操作，覆盖 BST 验证、中序第K小、右视图、Morris遍历、构造、前缀和路径、LCA 七大问题。',
    link: '/review/18-binary-tree-advanced',
    problemLinks: [
      { number: 98, link: '/problems/098-validate-binary-search-tree' },
      { number: 230, link: '/problems/230-kth-smallest-element-in-a-bst' },
      { number: 199, link: '/problems/199-binary-tree-right-side-view' },
      { number: 114, link: '/problems/114-flatten-binary-tree-to-linked-list' },
      { number: 105, link: '/problems/105-construct-binary-tree-from-preorder-and-inorder-traversal' },
      { number: 437, link: '/problems/437-path-sum-iii' },
      { number: 236, link: '/problems/236-lowest-common-ancestor-of-a-binary-tree' },
    ]
  },
  {
    id: '19', title: '动态规划高级', level: 'advanced', count: 4,
    description: 'DP 的进阶技巧，覆盖乘积最大子数组、0-1背包、字符串DP、栈+DP混合等综合应用。',
    link: '/review/19-dp-advanced',
    problemLinks: [
      { number: 152, link: '/problems/152-maximum-product-subarray' },
      { number: 416, link: '/problems/416-partition-equal-subset-sum' },
      { number: 139, link: '/problems/139-word-break' },
      { number: 32, link: '/problems/032-longest-valid-parentheses' },
    ]
  },
  {
    id: '20', title: '矩阵操作', level: 'advanced', count: 4,
    description: '二维空间上的算法应用，包括旋转、搜索、螺旋遍历等，考察对二维数组的精细操作能力。',
    link: '/review/20-matrix',
    problemLinks: [
      { number: 73, link: '/problems/073-set-matrix-zeroes' },
      { number: 54, link: '/problems/054-spiral-matrix' },
      { number: 48, link: '/problems/048-rotate-image' },
      { number: 240, link: '/problems/240-search-a-2d-matrix-ii' },
    ]
  },
]

const beginnerModules = computed(() => modules.filter(m => m.level === 'beginner'))
const intermediateModules = computed(() => modules.filter(m => m.level === 'intermediate'))
const advancedModules = computed(() => modules.filter(m => m.level === 'advanced'))

const mermaidCode = computed(() => `flowchart TB
  subgraph 初级篇["🟢 初级篇 — 入门必刷"]
    direction LR
    A01["01 位运算"] ~~~ A02["02 哈希表"]
    A02 ~~~ A03["03 双指针"]
    A03 ~~~ A04["04 栈"]
    A04 ~~~ A05["05 链表入门"]
    A05 ~~~ A06["06 二叉树入门"]
  end
  subgraph 中级篇["🟡 中级篇 — 进阶提升"]
    direction LR
    B07["07 滑动窗口"] ~~~ B08["08 数组进阶"]
    B08 ~~~ B09["09 二分查找"]
    B09 ~~~ B10["10 字符串"]
    B10 ~~~ B11["11 贪心"]
    B11 ~~~ B12["12 回溯"]
    B12 ~~~ B13["13 堆"]
    B13 ~~~ B14["14 一维DP"]
    B14 ~~~ B15["15 链表进阶"]
  end
  subgraph 高级篇["🔴 高级篇 — 冲刺大厂"]
    direction LR
    C16["16 图论"] ~~~ C17["17 多维DP"]
    C17 ~~~ C18["18 二叉树进阶"]
    C18 ~~~ C19["19 DP高级"]
    C19 ~~~ C20["20 矩阵"]
  end
  A06 -.-> B07
  B15 -.-> C16

  style A01 fill:#d1fae5,stroke:#10b981,color:#065f46
  style A02 fill:#d1fae5,stroke:#10b981,color:#065f46
  style A03 fill:#d1fae5,stroke:#10b981,color:#065f46
  style A04 fill:#d1fae5,stroke:#10b981,color:#065f46
  style A05 fill:#d1fae5,stroke:#10b981,color:#065f46
  style A06 fill:#d1fae5,stroke:#10b981,color:#065f46
  style B07 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B08 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B09 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B10 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B11 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B12 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B13 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B14 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style B15 fill:#fef3c7,stroke:#f59e0b,color:#92400e
  style C16 fill:#fee2e2,stroke:#ef4444,color:#991b1b
  style C17 fill:#fee2e2,stroke:#ef4444,color:#991b1b
  style C18 fill:#fee2e2,stroke:#ef4444,color:#991b1b
  style C19 fill:#fee2e2,stroke:#ef4444,color:#991b1b
  style C20 fill:#fee2e2,stroke:#ef4444,color:#991b1b`)
</script>

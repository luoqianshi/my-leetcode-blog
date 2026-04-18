<template>
  <div>
    <section class="hero-section">
      <h1 class="hero-title">LeetCode Hot 100</h1>
      <p class="hero-subtitle">Python 题解 · 系统刷题 · 面试必备</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ totalCount }}</span>
          <span class="stat-label">总题数</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number" style="color: var(--lc-green)">{{ easyCount }}</span>
          <span class="stat-label">简单</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number" style="color: var(--lc-orange)">{{ mediumCount }}</span>
          <span class="stat-label">中等</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number" style="color: var(--lc-red)">{{ hardCount }}</span>
          <span class="stat-label">困难</span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-bar-container">
          <div
            class="progress-bar-fill"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          已解决 {{ starredCount }} / {{ totalCount }} 题（{{ progressPercent }}%）
        </div>
      </div>
    </section>

    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'problems' }"
        @click="activeTab = 'problems'"
      >题目总览</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'review' }"
        @click="activeTab = 'review'"
      >知识点总览</button>
    </div>

    <div v-show="activeTab === 'problems'">
      <FilterBar
        :all-tags="allTags"
        @filter="onFilter"
      />

      <div class="problem-grid">
        <ProblemCard
          v-for="(problem, index) in filteredProblems"
          :key="problem.number"
          :number="problem.number"
          :title="problem.title"
          :difficulty="problem.difficulty"
          :tags="problem.tags"
          :summary="problem.summary"
          :link="problem.link"
          :starred="problem.starred"
          :index="index"
          @toggle-star="onToggleStar"
        />
      </div>

      <div v-if="filteredProblems.length === 0" style="text-align: center; padding: 60px 20px; color: var(--vp-c-text-3);">
        <p style="font-size: 48px; margin-bottom: 12px;">🔍</p>
        <p style="font-size: 16px;">没有找到匹配的题目</p>
      </div>
    </div>

    <div v-show="activeTab === 'review'">
      <ReviewTab />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FilterBar from './FilterBar.vue'
import ProblemCard from './ProblemCard.vue'
import ReviewTab from './ReviewTab.vue'

const activeTab = ref<'problems' | 'review'>('problems')

interface Problem {
  number: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  summary: string
  link: string
  starred: boolean
}

// All problems data extracted from the uploaded content
const problems = ref<Problem[]>([
  // ===== 位运算 =====
  { number: 136, title: '只出现一次的数字', difficulty: 'Easy', tags: ['位运算'], summary: '利用异或运算的自反性，将所有元素依次异或，出现两次的数会两两抵消为 0。', link: '/problems/136-single-number', starred: false },
  { number: 169, title: '多数元素', difficulty: 'Easy', tags: ['数组', 'Boyer-Moore 投票'], summary: 'Boyer-Moore 投票算法：维护候选者和计数器，不同则抵消，最终剩下的就是多数元素。', link: '/problems/169-majority-element', starred: false },
  { number: 461, title: '汉明距离', difficulty: 'Easy', tags: ['位运算'], summary: '先异或标记不同位，再用 Brian Kernighan 算法统计 1 的个数。', link: '/problems/461-hamming-distance', starred: false },

  // ===== 哈希表 =====
  { number: 1, title: '两数之和', difficulty: 'Easy', tags: ['哈希表', '数组'], summary: '用哈希表存储已遍历的数，一次遍历即可找到互补对。', link: '/problems/001-two-sum', starred: false },
  { number: 49, title: '字母异位词分组', difficulty: 'Medium', tags: ['哈希表', '字符串', '排序'], summary: '将字符串排序后作为哈希表的键，相同字母组合映射到同一个键。', link: '/problems/049-group-anagrams', starred: false },
  { number: 128, title: '最长连续序列', difficulty: 'Medium', tags: ['哈希表', '并查集'], summary: '利用哈希集合实现 O(1) 查找，只从序列起点开始向右扩展。', link: '/problems/128-longest-consecutive-sequence', starred: false },

  // ===== 双指针 =====
  { number: 283, title: '移动零', difficulty: 'Easy', tags: ['数组', '双指针'], summary: '快慢指针：快指针探索非零元素，慢指针标记放置位置。', link: '/problems/283-move-zeroes', starred: false },
  { number: 11, title: '盛最多水的容器', difficulty: 'Medium', tags: ['贪心', '双指针'], summary: '对向双指针，贪心策略：移动较短的那端，才有可能增大盛水量。', link: '/problems/011-container-with-most-water', starred: false },
  { number: 15, title: '三数之和', difficulty: 'Medium', tags: ['数组', '双指针', '排序'], summary: '排序 + 双指针：固定一个数后，在其后子数组中用双指针查找两数之和。', link: '/problems/015-3sum', starred: false },

  // ===== 栈 =====
  { number: 20, title: '有效的括号', difficulty: 'Easy', tags: ['栈', '字符串'], summary: '遇到左括号入栈，遇到右括号检查栈顶是否配对，遍历结束栈为空则合法。', link: '/problems/020-valid-parentheses', starred: false },
  { number: 155, title: '最小栈', difficulty: 'Medium', tags: ['栈', '设计'], summary: '辅助栈同步记录最小值，只在更小值出现时才压入辅助栈。', link: '/problems/155-min-stack', starred: false },

  // ===== 链表入门 =====
  { number: 160, title: '相交链表', difficulty: 'Easy', tags: ['链表', '双指针'], summary: '双指针消除长度差：走完一条链后切换到另一条，交点处相遇。', link: '/problems/160-intersection-of-two-linked-lists', starred: false },
  { number: 206, title: '反转链表', difficulty: 'Easy', tags: ['链表', '递归'], summary: '迭代法三指针：prev、curr、next，逐个反转指针方向。', link: '/problems/206-reverse-linked-list', starred: false },
  { number: 21, title: '合并两个有序链表', difficulty: 'Easy', tags: ['链表', '递归'], summary: '哑节点 + 尾指针，每次比较两链表头节点，将较小的接到尾部。', link: '/problems/021-merge-two-sorted-lists', starred: false },
  { number: 141, title: '环形链表', difficulty: 'Easy', tags: ['链表', '双指针'], summary: 'Floyd 快慢指针：快指针每次两步，慢指针每次一步，有环必相遇。', link: '/problems/141-linked-list-cycle', starred: false },

  // ===== 二叉树入门 =====
  { number: 226, title: '翻转二叉树', difficulty: 'Easy', tags: ['树', 'DFS', '分治'], summary: '递归交换每个节点的左右子树，分治思想的典型应用。', link: '/problems/226-invert-binary-tree', starred: false },
  { number: 104, title: '二叉树的最大深度', difficulty: 'Easy', tags: ['树', 'DFS', 'BFS'], summary: '递归：max(左子树深度, 右子树深度) + 1，空节点深度为 0。', link: '/problems/104-maximum-depth-of-binary-tree', starred: false },
  { number: 94, title: '二叉树的中序遍历', difficulty: 'Easy', tags: ['栈', '树', 'DFS'], summary: '迭代法：一路向左压栈，弹出栈顶访问，转向右子树。', link: '/problems/094-binary-tree-inorder-traversal', starred: false },
  { number: 102, title: '二叉树的层序遍历', difficulty: 'Medium', tags: ['树', 'BFS'], summary: 'BFS 队列逐层遍历，记录每层大小实现按层分组。', link: '/problems/102-binary-tree-level-order-traversal', starred: false },

  // ===== 滑动窗口 =====
  { number: 3, title: '无重复字符的最长子串', difficulty: 'Medium', tags: ['哈希表', '字符串', '滑动窗口'], summary: '跳跃式滑动窗口：右指针扩张，遇到重复时左指针直接跳到重复字符之后。', link: '/problems/003-longest-substring-without-repeating-characters', starred: false },
  { number: 438, title: '找到字符串中所有字母异位词', difficulty: 'Medium', tags: ['哈希表', '滑动窗口'], summary: '固定大小窗口滑动，用数组计数对比窗口与目标串的字符频率。', link: '/problems/438-find-all-anagrams-in-a-string', starred: false },
  { number: 76, title: '最小覆盖子串', difficulty: 'Hard', tags: ['哈希表', '滑动窗口'], summary: 'need/window 双字典 + valid 计数器，右扩左缩找最小满足条件的窗口。', link: '/problems/076-minimum-window-substring', starred: false },

  // ===== 数组进阶 =====
  { number: 53, title: '最大子数组和', difficulty: 'Medium', tags: ['数组', '动态规划'], summary: 'Kadane 算法：dp[i] = max(dp[i-1] + nums[i], nums[i])，负前缀不如重新开始。', link: '/problems/053-maximum-subarray', starred: false },
  { number: 56, title: '合并区间', difficulty: 'Medium', tags: ['数组', '排序'], summary: '按起点排序后线性扫描，重叠区间合并为取更大终点。', link: '/problems/056-merge-intervals', starred: false },
  { number: 238, title: '除自身以外数组的乘积', difficulty: 'Medium', tags: ['数组', '前缀积'], summary: '两次遍历：左到右记录左侧乘积，右到左乘上右侧乘积，空间 O(1)。', link: '/problems/238-product-of-array-except-self', starred: false },
  { number: 189, title: '轮转数组', difficulty: 'Medium', tags: ['数组'], summary: '三次翻转法：翻转全部 → 翻转前 k 个 → 翻转剩余部分。', link: '/problems/189-rotate-array', starred: false },

  // ===== 二分查找 =====
  { number: 35, title: '搜索插入位置', difficulty: 'Easy', tags: ['数组', '二分查找'], summary: '标准二分查找，左闭右开区间，最终 left 即为插入位置。', link: '/problems/035-search-insert-position', starred: false },
  { number: 34, title: '在排序数组中查找元素的第一个和最后一个位置', difficulty: 'Medium', tags: ['数组', '二分查找'], summary: '两次二分：lower_bound 找第一个 ≥ target，upper_bound 找第一个 > target。', link: '/problems/034-find-first-and-last-position-of-element-in-sorted-array', starred: false },
  { number: 33, title: '搜索旋转排序数组', difficulty: 'Medium', tags: ['数组', '二分查找'], summary: '旋转数组仍满足"一半有序"，判断 mid 落在有序半边再确定 target 位置。', link: '/problems/033-search-in-rotated-sorted-array', starred: false },
  { number: 74, title: '搜索二维矩阵', difficulty: 'Medium', tags: ['数组', '二分查找', '矩阵'], summary: '降维映射：将二维矩阵视为一维有序数组，mid 对应 (mid//n, mid%n)。', link: '/problems/074-search-a-2d-matrix', starred: false },

  // ===== 字符串技巧 =====
  { number: 560, title: '和为 K 的子数组', difficulty: 'Medium', tags: ['数组', '哈希表', '前缀和'], summary: '前缀和 + 哈希表：pre[j] - pre[i] = k 等价于 pre[j] - k = pre[i]。', link: '/problems/560-subarray-sum-equals-k', starred: false },
  { number: 394, title: '字符串解码', difficulty: 'Medium', tags: ['栈', '字符串', '递归'], summary: '双栈法：数字栈管重复次数，字符串栈管层级，遇到 ] 弹出重建。', link: '/problems/394-decode-string', starred: false },

  // ===== 贪心 =====
  { number: 121, title: '买卖股票的最佳时机', difficulty: 'Easy', tags: ['数组', '贪心'], summary: '维护历史最低价，每天计算当前价与最低价的差值取最大。', link: '/problems/121-best-time-to-buy-sell-stock', starred: false },
  { number: 55, title: '跳跃游戏', difficulty: 'Medium', tags: ['贪心', '数组'], summary: '维护最远可达位置，遍历时若当前位置超过最远可达则无法继续。', link: '/problems/055-jump-game', starred: false },
  { number: 45, title: '跳跃游戏 II', difficulty: 'Medium', tags: ['贪心', '数组'], summary: '维护当前跳跃边界和最远可达，到达边界时必须跳一次。', link: '/problems/045-jump-game-ii', starred: false },
  { number: 763, title: '划分字母区间', difficulty: 'Medium', tags: ['贪心', '字符串'], summary: '先记录每个字母最后出现位置，贪心扩展直到覆盖片段内所有字符。', link: '/problems/763-partition-labels', starred: false },

  // ===== 回溯 =====
  { number: 46, title: '全排列', difficulty: 'Medium', tags: ['回溯', '数组'], summary: '经典回溯模板：选择 → 递归 → 撤销，用 used 数组去重。', link: '/problems/046-permutations', starred: false },
  { number: 78, title: '子集', difficulty: 'Medium', tags: ['回溯', '数组'], summary: '每个节点都是答案，start 参数确保不重复选择前面的元素。', link: '/problems/078-subsets', starred: false },
  { number: 39, title: '组合总和', difficulty: 'Medium', tags: ['回溯', '数组'], summary: '允许重复选同一元素（传 i 而非 i+1），remain < 0 提前返回剪枝。', link: '/problems/039-combination-sum', starred: false },
  { number: 22, title: '括号生成', difficulty: 'Medium', tags: ['回溯', '字符串'], summary: 'right < left 保证合法性：任何前缀中左括号数 ≥ 右括号数。', link: '/problems/022-generate-parentheses', starred: false },
  { number: 79, title: '单词搜索', difficulty: 'Medium', tags: ['回溯', '矩阵', 'DFS'], summary: 'DFS + 回溯：用 # 标记已访问，搜索完恢复，注意不回头（3个方向）。', link: '/problems/079-word-search', starred: false },

  // ===== 堆 =====
  { number: 215, title: '数组中的第 K 个最大元素', difficulty: 'Medium', tags: ['堆', '数组'], summary: '维护大小为 k 的最小堆，堆满后弹出最小值，最终堆顶即第 k 大。', link: '/problems/215-kth-largest-element-in-an-array', starred: false },
  { number: 347, title: '前 K 个高频元素', difficulty: 'Medium', tags: ['堆', '哈希表'], summary: 'Counter 统计频率 + 大小为 k 的最小堆，堆满后弹出频率最低的。', link: '/problems/347-top-k-frequent-elements', starred: false },

  // ===== 一维动态规划 =====
  { number: 70, title: '爬楼梯', difficulty: 'Easy', tags: ['动态规划'], summary: '斐波那契数列：dp[i] = dp[i-1] + dp[i-2]，空间优化为两个变量。', link: '/problems/070-climbing-stairs', starred: false },
  { number: 198, title: '打家劫舍', difficulty: 'Medium', tags: ['动态规划'], summary: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])，抢当前 vs 不抢当前。', link: '/problems/198-house-robber', starred: false },
  { number: 279, title: '完全平方数', difficulty: 'Medium', tags: ['动态规划', '完全背包'], summary: '完全背包变体：dp[i] = min(dp[i - j²] + 1)，完全平方数即物品。', link: '/problems/279-perfect-squares', starred: false },
  { number: 322, title: '零钱兑换', difficulty: 'Medium', tags: ['动态规划', '完全背包'], summary: 'dp[i] = min(dp[i - coin] + 1)，凑出金额 i 的最少硬币数。', link: '/problems/322-coin-change', starred: false },
  { number: 300, title: '最长递增子序列', difficulty: 'Medium', tags: ['动态规划', '二分查找'], summary: 'tails 数组 + 二分替换：tails[i] 表示长度 i+1 的递增子序列最小末尾。', link: '/problems/300-longest-increasing-subsequence', starred: false },

  // ===== 链表进阶 =====
  { number: 142, title: '环形链表 II', difficulty: 'Medium', tags: ['链表', '双指针'], summary: '快慢指针相遇后，一指针回 head，同步前进再次相遇处即入环点。', link: '/problems/142-linked-list-cycle-ii', starred: false },
  { number: 148, title: '排序链表', difficulty: 'Medium', tags: ['链表', '归并排序'], summary: '归并排序链表版：快慢指针找中点 → 递归排序两半 → 合并有序链表。', link: '/problems/148-sort-list', starred: false },
  { number: 23, title: '合并 K 个升序链表', difficulty: 'Hard', tags: ['链表', '堆', '分治'], summary: '最小堆：所有链表头节点入堆，每次弹出最小节点并将其 next 推入堆。', link: '/problems/023-merge-k-sorted-lists', starred: false },
  { number: 146, title: 'LRU 缓存', difficulty: 'Medium', tags: ['哈希表', '链表', '设计'], summary: '哈希表 + 双向链表 / OrderedDict，get 和 put 均 O(1)。', link: '/problems/146-lru-cache', starred: false },
  { number: 2, title: '两数相加', difficulty: 'Medium', tags: ['链表', '递归'], summary: '逐位相加维护进位，divmod 同时得到商和余数，注意最终进位。', link: '/problems/002-add-two-numbers', starred: false },

  // ===== 图论 =====
  { number: 200, title: '岛屿数量', difficulty: 'Medium', tags: ['DFS', 'BFS', '矩阵'], summary: 'DFS/BFS 遍历连通块，遇到 1 时计数并将相连的 1 标记为已访问。', link: '/problems/200-number-of-islands', starred: false },
  { number: 994, title: '腐烂的橘子', difficulty: 'Medium', tags: ['BFS', '矩阵'], summary: '多源 BFS：所有腐烂橘子同时入队，逐层扩展记录扩散层数。', link: '/problems/994-rotting-oranges', starred: false },
  { number: 207, title: '课程表', difficulty: 'Medium', tags: ['图', '拓扑排序', 'BFS'], summary: 'Kahn 算法拓扑排序：不断移除入度为 0 的节点，检查是否能完成所有课程。', link: '/problems/207-course-schedule', starred: false },
  { number: 208, title: '实现 Trie（前缀树）', difficulty: 'Medium', tags: ['树', '设计', '字典树'], summary: '每个节点含 children 字典和 is_end 标记，insert/search/prefixSearch 均 O(L)。', link: '/problems/208-implement-trie-prefix-tree', starred: false },

  // ===== 多维动态规划 =====
  { number: 62, title: '不同路径', difficulty: 'Medium', tags: ['动态规划', '组合数学'], summary: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]，空间优化为一维数组。', link: '/problems/062-unique-paths', starred: false },
  { number: 5, title: '最长回文子串', difficulty: 'Medium', tags: ['动态规划', '字符串'], summary: '中心扩展法：以每个字符和每对相邻字符为中心向两边扩展。', link: '/problems/005-longest-palindromic-substring', starred: false },
  { number: 1143, title: '最长公共子序列', difficulty: 'Medium', tags: ['动态规划', '字符串'], summary: 'dp[i][j]：字符匹配则 dp[i-1][j-1]+1，否则 max(dp[i-1][j], dp[i][j-1])。', link: '/problems/1143-longest-common-subsequence', starred: false },
  { number: 72, title: '编辑距离', difficulty: 'Medium', tags: ['动态规划', '字符串'], summary: 'dp[i][j] = min(删除/插入/替换)，三种操作对应三个子问题。', link: '/problems/072-edit-distance', starred: false },

  // ===== 二叉树进阶 =====
  { number: 98, title: '验证二叉搜索树', difficulty: 'Medium', tags: ['树', 'DFS', 'BST'], summary: '中序遍历检查严格递增，或递归传递上下界验证每个节点。', link: '/problems/098-validate-binary-search-tree', starred: false },
  { number: 230, title: '二叉搜索树中第 K 小的元素', difficulty: 'Medium', tags: ['树', 'DFS', 'BST'], summary: '中序遍历 BST 得到有序序列，第 k 个即为答案，可提前终止。', link: '/problems/230-kth-smallest-element-in-a-bst', starred: false },
  { number: 199, title: '二叉树的右视图', difficulty: 'Medium', tags: ['树', 'BFS', 'DFS'], summary: 'BFS 每层最后一个元素，或 DFS 优先右子树每层首个节点。', link: '/problems/199-binary-tree-right-side-view', starred: false },
  { number: 114, title: '二叉树展开为链表', difficulty: 'Medium', tags: ['树', 'DFS'], summary: 'Morris 遍历思想：将右子树接到左子树最右节点后面，空间 O(1)。', link: '/problems/114-flatten-binary-tree-to-linked-list', starred: false },
  { number: 105, title: '从前序与中序遍历序列构造二叉树', difficulty: 'Medium', tags: ['树', 'DFS', '数组'], summary: '前序首元素为根，中序找根位置划分左右子树，哈希表加速查找。', link: '/problems/105-construct-binary-tree-from-preorder-and-inorder-traversal', starred: false },
  { number: 437, title: '路径总和 III', difficulty: 'Medium', tags: ['树', 'DFS', '前缀和'], summary: '前缀和 + DFS：curr_sum - target 在哈希表中存在则存在合法路径。', link: '/problems/437-path-sum-iii', starred: false },
  { number: 236, title: '二叉树的最近公共祖先', difficulty: 'Medium', tags: ['树', 'DFS'], summary: '后序遍历：两边都找到则当前为 LCA，只一边找到则 LCA 在那一侧。', link: '/problems/236-lowest-common-ancestor-of-a-binary-tree', starred: false },

  // ===== 动态规划高级 =====
  { number: 152, title: '乘积最大子数组', difficulty: 'Medium', tags: ['动态规划', '数组'], summary: '同时维护最大乘积和最小乘积，遇负数时交换两者，应对负数翻转效应。', link: '/problems/152-maximum-product-subarray', starred: false },
  { number: 416, title: '分割等和子集', difficulty: 'Medium', tags: ['动态规划', '0-1 背包'], summary: '0-1 背包：能否选出和为 sum/2 的子集，从后往前遍历避免重复使用。', link: '/problems/416-partition-equal-subset-sum', starred: false },
  { number: 139, title: '单词拆分', difficulty: 'Medium', tags: ['动态规划', '字符串'], summary: 'dp[i] = OR(dp[j] && s[j:i] in dict)，完全背包的字符串变体。', link: '/problems/139-word-break', starred: false },
  { number: 32, title: '最长有效括号', difficulty: 'Hard', tags: ['栈', '动态规划'], summary: '栈存储下标，-1 作哨兵，弹出后当前下标减栈顶即为有效长度。', link: '/problems/032-longest-valid-parentheses', starred: false },

  // ===== 矩阵操作 =====
  { number: 73, title: '矩阵置零', difficulty: 'Medium', tags: ['矩阵', '数组'], summary: '原地标记：复用首行首列作为标记数组，需单独处理首行首列的零。', link: '/problems/073-set-matrix-zeroes', starred: false },
  { number: 54, title: '螺旋矩阵', difficulty: 'Medium', tags: ['矩阵', '数组'], summary: '四边界收缩法：右→下→左→上逐层遍历，注意边界合法性检查。', link: '/problems/054-spiral-matrix', starred: false },
  { number: 48, title: '旋转图像', difficulty: 'Medium', tags: ['矩阵', '数组'], summary: '顺时针 90° = 转置 + 水平翻转，原地操作 O(1) 空间。', link: '/problems/048-rotate-image', starred: false },
  { number: 240, title: '搜索二维矩阵 II', difficulty: 'Medium', tags: ['矩阵', '二分查找'], summary: '从右上角开始搜索，利用行列有序性每步排除一行或一列。', link: '/problems/240-search-a-2d-matrix-ii', starred: false },
])

// Load starred state from localStorage
onMounted(() => {
  const saved = localStorage.getItem('lc-starred')
  if (saved) {
    try {
      const starredNumbers = JSON.parse(saved) as number[]
      problems.value.forEach(p => {
        if (starredNumbers.includes(p.number)) {
          p.starred = true
        }
      })
    } catch {}
  }
})

const totalCount = computed(() => problems.value.length)
const easyCount = computed(() => problems.value.filter(p => p.difficulty === 'Easy').length)
const mediumCount = computed(() => problems.value.filter(p => p.difficulty === 'Medium').length)
const hardCount = computed(() => problems.value.filter(p => p.difficulty === 'Hard').length)
const starredCount = computed(() => problems.value.filter(p => p.starred).length)
const progressPercent = computed(() => totalCount.value ? Math.round((starredCount.value / totalCount.value) * 100) : 0)

const allTags = computed(() => {
  const tagSet = new Set<string>()
  problems.value.forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
})

// Filter state
const activeFilters = ref({
  difficulty: 'All',
  tag: 'All',
  starredOnly: false,
  search: ''
})

const filteredProblems = computed(() => {
  let result = problems.value
  const f = activeFilters.value

  if (f.difficulty !== 'All') {
    result = result.filter(p => p.difficulty === f.difficulty)
  }
  if (f.tag !== 'All') {
    result = result.filter(p => p.tags.includes(f.tag))
  }
  if (f.starredOnly) {
    result = result.filter(p => p.starred)
  }
  if (f.search) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(f.search) ||
      String(p.number).includes(f.search) ||
      p.summary.toLowerCase().includes(f.search) ||
      p.tags.some(t => t.toLowerCase().includes(f.search))
    )
  }

  return result
})

function onFilter(filters: typeof activeFilters.value) {
  activeFilters.value = filters
}

function onToggleStar(number: number) {
  const problem = problems.value.find(p => p.number === number)
  if (problem) {
    problem.starred = !problem.starred
    // Persist to localStorage
    const starredNumbers = problems.value.filter(p => p.starred).map(p => p.number)
    localStorage.setItem('lc-starred', JSON.stringify(starredNumbers))
  }
}
</script>

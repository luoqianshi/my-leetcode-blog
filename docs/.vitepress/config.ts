import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    base: '/my-leetcode-blog/',
    cleanUrls: true,
    lang: 'zh-CN',
    title: 'LeetCode Hot 100 题解',
    description: 'LeetCode Hot 100 Python 题解个人知识库',
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
      ['meta', { name: 'theme-color', content: '#6366f1' }],
      ['link', {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css'
      }],
      ['link', {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      }],
      ['link', {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: ''
      }],
      ['link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap'
      }]
    ],

    themeConfig: {
      logo: '/logo.svg',
      nav: [
        { text: '首页', link: '/' },
        { text: '题目总览', link: '/problems/001-two-sum' },
        { text: '知识点渐进', link: '/review/01-bit-manipulation' },
      ],

      sidebar: {
        '/review/': [
          {
            text: '初级篇 — 入门必刷',
            collapsed: false,
            items: [
              { text: '01. 位运算技巧', link: '/review/01-bit-manipulation' },
              { text: '02. 哈希表基础', link: '/review/02-hash-table' },
              { text: '03. 双指针入门', link: '/review/03-two-pointers' },
              { text: '04. 栈基础', link: '/review/04-stack' },
              { text: '05. 链表入门', link: '/review/05-linked-list-basics' },
              { text: '06. 二叉树入门', link: '/review/06-binary-tree-basics' },
            ]
          },
          {
            text: '中级篇 — 进阶提升',
            collapsed: false,
            items: [
              { text: '07. 滑动窗口', link: '/review/07-sliding-window' },
              { text: '08. 数组进阶技巧', link: '/review/08-array-advanced' },
              { text: '09. 二分查找', link: '/review/09-binary-search' },
              { text: '10. 字符串技巧', link: '/review/10-string-techniques' },
              { text: '11. 贪心算法', link: '/review/11-greedy' },
              { text: '12. 回溯算法', link: '/review/12-backtracking' },
              { text: '13. 堆', link: '/review/13-heap' },
              { text: '14. 一维动态规划', link: '/review/14-1d-dp' },
              { text: '15. 链表进阶', link: '/review/15-linked-list-advanced' },
            ]
          },
          {
            text: '高级篇 — 冲刺大厂',
            collapsed: false,
            items: [
              { text: '16. 图论', link: '/review/16-graph' },
              { text: '17. 多维动态规划', link: '/review/17-multidim-dp' },
              { text: '18. 二叉树进阶', link: '/review/18-binary-tree-advanced' },
              { text: '19. 动态规划高级', link: '/review/19-dp-advanced' },
              { text: '20. 矩阵操作', link: '/review/20-matrix' },
            ]
          }
        ],
        '/problems/': [
          {
            text: '🟢 简单',
            collapsed: false,
            items: [
              { text: '001. 两数之和', link: '/problems/001-two-sum' },
              { text: '020. 有效的括号', link: '/problems/020-valid-parentheses' },
              { text: '021. 合并两个有序链表', link: '/problems/021-merge-two-sorted-lists' },
              { text: '035. 搜索插入位置', link: '/problems/035-search-insert-position' },
              { text: '104. 二叉树的最大深度', link: '/problems/104-maximum-depth-of-binary-tree' },
              { text: '121. 买卖股票的最佳时机', link: '/problems/121-best-time-to-buy-and-sell-stock' },
              { text: '136. 只出现一次的数字', link: '/problems/136-single-number' },
              { text: '141. 环形链表', link: '/problems/141-linked-list-cycle' },
              { text: '160. 相交链表', link: '/problems/160-intersection-of-two-linked-lists' },
              { text: '169. 多数元素', link: '/problems/169-majority-element' },
              { text: '206. 反转链表', link: '/problems/206-reverse-linked-list' },
              { text: '226. 翻转二叉树', link: '/problems/226-invert-binary-tree' },
              { text: '283. 移动零', link: '/problems/283-move-zeroes' },
              { text: '461. 汉明距离', link: '/problems/461-hamming-distance' },
            ]
          },
          {
            text: '🟠 中等',
            collapsed: false,
            items: [
              { text: '002. 两数相加', link: '/problems/002-add-two-numbers' },
              { text: '003. 无重复字符的最长子串', link: '/problems/003-longest-substring-without-repeating-characters' },
              { text: '005. 最长回文子串', link: '/problems/005-longest-palindromic-substring' },
              { text: '011. 盛最多水的容器', link: '/problems/011-container-with-most-water' },
              { text: '015. 三数之和', link: '/problems/015-3sum' },
              { text: '022. 括号生成', link: '/problems/022-generate-parentheses' },
              { text: '033. 搜索旋转排序数组', link: '/problems/033-search-in-rotated-sorted-array' },
              { text: '034. 查找元素首末位置', link: '/problems/034-find-first-and-last-position-of-element-in-sorted-array' },
              { text: '039. 组合总和', link: '/problems/039-combination-sum' },
              { text: '045. 跳跃游戏 II', link: '/problems/045-jump-game-ii' },
              { text: '046. 全排列', link: '/problems/046-permutations' },
              { text: '048. 旋转图像', link: '/problems/048-rotate-image' },
              { text: '049. 字母异位词分组', link: '/problems/049-group-anagrams' },
              { text: '053. 最大子数组和', link: '/problems/053-maximum-subarray' },
              { text: '054. 螺旋矩阵', link: '/problems/054-spiral-matrix' },
              { text: '055. 跳跃游戏', link: '/problems/055-jump-game' },
              { text: '056. 合并区间', link: '/problems/056-merge-intervals' },
              { text: '062. 不同路径', link: '/problems/062-unique-paths' },
              { text: '070. 爬楼梯', link: '/problems/070-climbing-stairs' },
              { text: '072. 编辑距离', link: '/problems/072-edit-distance' },
              { text: '073. 矩阵置零', link: '/problems/073-set-matrix-zeroes' },
              { text: '074. 搜索二维矩阵', link: '/problems/074-search-a-2d-matrix' },
              { text: '078. 子集', link: '/problems/078-subsets' },
              { text: '079. 单词搜索', link: '/problems/079-word-search' },
              { text: '094. 二叉树的中序遍历', link: '/problems/094-binary-tree-inorder-traversal' },
              { text: '098. 验证二叉搜索树', link: '/problems/098-validate-binary-search-tree' },
              { text: '102. 二叉树的层序遍历', link: '/problems/102-binary-tree-level-order-traversal' },
              { text: '105. 构造二叉树', link: '/problems/105-construct-binary-tree-from-preorder-and-inorder-traversal' },
              { text: '114. 二叉树展开为链表', link: '/problems/114-flatten-binary-tree-to-linked-list' },
              { text: '128. 最长连续序列', link: '/problems/128-longest-consecutive-sequence' },
              { text: '139. 单词拆分', link: '/problems/139-word-break' },
              { text: '142. 环形链表 II', link: '/problems/142-linked-list-cycle-ii' },
              { text: '146. LRU 缓存', link: '/problems/146-lru-cache' },
              { text: '148. 排序链表', link: '/problems/148-sort-list' },
              { text: '152. 乘积最大子数组', link: '/problems/152-maximum-product-subarray' },
              { text: '155. 最小栈', link: '/problems/155-min-stack' },
              { text: '189. 轮转数组', link: '/problems/189-rotate-array' },
              { text: '198. 打家劫舍', link: '/problems/198-house-robber' },
              { text: '199. 二叉树的右视图', link: '/problems/199-binary-tree-right-side-view' },
              { text: '200. 岛屿数量', link: '/problems/200-number-of-islands' },
              { text: '207. 课程表', link: '/problems/207-course-schedule' },
              { text: '208. 实现 Trie', link: '/problems/208-implement-trie-prefix-tree' },
              { text: '215. 第 K 个最大元素', link: '/problems/215-kth-largest-element-in-an-array' },
              { text: '230. BST 中第 K 小元素', link: '/problems/230-kth-smallest-element-in-a-bst' },
              { text: '236. 最近公共祖先', link: '/problems/236-lowest-common-ancestor-of-a-binary-tree' },
              { text: '238. 除自身以外数组的乘积', link: '/problems/238-product-of-array-except-self' },
              { text: '240. 搜索二维矩阵 II', link: '/problems/240-search-a-2d-matrix-ii' },
              { text: '279. 完全平方数', link: '/problems/279-perfect-squares' },
              { text: '300. 最长递增子序列', link: '/problems/300-longest-increasing-subsequence' },
              { text: '322. 零钱兑换', link: '/problems/322-coin-change' },
              { text: '347. 前 K 个高频元素', link: '/problems/347-top-k-frequent-elements' },
              { text: '394. 字符串解码', link: '/problems/394-decode-string' },
              { text: '416. 分割等和子集', link: '/problems/416-partition-equal-subset-sum' },
              { text: '437. 路径总和 III', link: '/problems/437-path-sum-iii' },
              { text: '438. 字母异位词', link: '/problems/438-find-all-anagrams-in-a-string' },
              { text: '560. 和为 K 的子数组', link: '/problems/560-subarray-sum-equals-k' },
              { text: '763. 划分字母区间', link: '/problems/763-partition-labels' },
              { text: '994. 腐烂的橘子', link: '/problems/994-rotting-oranges' },
              { text: '1143. 最长公共子序列', link: '/problems/1143-longest-common-subsequence' },
            ]
          },
          {
            text: '🔴 困难',
            collapsed: false,
            items: [
              { text: '023. 合并 K 个升序链表', link: '/problems/023-merge-k-sorted-lists' },
              { text: '032. 最长有效括号', link: '/problems/032-longest-valid-parentheses' },
              { text: '076. 最小覆盖子串', link: '/problems/076-minimum-window-substring' },
            ]
          }
        ]
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com' }
      ],

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索'
            },
            modal: {
              noResultsText: '没有找到相关结果',
              resetButtonTitle: '清除搜索条件',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭'
              }
            }
          }
        }
      },

      footer: {
        message: '基于 VitePress 构建',
        copyright: '© 2026 LeetCode Hot 100 题解，Build by 骆谦实.'
      },

      editLink: {
        pattern: 'https://github.com/luoqianshi/my-leetcode-blog/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
      }
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      lineNumbers: true,
      math: true
    },

    mermaid: {
      theme: 'default'
    },

    vite: {
      ssr: {
        noExternal: ['vitepress-plugin-mermaid']
      }
    }
  })
)

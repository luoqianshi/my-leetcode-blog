# LeetCode Hot 100 题解

个人整理的 LeetCode Hot 100 Python 题解知识库，基于 VitePress 构建，支持 Markdown 数学公式（KaTeX）和 Mermaid 图表。提供**逐题解析**和**知识点渐进式总结**两种学习路径。

## 项目结构

```
my-leetcode-blog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts          # VitePress 配置文件
│   │   └── theme/             # 自定义主题组件
│   │       ├── components/
│   │       │   ├── ProblemList.vue   # 首页（含题目总览/知识点总览双 Tab）
│   │       │   ├── ProblemCard.vue   # 题目卡片组件
│   │       │   ├── FilterBar.vue     # 筛选栏组件
│   │       │   ├── ReviewTab.vue     # 知识点总览组件（含 Mermaid 学习路径图）
│   │       │   └── ReviewCard.vue    # 知识点卡片组件
│   │       ├── styles/
│   │       │   └── custom.css        # 自定义样式
│   │       └── index.ts              # 主题入口
│   ├── problems/
│   │   ├── 001-two-sum.md     # 第 1 题：两数之和
│   │   ├── 002-add-two-numbers.md
│   │   └── ...                # 共 77 道题目
│   ├── review/
│   │   ├── 01-bit-manipulation.md   # 知识点01：位运算技巧
│   │   ├── 02-hash-table.md         # 知识点02：哈希表基础
│   │   └── ...                      # 共 20 个知识点模块
│   ├── public/
│   │   └── logo.svg           # 网站 Logo
│   └── index.md               # 首页
├── review/                    # 原始知识点总结（源文件）
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages 自动部署配置
├── netlify.toml               # Netlify 部署配置
├── package.json
└── tsconfig.json
```

## 题目分类

### 简单难度 (14 道)

两数之和、有效的括号、合并两个有序链表、搜索插入位置、二叉树的最大深度、买卖股票的最佳时机、只出现一次的数字、环形链表、相交链表、多数元素、反转链表、翻转二叉树、移动零、汉明距离

### 中等难度 (61 道)

两数相加、无重复字符的最长子串、最长回文子串、盛最多水的容器、三数之和、括号生成、搜索旋转排序数组、查找元素首末位置、组合总和、跳跃游戏 II、全排列、旋转图像、字母异位词分组、最大子数组和、螺旋矩阵、跳跃游戏、合并区间、不同路径、爬楼梯、编辑距离、矩阵置零、搜索二维矩阵、子集、单词搜索、二叉树的中序遍历、验证二叉搜索树、二叉树的层序遍历、构造二叉树、二叉树展开为链表、最长连续序列、单词拆分、环形链表 II、LRU 缓存、排序链表、乘积最大子数组、最小栈、轮转数组、打家劫舍、二叉树的右视图、岛屿数量、课程表、实现 Trie、第 K 个最大元素、BST 中第 K 小元素、最近公共祖先、除自身以外数组的乘积、搜索二维矩阵 II、完全平方数、最长递增子序列、零钱兑换、前 K 个高频元素、字符串解码、分割等和子集、路径总和 III、字母异位词、和为 K 的子数组、划分字母区间、腐烂的橘子、最长公共子序列

### 困难难度 (3 道)

合并 K 个升序链表、最长有效括号、最小覆盖子串

## 知识点覆盖

数组、哈希表、双指针、栈、链表、二叉树、滑动窗口、动态规划、位运算、贪心、回溯、堆、图论、矩阵

## 知识点渐进式总结

除逐题解析外，站点还提供按知识点渐进式组织的学习路径，共 20 个模块，按难度分三级：

### 初级篇 — 入门必刷（6 模块）

| # | 模块 | 题目数 | 链接 |
|---|------|--------|------|
| 01 | 位运算技巧 | 3 | [01-bit-manipulation.md](docs/review/01-bit-manipulation.md) |
| 02 | 哈希表基础 | 3 | [02-hash-table.md](docs/review/02-hash-table.md) |
| 03 | 双指针入门 | 3 | [03-two-pointers.md](docs/review/03-two-pointers.md) |
| 04 | 栈基础 | 2 | [04-stack.md](docs/review/04-stack.md) |
| 05 | 链表入门 | 4 | [05-linked-list-basics.md](docs/review/05-linked-list-basics.md) |
| 06 | 二叉树入门 | 4 | [06-binary-tree-basics.md](docs/review/06-binary-tree-basics.md) |

### 中级篇 — 进阶提升（9 模块）

| # | 模块 | 题目数 | 链接 |
|---|------|--------|------|
| 07 | 滑动窗口 | 3 | [07-sliding-window.md](docs/review/07-sliding-window.md) |
| 08 | 数组进阶技巧 | 4 | [08-array-advanced.md](docs/review/08-array-advanced.md) |
| 09 | 二分查找 | 4 | [09-binary-search.md](docs/review/09-binary-search.md) |
| 10 | 字符串技巧 | 2 | [10-string-techniques.md](docs/review/10-string-techniques.md) |
| 11 | 贪心算法 | 4 | [11-greedy.md](docs/review/11-greedy.md) |
| 12 | 回溯算法 | 5 | [12-backtracking.md](docs/review/12-backtracking.md) |
| 13 | 堆 | 2 | [13-heap.md](docs/review/13-heap.md) |
| 14 | 一维动态规划 | 5 | [14-1d-dp.md](docs/review/14-1d-dp.md) |
| 15 | 链表进阶 | 6 | [15-linked-list-advanced.md](docs/review/15-linked-list-advanced.md) |

### 高级篇 — 冲刺大厂（5 模块）

| # | 模块 | 题目数 | 链接 |
|---|------|--------|------|
| 16 | 图论 | 4 | [16-graph.md](docs/review/16-graph.md) |
| 17 | 多维动态规划 | 4 | [17-multidim-dp.md](docs/review/17-multidim-dp.md) |
| 18 | 二叉树进阶 | 7 | [18-binary-tree-advanced.md](docs/review/18-binary-tree-advanced.md) |
| 19 | 动态规划高级 | 4 | [19-dp-advanced.md](docs/review/19-dp-advanced.md) |
| 20 | 矩阵操作 | 4 | [20-matrix.md](docs/review/20-matrix.md) |

首页提供 Mermaid 学习路径图，可视化展示 01→20 的渐进关系和知识点之间的依赖。

## 技术栈

- **框架**: VitePress 1.6.3
- **语言**: TypeScript 5.7.3
- **前端**: Vue 3.5.13
- **数学公式**: markdown-it-mathjax3 + KaTeX
- **图表**: vitepress-plugin-mermaid + Mermaid
- **部署**: Netlify / GitHub Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产构建
npm run docs:preview
```

## 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署到 GitHub Pages：

1. 在 GitHub 仓库设置中启用 Pages功能，Source 选择 "GitHub Actions"
2. 推送代码到 `main` 分支后，GitHub Actions 将自动构建并部署
3. 部署完成后访问 `https://<username>.github.io/my-leetcode-blog/`

手动触发部署：在 GitHub 仓库页面点击 Actions -> Deploy VitePress site to Pages -> Run workflow

### Netlify

部署到 Netlify：

1. 将项目推送到 GitHub
2. 在 Netlify 中导入 GitHub 仓库
3. 构建命令留空，生产分支留空
4. 点击部署

## 功能特性

- 首页双 Tab 切换：题目总览 + 知识点总览
- 知识点学习路径图（Mermaid 渲染，按初级/中级/高级分色）
- 知识卡片网格：展示模块编号、描述、涉及题号
- 支持 Markdown 数学公式渲染（KaTeX）
- 支持 Mermaid 流程图/时序图
- 代码语法高亮
- 本地搜索
- 浅色/深色主题切换
- 响应式布局

## 题目文件格式

每道题目文件包含以下 Front Matter 元信息：

```yaml
---
title: "001. 两数之和"
number: 1
difficulty: Easy
tags: ["数组", "哈希表"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/two-sum/"
related: [15, 167]
summary: "暴力解法是双层循环 O(n²)，但利用哈希表可以优化到 O(n)。"
starred: false
date: 2024-01-01
---
```

## 知识点文件格式

每个知识点模块文件包含以下 Front Matter 元信息：

```yaml
---
title: "01. 位运算技巧"
description: 位运算直接对整数的二进制位进行操作，覆盖异或消同、摩尔投票、Brian Kernighan 逐位消除三个核心技巧。
level: beginner          # beginner | intermediate | advanced
count: 3                 # 包含题目数
prev: false              # 上一模块链接（首个模块为 false）
next: /review/02-hash-table  # 下一模块链接
---
```

## License

MIT

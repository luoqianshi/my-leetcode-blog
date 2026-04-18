# LeetCode Hot 100 题解

个人整理的 LeetCode Hot 100 Python 题解知识库，基于 VitePress 构建，支持 Markdown 数学公式（KaTeX）和 Mermaid 图表。

## 项目结构

```
my-leetcode-blog/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts          # VitePress 配置文件
│   ├── problems/
│   │   ├── 001-two-sum.md     # 第 1 题：两数之和
│   │   ├── 002-add-two-numbers.md
│   │   └── ...                # 共 77 道题目
│   ├── public/
│   │   └── logo.svg           # 网站 Logo
│   └── index.md               # 首页
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

数组、哈希表、双指针、栈、链表、二叉树、滑动窗口、动态规划、位运算

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

## License

MIT

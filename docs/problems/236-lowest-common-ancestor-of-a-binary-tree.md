---
title: "236. 二叉树的最近公共祖先"
number: 236
difficulty: Medium
tags: ["树", "深度优先搜索"]
time_complexity: "O(n)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/"
related: [236]
summary: "后序遍历递归，两边都找到则当前为 LCA。"
starred: false
date: 2024-01-01
---

## 题目描述

给定二叉树和两个节点 p 和 q，找到它们的最近公共祖先（LCA）。

## 解题思路

后序遍历。如果当前节点是 p 或 q，返回当前节点。如果左右子树分别找到了 p 和 q，则当前节点就是 LCA。如果只有一边找到了，返回找到的那边。

简洁优雅的递归解法。核心逻辑：两边都找到了 → 当前就是 LCA；只有一边找到 → LCA 在那一侧；都没找到 → 不在当前子树中。对于 BST，可以利用大小关系更快地找到 LCA。

## 代码实现

```python
class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root  # p 和 q 分别在左右子树
        return left or right  # 只在一侧找到
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(h)

## 关键要点

- 后序遍历递归，两边都找到则当前为 LCA。


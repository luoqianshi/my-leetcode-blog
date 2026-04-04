---
title: "104. 二叉树的最大深度"
number: 104
difficulty: Easy
tags: ["树", "DFS", "BFS`"]
time_complexity: "O(n)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/maximum-depth-of-binary-tree/"
related: [111, 104]
summary: "这是二叉树递归的入门题。最大深度等于 max(左子树深度, 右子树深度) + 1（当前节点本身算一层）。递归终止条件：空节点深度为 0。这个递归公式直接对应代码..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个二叉树 root，返回其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

## 解题思路

这是二叉树递归的入门题。最大深度等于 max(左子树深度, 右子树深度) + 1（当前节点本身算一层）。递归终止条件：空节点深度为 0。这个递归公式直接对应代码实现，非常简洁。也可以用 BFS（层序遍历）求解：每遍历完一层，深度加一，直到队列为空。

## 代码实现

```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(h)

## 关键要点



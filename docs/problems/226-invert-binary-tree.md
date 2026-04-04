---
title: "226. 翻转二叉树"
number: 226
difficulty: Easy
tags: ["树", "DFS", "分治`"]
time_complexity: "O(n)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/invert-binary-tree/"
related: [226]
summary: "翻转二叉树的操作非常直观——交换每个节点的左右子树。使用递归，对当前节点：先翻转左子树，再翻转右子树，最后交换左右子节点。这是分治思想的典型应用：翻转整棵树 =..."
starred: false
date: 2024-01-01
---

## 题目描述

给你一棵二叉树的根节点 root，翻转这棵二叉树，并返回其根节点。

## 解题思路

翻转二叉树的操作非常直观——交换每个节点的左右子树。使用递归，对当前节点：先翻转左子树，再翻转右子树，最后交换左右子节点。这是分治思想的典型应用：翻转整棵树 = 翻转左子树 + 翻转右子树 + 交换根节点的左右子节点。递归终止条件是遇到空节点。这道题代码极其简洁，但其递归思想是所有树形问题的基础。

## 代码实现

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(h)

## 关键要点



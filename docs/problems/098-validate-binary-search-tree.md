---
title: "098. 验证二叉搜索树"
number: 98
difficulty: Medium
tags: ["树", "深度优先搜索", "二叉搜索树"]
time_complexity: "O(n)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/validate-binary-search-tree/"
related: [98]
summary: "中序遍历检查严格递增，或递归传递上下界验证 BST。"
starred: false
date: 2024-01-01
---

## 题目描述

给定二叉树的根节点，判断它是否是有效的二叉搜索树（BST）。

## 解题思路

BST 的定义：左子树所有节点值 < 根节点值 < 右子树所有节点值。中序遍历 BST 应该得到严格递增序列。因此只需在中序遍历时检查当前节点值是否大于前一个节点值。

常见的错误做法是只比较父子节点（`node.val > node.left.val and node.val < node.right.val`），这只能保证局部有序，不能保证左子树的所有值都小于根。正确做法是利用中序遍历的有序性或传递上下界。

**递归 + 上下界解法（同样优雅）：**

```python
class Solution:
    def isValidBST(self, root):
        def validate(node, low=float('-inf'), high=float('inf')):
            if not node:
                return True
            if node.val <= low or node.val >= high:
                return False
            return (validate(node.left, low, node.val) and
                    validate(node.right, node.val, high))
        return validate(root)
```

## 代码实现

```python
class Solution:
    def isValidBST(self, root):
        prev = float('-inf')
        def inorder(node):
            nonlocal prev
            if not node:
                return True
            if not inorder(node.left):
                return False
            if node.val <= prev:
                return False
            prev = node.val
            return inorder(node.right)
        return inorder(root)
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(h)

## 关键要点

- 中序遍历检查严格递增，或递归传递上下界验证 BST。


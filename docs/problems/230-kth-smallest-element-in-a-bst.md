---
title: "230. 二叉搜索树中第 K 小的元素"
number: 230
difficulty: Medium
tags: ["树", "深度优先搜索", "二叉搜索树"]
time_complexity: "O(h + k)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/kth-smallest-element-in-a-bst/"
related: [230]
summary: "BST 中序遍历有序，第 k 个即为答案。"
starred: false
date: 2024-01-01
---

## 题目描述

给定 BST 的根节点和整数 k，返回第 k 小的元素。

## 解题思路

中序遍历 BST 得到有序序列，第 k 个即为答案。可以提前终止遍历。

利用 BST 中序遍历有序的特性。找到后通过 `result is not None` 提前终止，避免遍历整棵树。如果需要频繁查询第 k 小，可以提前中序遍历存入数组或维护每个子树的节点数。

## 代码实现

```python
class Solution:
    def kthSmallest(self, root, k):
        count = 0
        result = None
        def inorder(node):
            nonlocal count, result
            if not node or result is not None:
                return
            inorder(node.left)
            count += 1
            if count == k:
                result = node.val
                return
            inorder(node.right)
        inorder(root)
        return result
```

## 复杂度分析

- **时间复杂度**: O(h + k)
- **空间复杂度**: O(h)

## 关键要点

- BST 中序遍历有序，第 k 个即为答案。


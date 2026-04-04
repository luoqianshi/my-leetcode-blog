---
title: "199. 二叉树的右视图"
number: 199
difficulty: Medium
tags: ["树", "广度优先搜索", "深度优先搜索"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/binary-tree-right-side-view/"
related: [199]
summary: "BFS 每层最后一个节点，或 DFS 优先右子树每层首个节点。"
starred: false
date: 2024-01-01
---

## 题目描述

给定二叉树的根节点，从右侧看到的节点值（即每一层最右边的节点）。

## 解题思路

BFS 层序遍历，每层最后一个元素即为右视图的值。或者 DFS 优先遍历右子树，记录每层第一个访问的节点。

BFS 每层最后一个节点，DFS 优先右子树每层首个节点。两种方法殊途同归。

## 代码实现

```python
# BFS 解法
from collections import deque

class Solution:
    def rightSideView(self, root):
        if not root:
            return []
        q = deque([root])
        result = []
        while q:
            for _ in range(len(q)):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            result.append(node.val)  # 每层最后一个
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- BFS 每层最后一个节点，或 DFS 优先右子树每层首个节点。


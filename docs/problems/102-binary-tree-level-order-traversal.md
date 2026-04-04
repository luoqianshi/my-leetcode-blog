---
title: "102. 二叉树的层序遍历"
number: 102
difficulty: Medium
tags: ["树", "BFS", "二叉树`"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/"
related: [103, 107, 102]
summary: "层序遍历使用 BFS（广度优先搜索），核心工具是队列。基本流程：将根节点入队，然后循环执行：记录当前层的节点数，逐个出队并记录值，同时将子节点入队。利用\"先记录..."
starred: false
date: 2024-01-01
---

## 题目描述

给你二叉树的根节点 root，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。

## 解题思路

层序遍历使用 BFS（广度优先搜索），核心工具是队列。基本流程：将根节点入队，然后循环执行：记录当前层的节点数，逐个出队并记录值，同时将子节点入队。利用"先记录当前层大小"的技巧，可以在一次 BFS 中按层分组结果。这是二叉树 BFS 的标准模板，后续的"锯齿形层序遍历"（103）、"二叉树最大宽度"（662）等题目都是在此基础上的变种。

## 代码实现

```python
from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点



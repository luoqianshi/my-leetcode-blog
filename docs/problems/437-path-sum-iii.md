---
title: "437. 路径总和 III"
number: 437
difficulty: Medium
tags: ["树", "深度优先搜索"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/path-sum-iii/"
related: [437]
summary: "前缀和 + DFS + 哈希表，与数组子数组和问题思路一致。"
starred: false
date: 2024-01-01
---

## 题目描述

给定二叉树，找到所有路径，使得路径上节点值之和等于目标值。路径不需要从根节点开始，也不需要在叶子节点结束（但必须向下）。

## 解题思路

前缀和 + DFS。维护从根到当前节点的路径和，用哈希表记录出现过的前缀和及其次数。如果 `curr_sum - target` 在哈希表中存在，说明存在合法路径。

这是"前缀和 + 哈希表"在树上的经典应用，与数组子数组和问题（LC560）思路完全一致。回溯时需要将 prefix 中的计数减 1，因为路径必须向下走。

## 代码实现

```python
class Solution:
    def pathSum(self, root, targetSum):
        from collections import defaultdict
        count = 0
        prefix = defaultdict(int)
        prefix[0] = 1  # 前缀和为 0 出现 1 次

        def dfs(node, curr_sum):
            nonlocal count
            if not node:
                return
            curr_sum += node.val
            count += prefix.get(curr_sum - targetSum, 0)
            prefix[curr_sum] += 1
            dfs(node.left, curr_sum)
            dfs(node.right, curr_sum)
            prefix[curr_sum] -= 1  # 回溯

        dfs(root, 0)
        return count
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 前缀和 + DFS + 哈希表，与数组子数组和问题思路一致。


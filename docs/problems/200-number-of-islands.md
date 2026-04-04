---
title: "200. 岛屿数量"
number: 200
difficulty: Medium
tags: ["深度优先搜索", "广度优先搜索", "并查集"]
time_complexity: "O(m×n)"
space_complexity: "O(m×n)"
leetcode_url: "https://leetcode.cn/problems/number-of-islands/"
related: [200]
summary: "DFS/BFS 遍历连通块，原地修改 grid 标记已访问。"
starred: false
date: 2024-01-01
---

## 题目描述

给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿数量。岛屿被水包围，通过水平或垂直相邻连接。

## 解题思路

DFS/BFS 遍历。遇到 '1' 时计数并 DFS 将所有相连的 '1' 标记为已访问（改为 '0' 或用 visited 集合）。

原地修改 grid 作为 visited 标记，省去额外空间。DFS 四方向递归，也可以用 BFS + deque 实现。

## 代码实现

```python
class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0
        m, n = len(grid), len(grid[0])
        count = 0

        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
                return
            grid[i][j] = '0'  # 标记已访问
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        return count
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(m×n)

## 关键要点

- DFS/BFS 遍历连通块，原地修改 grid 标记已访问。


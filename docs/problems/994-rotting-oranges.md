---
title: "994. 腐烂的橘子"
number: 994
difficulty: Medium
tags: ["广度优先搜索", "矩阵"]
time_complexity: "O(m×n)"
space_complexity: "O(m×n)"
leetcode_url: "https://leetcode.cn/problems/rotting-oranges/"
related: [994]
summary: "多源 BFS，所有腐烂橘子同时入队逐层扩展。"
starred: false
date: 2024-01-01
---

## 题目描述

在网格中，每分钟新鲜橘子（1）会被上下左右四个方向的腐烂橘子（2）感染。返回所有新鲜橘子腐烂的最短时间，如果有橘子永远无法腐烂则返回 -1。

## 解题思路

多源 BFS。将所有初始腐烂橘子同时入队，逐层扩展。记录扩散层数即为时间。

多源 BFS 的经典应用。`for _ in range(len(q))` 实现逐层遍历，每层代表一分钟。最后检查 fresh 是否为 0。

## 代码实现

```python
from collections import deque

class Solution:
    def orangesRotting(self, grid):
        m, n = len(grid), len(grid[0])
        q = deque()
        fresh = 0
        # 收集所有腐烂橘子和新鲜橘子数量
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    q.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1
        if fresh == 0:
            return 0
        # 多源 BFS
        minutes = 0
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while q:
            for _ in range(len(q)):  # 逐层处理
                x, y = q.popleft()
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                        grid[nx][ny] = 2
                        fresh -= 1
                        q.append((nx, ny))
            if q:
                minutes += 1
        return minutes if fresh == 0 else -1
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(m×n)

## 关键要点

- 多源 BFS，所有腐烂橘子同时入队逐层扩展。


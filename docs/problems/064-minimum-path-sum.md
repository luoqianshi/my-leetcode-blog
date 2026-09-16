---
title: "064. 最小路径和"
number: 64
difficulty: Medium
tags: ["数组", "动态规划"]
time_complexity: "O(mn)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/minimum-path-sum/"
related: [62, 72]
summary: "网格 DP：dp[j] = min(上, 左) + 当前格，滚动数组压成一维，转移时 dp[j] 是“来自上方”、dp[j-1] 是“来自左侧”。"
starred: false
date: 2026-09-16
---

## 题目描述

给定一个包含非负整数的 m×n 网格 grid，请找出一条从左上角到右下角的路径，使得路径上的数字总和最小。每次只能向下或者向右移动一步。

## 解题思路

只能向右或向下走，所以到达 (i, j) 的最小路径和有天然的无后效性：

```
dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
```

- 第一行只能从左来：前缀和；第一列只能从上来：前缀和。
- 用**一维滚动数组**压缩：处理第 i 行时，`dp[j]`（更新前）恰是上一行的值（来自上方），`dp[j-1]`（刚更新）是本行左边的值（来自左侧）。所以 `dp[j] = min(dp[j], dp[j-1]) + grid[i][j]`。

初始化第 0 行的前缀和后，从第 1 行逐行往下滚即可。

## 代码实现

```python
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [0] * n
        dp[0] = grid[0][0]
        for j in range(1, n):          # 第一行：只能从左来
            dp[j] = dp[j - 1] + grid[0][j]
        for i in range(1, m):
            dp[0] += grid[i][0]        # 第一列：只能从上来
            for j in range(1, n):
                dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
        return dp[-1]
```

## 复杂度分析

- **时间复杂度**: O(mn)
- **空间复杂度**: O(n)

## 关键要点

- 一维压缩的语义：内层循环进入时 dp[j] 是"上方值"，dp[j-1] 已被覆盖为"左侧值"，一个 min 同时取到两个方向。
- 与 62 题不同路径的唯一区别是"计数"变"求极值"：max/min 替换加法计数，DP 结构完全同构。
- 若允许原地修改 grid，空间还能压到 O(1)，但会破坏输入数据。

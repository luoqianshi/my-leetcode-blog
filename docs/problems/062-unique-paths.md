---
title: "062. 不同路径"
number: 62
difficulty: Medium
tags: ["动态规划", "组合数学"]
time_complexity: "O(m×n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/unique-paths/"
related: [63, 62]
summary: "二维网格 DP，dp[i][j] = dp[i-1][j] + dp[i][j-1]，空间优化为一维。"
starred: false
date: 2024-01-01
---

## 题目描述

从 m×n 网格的左上角走到右下角，每次只能向右或向下，有多少条不同路径。

## 解题思路

`dp[i][j]` = 到达 (i,j) 的路径数 = dp[i-1][j] + dp[i][j-1]。初始条件：第一行和第一列都只有 1 条路径。

二维 DP 的标准入门题。空间优化技巧：`dp[j]` 在更新前存储的是 dp[i-1][j]（上方），`dp[j-1]` 已经更新为 dp[i][j-1]（左方），所以 `dp[j] += dp[j-1]` 等价于 `dp[i][j] = dp[i-1][j] + dp[i][j-1]`。

## 代码实现

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n  # 空间优化为一维
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]
        return dp[-1]
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(n)

## 关键要点

- 二维网格 DP，dp[i][j] = dp[i-1][j] + dp[i][j-1]，空间优化为一维。


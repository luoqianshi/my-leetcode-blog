---
title: "279. 完全平方数"
number: 279
difficulty: Medium
tags: ["动态规划", "数学", "BFS"]
time_complexity: "O(n × sqrt(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/perfect-squares/"
related: [279]
summary: "完全背包变体，dp[i] = min(dp[i - j^2] + 1)。"
starred: false
date: 2024-01-01
---

## 题目描述

给定正整数 n，返回和为 n 的最少完全平方数的个数。

## 解题思路

`dp[i]` 表示和为 i 的最少完全平方数个数。对每个 i，尝试用所有可能的完全平方数 j² 来凑。

这是一个"完全背包"问题的变体——完全平方数就是"物品"，目标值 n 就是"背包容量"。

## 代码实现

```python
class Solution:
    def numSquares(self, n: int) -> int:
        dp = [float('inf')] * (n + 1)
        dp[0] = 0
        for i in range(1, n + 1):
            j = 1
            while j * j <= i:
                dp[i] = min(dp[i], dp[i - j * j] + 1)
                j += 1
        return dp[n]
```

## 复杂度分析

- **时间复杂度**: O(n × sqrt(n)
- **空间复杂度**: O(n)

## 关键要点

- 完全背包变体，dp[i] = min(dp[i - j^2] + 1)。


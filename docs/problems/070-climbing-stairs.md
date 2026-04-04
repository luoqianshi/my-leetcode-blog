---
title: "070. 爬楼梯"
number: 70
difficulty: Easy
tags: ["动态规划", "记忆化搜索"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/climbing-stairs/"
related: [70]
summary: "斐波那契数列，dp[i] = dp[i-1] + dp[i-2]，空间优化为两个变量。"
starred: false
date: 2024-01-01
---

## 题目描述

每次可以爬 1 或 2 个台阶，到达第 n 阶有多少种方法。

## 解题思路

到达第 i 阶的方法数 = 到达第 i-1 阶的方法数 + 到达第 i-2 阶的方法数。斐波那契数列。

最简单的 DP 入门题。状态转移：`dp[i] = dp[i-1] + dp[i-2]`。空间优化：只需前两个状态。

## 代码实现

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 斐波那契数列，dp[i] = dp[i-1] + dp[i-2]，空间优化为两个变量。


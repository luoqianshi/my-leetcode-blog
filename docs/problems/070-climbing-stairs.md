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
class Solution(object):
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        dp = {0:0}
        # 模拟初始情况
        # 直接爬1个台阶到位 共1种方法
        dp[1] = 1
        # 直接爬2个台阶到位 or 分两次爬1个台阶 共2种方法
        dp[2] = 2

        # 状态转移矩阵 dp[i] = dp[i-1] + dp[i-2]
        # 因为n=i的方法数量等于n=i-1的方法数+n=i-2的方法数量
        # 根据状态转移矩阵填充解空间
        for i in range(3,n+1):
            dp[i] = dp[i-1] + dp[i-2]
        return dp[n]
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 斐波那契数列，dp[i] = dp[i-1] + dp[i-2]，空间优化为两个变量。


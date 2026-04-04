---
title: "1143. 最长公共子序列"
number: 1143
difficulty: Medium
tags: ["动态规划", "字符串"]
time_complexity: "O(m×n)"
space_complexity: "O(m×n)"
leetcode_url: "https://leetcode.cn/problems/longest-common-subsequence/"
related: [1143]
summary: "二维字符串匹配 DP，字符匹配则 +1，否则取 max。"
starred: false
date: 2024-01-01
---

## 题目描述

给定两个字符串 text1 和 text2，返回它们的**最长公共子序列**的长度。

## 解题思路

`dp[i][j]` = text1[0:i] 和 text2[0:j] 的 LCS 长度。如果 text1[i-1] == text2[j-1]，则 dp[i][j] = dp[i-1][j-1] + 1；否则 dp[i][j] = max(dp[i-1][j], dp[i][j-1])。

二维 DP 的经典模板题。可以空间优化为一维：只需要上一行的 dp 值。`dp[j] = dp[j-1] + 1 if match else max(dp[j], prev[j])`（需要保存 prev）。

## 代码实现

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(m×n)

## 关键要点

- 二维字符串匹配 DP，字符匹配则 +1，否则取 max。


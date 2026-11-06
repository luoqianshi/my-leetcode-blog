---
title: "072. 编辑距离"
number: 72
difficulty: Medium
tags: ["动态规划", "字符串"]
time_complexity: "O(m×n)"
space_complexity: "O(m×n)"
leetcode_url: "https://leetcode.cn/problems/edit-distance/"
related: [72]
summary: "编辑距离 DP，三种操作（插入/删除/替换）取最小。"
starred: false
date: 2024-01-01
---

## 题目描述

给定两个单词 word1 和 word2，返回将 word1 转换成 word2 所使用的最少操作数（插入、删除、替换）。

## 解题思路

`dp[i][j]` = word1[0:i] 转换为 word2[0:j] 的最少操作数。

三种操作：
- 删除 word1[i-1]：dp[i][j] = dp[i-1][j] + 1
- 插入 word2[j-1]：dp[i][j] = dp[i][j-1] + 1
- 替换 word1[i-1] 为 word2[j-1]：dp[i][j] = dp[i-1][j-1] + 1

如果 word1[i-1] == word2[j-1]，无需操作：dp[i][j] = dp[i-1][j-1]

编辑距离是二维 DP 的天花板之一。理解三种操作的对称性——在 word1 上"删除"等价于在 word2 上"插入"。初始化：dp[i][0] = i（删除 i 个字符），dp[0][j] = j（插入 j 个字符）。

## 代码实现

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        # 初始化
        for i in range(m + 1):
            dp[i][0] = i  # word1 前 i 个字符全部删除
        for j in range(n + 1):
            dp[0][j] = j  # 全部插入 word2 的前 j 个字符

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j],      # 删除
                                        dp[i][j - 1],      # 插入
                                        dp[i - 1][j - 1])  # 替换
        return dp[m][n]
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(m×n)

## 关键要点

- 编辑距离 DP，三种操作（插入/删除/替换）取最小。


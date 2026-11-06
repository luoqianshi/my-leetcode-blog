---
title: "139. 单词拆分"
number: 139
difficulty: Medium
tags: ["动态规划", "哈希表", "字符串"]
time_complexity: "O(n²)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/word-break/"
related: [139]
summary: "完全背包变体，dp[i] = OR(dp[j] && s[j:i] in dict)。"
starred: false
date: 2024-01-01
---

## 题目描述

给定字符串 s 和单词字典 wordDict，判断 s 是否可以被拆分为一个或多个字典中的单词。

## 解题思路

`dp[i]` 表示 s[0:i] 是否可以被拆分。对每个位置 i，遍历所有可能的分割点 j，检查 s[j:i] 是否在字典中且 dp[j] 为 True。

完全背包的变体。`dp[0] = True` 是重要的初始条件——空字符串永远可以被拆分。优化：限制 j 的范围不超过最大单词长度。

## 代码实现

```python
class Solution:
    def wordBreak(self, s, wordDict):
        word_set = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True  # 空字符串可拆分
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        return dp[n]
```

## 复杂度分析

- **时间复杂度**: O(n²)
- **空间复杂度**: O(n)

## 关键要点

- 完全背包变体，dp[i] = OR(dp[j] && s[j:i] in dict)。


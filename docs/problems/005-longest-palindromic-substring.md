---
title: "005. 最长回文子串"
number: 5
difficulty: Medium
tags: ["动态规划", "字符串"]
time_complexity: "O(n²)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/longest-palindromic-substring/"
related: [5]
summary: "中心扩展法，以每个字符和每对相邻字符为中心向两边扩展。"
starred: false
date: 2024-01-01
---

## 题目描述

给定字符串 s，找到其中最长的回文子串。

## 解题思路

中心扩展法。以每个字符（以及每对相邻字符）为中心，向两边扩展寻找回文。比 DP 更高效且直观。

中心扩展法每次扩展的时间均摊为 O(1)（因为回文的总数是有限的）。Manacher 算法能做到 O(n)，但面试中通常不要求。

**DP 解法（供理解）：**

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        start, max_len = 0, 1
        for i in range(n):
            dp[i][i] = True
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j]:
                    dp[i][j] = (length == 2) or dp[i + 1][j - 1]
                if dp[i][j] and length > max_len:
                    start, max_len = i, length
        return s[start:start + max_len]
```

DP 解法时间空间都是 O(n²)，理解其状态转移有助于掌握 DP 思维。

## 代码实现

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if len(s) < 2:
            return s
        start, max_len = 0, 1

        def expand(l, r):
            nonlocal start, max_len
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            # 回文为 s[l+1:r]
            if r - l - 1 > max_len:
                max_len = r - l - 1
                start = l + 1

        for i in range(len(s)):
            expand(i, i)      # 奇数长度回文
            expand(i, i + 1)  # 偶数长度回文

        return s[start:start + max_len]
```

## 复杂度分析

- **时间复杂度**: O(n²)
- **空间复杂度**: O(1)

## 关键要点

- 中心扩展法，以每个字符和每对相邻字符为中心向两边扩展。


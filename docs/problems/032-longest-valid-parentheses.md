---
title: "032. 最长有效括号"
number: 32
difficulty: Hard
tags: ["动态规划", "栈", "字符串"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/longest-valid-parentheses/"
related: [32]
summary: "栈存储下标，-1 作为哨兵，弹出后用当前下标减栈顶得到有效长度。"
starred: false
date: 2024-01-01
---

## 题目描述

给定一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

## 解题思路

用栈存储下标。初始将 -1 入栈作为"基准"。遇到 '(' 入栈其下标，遇到 ')' 弹栈后用当前下标减去栈顶下标即为有效长度。

栈中存储下标而非字符——这样可以计算长度。`-1` 作为哨兵处理边界情况。当栈空时将当前右括号下标入栈作为新基准。例如 "(()" 的过程：push(0), push(1), pop→栈顶0, len=2-0=2。

**DP 解法（供理解）：**

```python
class Solution:
    def longestValidParentheses(self, s):
        n = len(s)
        dp = [0] * n
        max_len = 0
        for i in range(1, n):
            if s[i] == ')':
                if s[i - 1] == '(':
                    dp[i] = (dp[i - 2] if i >= 2 else 0) + 2
                elif i - dp[i - 1] - 1 >= 0 and s[i - dp[i - 1] - 1] == '(':
                    dp[i] = dp[i - 1] + 2 + (dp[i - dp[i - 1] - 2] if i - dp[i - 1] >= 2 else 0)
                max_len = max(max_len, dp[i])
        return max_len
```

## 代码实现

```python
class Solution:
    def longestValidParentheses(self, s):
        max_len = 0
        stack = [-1]  # 哨兵
        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)  # 新的基准
                else:
                    max_len = max(max_len, i - stack[-1])
        return max_len
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 栈存储下标，-1 作为哨兵，弹出后用当前下标减栈顶得到有效长度。


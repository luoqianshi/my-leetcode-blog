---
title: "022. 括号生成"
number: 22
difficulty: Medium
tags: ["回溯", "字符串"]
time_complexity: "O(4^n / sqrt(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/generate-parentheses/"
related: [22]
summary: "回溯生成括号，right < left 保证合法性。"
starred: false
date: 2024-01-01
---

## 题目描述

给定 n 对括号，生成所有合法的括号组合。

## 解题思路

回溯时维护"剩余左括号数"和"剩余右括号数"。只有左括号数 > 右括号数时才能放右括号（保证合法）。

`right < left` 是合法性保证——任何前缀中，左括号数量 ≥ 右括号数量。

## 代码实现

```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        result = []

        def backtrack(s, left, right):
            if len(s) == 2 * n:
                result.append(s)
                return
            if left < n:
                backtrack(s + '(', left + 1, right)
            if right < left:
                backtrack(s + ')', left, right + 1)

        backtrack('', 0, 0)
        return result
```

## 复杂度分析

- **时间复杂度**: O(4^n / sqrt(n)
- **空间复杂度**: O(n)

## 关键要点

- 回溯生成括号，right < left 保证合法性。


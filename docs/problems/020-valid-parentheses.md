---
title: "020. 有效的括号"
number: 20
difficulty: Easy
tags: ["栈", "字符串`"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/valid-parentheses/"
related: [32, 22]
summary: "这是栈最经典的应用场景。遍历字符串，遇到左括号就入栈，遇到右括号就检查栈顶是否是对应的左括号——如果是，弹出栈顶（配对成功）；如果不是，说明括号不匹配。遍历结束..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。有效字符串需满足：左括号必须用相同类型的右括号闭合；左括号必须以正确的顺序闭合；每个右括号都有一个对应的相同类型的左括号。

## 解题思路

这是栈最经典的应用场景。遍历字符串，遇到左括号就入栈，遇到右括号就检查栈顶是否是对应的左括号——如果是，弹出栈顶（配对成功）；如果不是，说明括号不匹配。遍历结束后，如果栈为空说明所有括号都正确配对。关键点在于使用哈希表建立右括号到左括号的映射，使代码更简洁。时间复杂度 O(n)，空间复杂度 O(n)（最坏情况全是左括号）。

## 代码实现

```python
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                stack.append(ch)
        return not stack
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点



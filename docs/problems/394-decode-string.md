---
title: "394. 字符串解码"
number: 394
difficulty: Medium
tags: ["栈", "字符串", "递归"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/decode-string/"
related: [394]
summary: "双栈法：数字栈控制重复次数，字符串栈保存当前层级状态。"
starred: false
date: 2024-01-01
---

## 题目描述

给定编码字符串 `k[encoded_string]`，返回解码后的字符串。支持嵌套。

## 解题思路

用两个栈——数字栈和字符串栈。遇到数字进数字栈，遇到 `[` 进当前字符串到栈并重置，遇到 `]` 弹出并拼接。

双栈的配合——数字栈控制重复次数，字符串栈保存当前层的状态。遇到 `]` 时弹出并重建，完美处理嵌套。注意数字可能是多位数（`current_num = current_num * 10 + int(ch)`）。

## 代码实现

```python
class Solution:
    def decodeString(self, s: str) -> str:
        num_stack = []
        str_stack = []
        current_str = ""
        current_num = 0
        for ch in s:
            if ch.isdigit():
                current_num = current_num * 10 + int(ch)
            elif ch == '[':
                num_stack.append(current_num)
                str_stack.append(current_str)
                current_str = ""
                current_num = 0
            elif ch == ']':
                current_str = str_stack.pop() + current_str * num_stack.pop()
            else:
                current_str += ch
        return current_str
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 双栈法：数字栈控制重复次数，字符串栈保存当前层级状态。


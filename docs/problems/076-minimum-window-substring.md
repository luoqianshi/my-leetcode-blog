---
title: "076. 最小覆盖子串"
number: 76
difficulty: Hard
tags: ["哈希表", "字符串", "滑动窗口"]
time_complexity: "O(|S| + |T|)"
space_complexity: "O(|S| + |T|)"
leetcode_url: "https://leetcode.cn/problems/minimum-window-substring/"
related: [3, 76]
summary: "可变滑动窗口，用 need/window 双字典和 valid 计数器实现最小覆盖子串。"
starred: false
date: 2024-01-01
---

## 题目描述

给定字符串 s 和 t，找到 s 中涵盖 t 所有字符的最小子串。

## 解题思路

经典滑动窗口。need 字典记录 t 中各字符需求量，valid 计数器记录已满足的字符种类数。右指针扩张直到窗口满足条件，然后左指针收缩找最小窗口。

`valid` 只在 `window[ch] == need[ch]` 时才 +1，这保证了只在"恰好满足"时计数，避免重复字符的干扰。

## 代码实现

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = {}
        for ch in t:
            need[ch] = need.get(ch, 0) + 1
        window = {}
        valid = 0
        left = 0
        start, min_len = 0, float('inf')
        for right, ch in enumerate(s):
            if ch in need:
                window[ch] = window.get(ch, 0) + 1
                if window[ch] == need[ch]:
                    valid += 1
            while valid == len(need):
                if right - left + 1 < min_len:
                    start = left
                    min_len = right - left + 1
                d = s[left]
                left += 1
                if d in need:
                    if window[d] == need[d]:
                        valid -= 1
                    window[d] -= 1
        return "" if min_len == float('inf') else s[start:start + min_len]
```

## 复杂度分析

- **时间复杂度**: O(|S| + |T|)
- **空间复杂度**: O(|S| + |T|)

## 关键要点

- 可变滑动窗口，用 need/window 双字典和 valid 计数器实现最小覆盖子串。


---
title: "438. 找到字符串中所有字母异位词"
number: 438
difficulty: Medium
tags: ["哈希表", "字符串", "滑动窗口"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/find-all-anagrams-in-a-string/"
related: [3, 567]
summary: "固定大小滑动窗口，维护窗口内字符计数与目标字符串对比。"
starred: false
date: 2024-01-01
---

## 题目描述

给定两个字符串 s 和 p，找到 s 中所有 p 的异位词的起始索引。

## 解题思路

固定窗口大小为 `len(p)`，维护窗口内各字符计数，与 p 的计数对比。用 `matches` 计数器追踪匹配的字符种类数，避免每次全量对比。

固定大小的滑动窗口，进一个出一个，用数组代替字典更高效（题目限定小写字母）。

## 代码实现

```python
class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        if len(s) < len(p):
            return []
        need = [0] * 26
        window = [0] * 26
        for ch in p:
            need[ord(ch) - ord('a')] += 1
        for i in range(len(p)):
            window[ord(s[i]) - ord('a')] += 1
        result = []
        if window == need:
            result.append(0)
        for i in range(len(p), len(s)):
            window[ord(s[i]) - ord('a')] += 1
            window[ord(s[i - len(p)]) - ord('a')] -= 1
            if window == need:
                result.append(i - len(p) + 1)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 固定大小滑动窗口，维护窗口内字符计数与目标字符串对比。


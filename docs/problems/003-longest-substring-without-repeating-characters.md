---
title: "003. 无重复字符的最长子串"
number: 3
difficulty: Medium
tags: ["哈希表", "字符串", "滑动窗口"]
time_complexity: "O(n)"
space_complexity: "O(min(n, |Σ|)"
leetcode_url: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/"
related: [76, 438]
summary: "滑动窗口 + 哈希表记录字符位置，遇到重复字符时跳跃式移动左指针。"
starred: false
date: 2024-01-01
---

## 题目描述

给定一个字符串 s，找到不含重复字符的最长子串的长度。

## 解题思路

右指针不断扩张窗口，用字典记录每个字符最新出现的位置。当遇到重复字符时，左指针跳到重复字符的下一位置。

左指针不是一步一步移动，而是直接跳到 `char_idx[ch] + 1`，这是"跳跃式"滑动窗口的核心。

## 代码实现

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_idx = {}
        left = 0
        max_len = 0
        for right, ch in enumerate(s):
            if ch in char_idx and char_idx[ch] >= left:
                left = char_idx[ch] + 1
            char_idx[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(min(n, |Σ|)

## 关键要点

- 滑动窗口 + 哈希表记录字符位置，遇到重复字符时跳跃式移动左指针。


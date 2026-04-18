---
title: "07. 滑动窗口"
description: 用左右两个指针维护窗口，右指针扩张、左指针收缩，在 O(n) 时间内解决子串/子数组问题。
level: intermediate
count: 3
prev: /review/06-binary-tree-basics
next: /review/08-array-advanced
---

# 滑动窗口

> 难度：⭐⭐⭐ | 核心思想：用左右两个指针维护一个"窗口"，右指针扩张、左指针收缩，在 O(n) 时间内解决子串/子数组问题。

## LC3. 无重复字符的最长子串

**题目**：给定一个字符串 s，找到不含重复字符的最长子串的长度。

**思路**：右指针不断扩张窗口，用字典记录每个字符最新出现的位置。当遇到重复字符时，左指针跳到重复字符的下一位置。

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

**复杂度**：时间 O(n)，空间 O(min(n, |Σ|))

**关键点**：左指针不是一步一步移动，而是直接跳到 `char_idx[ch] + 1`，这是"跳跃式"滑动窗口的核心。

---

## LC438. 找到字符串中所有字母异位词

**题目**：给定两个字符串 s 和 p，找到 s 中所有 p 的异位词的起始索引。

**思路**：固定窗口大小为 `len(p)`，维护窗口内各字符计数，与 p 的计数对比。用 `matches` 计数器追踪匹配的字符种类数，避免每次全量对比。

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

**复杂度**：时间 O(n)，空间 O(1)（固定26个字母）

**关键点**：固定大小的滑动窗口，进一个出一个，用数组代替字典更高效（题目限定小写字母）。

---

## LC76. 最小覆盖子串

**题目**：给定字符串 s 和 t，找到 s 中涵盖 t 所有字符的最小子串。

**思路**：经典滑动窗口。need 字典记录 t 中各字符需求量，valid 计数器记录已满足的字符种类数。右指针扩张直到窗口满足条件，然后左指针收缩找最小窗口。

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

**复杂度**：时间 O(|S| + |T|)，空间 O(|S| + |T|)

**关键点**：`valid` 只在 `window[ch] == need[ch]` 时才 +1，这保证了只在"恰好满足"时计数，避免重复字符的干扰。

---

## 总结

| 题目 | 类型 | 核心技巧 |
|------|------|---------|
| LC3 | 可变窗口 | 字符位置映射，跳跃式左指针 |
| LC438 | 固定窗口 | 等长窗口滑动，数组计数 |
| LC76 | 可变窗口 | need/window 双字典 + valid 计数 |

滑动窗口的三要素：**什么时候扩张右指针（一直扩）**、**什么时候收缩左指针（满足条件后）**、**收缩到什么时候停（刚好不满足时）**。

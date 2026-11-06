---
title: "763. 划分字母区间"
number: 763
difficulty: Medium
tags: ["贪心", "哈希表", "字符串"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/partition-labels/"
related: [763]
summary: "预处理每个字符最后出现位置，贪心扩展片段直到覆盖所有字符。"
starred: false
date: 2024-01-01
---

## 题目描述

将字符串 s 划分为尽可能多的片段，同一字母最多出现在一个片段中。

## 解题思路

先遍历一遍记录每个字母最后出现的位置，然后贪心地扩展当前片段——当遍历到当前片段中所有字母的最后位置时，就可以切割。

先预处理每个字符的最后出现位置，然后用贪心保证每个片段包含其内所有字符的完整出现。

## 代码实现

```python
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {ch: i for i, ch in enumerate(s)}
        result = []
        start = 0
        end = 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                result.append(end - start + 1)
                start = i + 1
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 预处理每个字符最后出现位置，贪心扩展片段直到覆盖所有字符。


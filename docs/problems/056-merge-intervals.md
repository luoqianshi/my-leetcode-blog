---
title: "056. 合并区间"
number: 56
difficulty: Medium
tags: ["数组", "排序", "贪心"]
time_complexity: "O(n log n)"
space_complexity: "O(log n)"
leetcode_url: "https://leetcode.cn/problems/merge-intervals/"
related: [56]
summary: "排序后重叠区间变相邻，线性扫描合并即可。"
starred: false
date: 2024-01-01
---

## 题目描述

将所有重叠区间合并。

## 解题思路

先按区间起点排序，然后依次合并——当前区间的起点小于等于上一个区间的终点时，合并（取更大的终点）。

排序后，所有可能重叠的区间都变成相邻的了，只需线性扫描。

## 代码实现

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        if not intervals:
            return []
        intervals.sort(key=lambda x: x[0])
        result = [intervals[0]]
        for start, end in intervals[1:]:
            if start <= result[-1][1]:
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])
        return result
```

## 复杂度分析

- **时间复杂度**: O(n log n)
- **空间复杂度**: O(log n)

## 关键要点

- 排序后重叠区间变相邻，线性扫描合并即可。


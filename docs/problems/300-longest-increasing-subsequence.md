---
title: "300. 最长递增子序列"
number: 300
difficulty: Medium
tags: ["动态规划", "二分查找"]
time_complexity: "O(n log n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/longest-increasing-subsequence/"
related: [300]
summary: "贪心 + 二分，维护 tails 数组记录递增子序列最小末尾。"
starred: false
date: 2024-01-01
---

## 题目描述

给定整数数组 nums，找到最长严格递增子序列的长度。

## 解题思路

维护一个 `tails` 数组，`tails[i]` 表示长度为 i+1 的递增子序列的最小末尾元素。对每个元素，二分查找其在 tails 中的位置并替换。

tails 数组始终保持递增。`bisect_left` 找到第一个 ≥ num 的位置替换，这样可以保证 tails 尽可能小，为后续元素留出更多空间。注意 tails 不一定是真实的最长子序列，但长度是正确的。

## 代码实现

```python
import bisect

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []
        for num in nums:
            pos = bisect.bisect_left(tails, num)
            if pos == len(tails):
                tails.append(num)
            else:
                tails[pos] = num
        return len(tails)
```

## 复杂度分析

- **时间复杂度**: O(n log n)
- **空间复杂度**: O(n)

## 关键要点

- 贪心 + 二分，维护 tails 数组记录递增子序列最小末尾。


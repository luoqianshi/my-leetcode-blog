---
title: "034. 在排序数组中查找元素的第一个和最后一个位置"
number: 34
difficulty: Medium
tags: ["数组", "二分查找"]
time_complexity: "O(log n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/"
related: [35, 34]
summary: "两次二分：lower_bound 找第一个 >= target，upper_bound 找第一个 > target。"
starred: false
date: 2024-01-01
---

## 题目描述

给定升序数组 nums 和目标值，返回目标值在数组中的起始和结束位置。

## 解题思路

两次二分——第一次找左边界（第一个 ≥ target 的位置），第二次找右边界（最后一个 ≤ target 的位置，即第一个 > target 的位置再减一）。

lower_bound 和 upper_bound 是二分的两个基本变体。lower_bound 找 `第一个 ≥ target`，upper_bound 找 `第一个 > target`。两者差一运算符。

## 代码实现

```python
class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        def lower_bound():
            left, right = 0, len(nums)
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid
            return left

        def upper_bound():
            left, right = 0, len(nums)
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid
            return left

        lo = lower_bound()
        hi = upper_bound() - 1
        if lo <= hi:
            return [lo, hi]
        return [-1, -1]
```

## 复杂度分析

- **时间复杂度**: O(log n)
- **空间复杂度**: O(1)

## 关键要点

- 两次二分：lower_bound 找第一个 >= target，upper_bound 找第一个 > target。


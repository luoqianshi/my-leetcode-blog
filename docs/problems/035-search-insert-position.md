---
title: "035. 搜索插入位置"
number: 35
difficulty: Easy
tags: ["数组", "二分查找"]
time_complexity: "O(log n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/search-insert-position/"
related: [34, 35]
summary: "标准二分查找，左闭右开区间，left 即为插入位置。"
starred: false
date: 2024-01-01
---

## 题目描述

给定排序数组和一个目标值，返回目标值应插入的位置。如果目标已存在，返回其索引。

## 解题思路

标准二分，最终 left 就是第一个大于等于 target 的位置。

`right = len(nums)` 而非 `len(nums) - 1`，用左闭右开区间 `[left, right)`，这样 left 自然就是插入位置。

## 代码实现

```python
class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left
```

## 复杂度分析

- **时间复杂度**: O(log n)
- **空间复杂度**: O(1)

## 关键要点

- 标准二分查找，左闭右开区间，left 即为插入位置。


---
title: "283. 移动零"
number: 283
difficulty: Easy
tags: ["数组", "双指针`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/move-zeroes/"
related: [283]
summary: "这道题是快慢指针的经典入门题。维护两个指针：慢指针 slow 指向\"下一个非零元素应该放置的位置\"，快指针 fast 遍历整个数组。当 fast 遇到非零元素时..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。请注意，必须在不复制数组的情况下原地对数组进行操作。

## 解题思路

这道题是快慢指针的经典入门题。维护两个指针：慢指针 slow 指向"下一个非零元素应该放置的位置"，快指针 fast 遍历整个数组。当 fast 遇到非零元素时，将其与 slow 位置的元素交换，然后 slow 前进一步。这样，slow 始终指向已处理区域的末尾（即最后一个非零元素的下一个位置）。遍历结束后，slow 之后的所有元素自然都是 0。

## 代码实现

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != 0:
                nums[slow], nums[fast] = nums[fast], nums[slow]
                slow += 1
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



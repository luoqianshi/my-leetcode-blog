---
title: "033. 搜索旋转排序数组"
number: 33
difficulty: Medium
tags: ["数组", "二分查找"]
time_complexity: "O(log n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/search-in-rotated-sorted-array/"
related: [81, 33]
summary: "旋转数组仍满足一半有序，先判断哪半有序再缩小范围。"
starred: false
date: 2024-01-01
---

## 题目描述

数组在某个未知的枢轴点被旋转，搜索给定的目标值。

## 解题思路

旋转数组仍然满足"一半有序"的性质。每次判断 mid 落在有序的哪一半，再确定 target 在哪一半。

虽然整体无序，但旋转后的数组总是"一半有序、一半无序"的。先判断哪半有序，再判断 target 是否在有序的那半。

## 代码实现

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            # 左半有序
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            # 右半有序
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1
```

## 复杂度分析

- **时间复杂度**: O(log n)
- **空间复杂度**: O(1)

## 关键要点

- 旋转数组仍满足一半有序，先判断哪半有序再缩小范围。


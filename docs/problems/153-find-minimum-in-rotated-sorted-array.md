---
title: "153. 寻找旋转排序数组中的最小值"
number: 153
difficulty: Medium
tags: ["数组", "二分查找"]
time_complexity: "O(log n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/"
related: [33, 34]
summary: "与右端点比较的二分：nums[mid] > nums[right] 说明最小值在右半段，否则在左半段（含 mid），收缩到重合即答案。"
starred: false
date: 2026-09-16
---

## 题目描述

已知一个长度为 n 的数组，预先按照升序排列，并经由 1 到 n 次旋转后得到。请找出并返回数组中的最小值。要求 O(log n) 时间。数组元素互不相同。

## 解题思路

旋转后的数组由两段升序子数组拼接而成，最小值是"第二段的开头"。**与右端点 nums[right] 比较**（而不是与 left 或 target 比较）：

- `nums[mid] > nums[right]`：mid 落在第一段（大值段），最小值一定在 mid 右侧 → `left = mid + 1`；
- `nums[mid] < nums[right]`：mid 落在第二段（含最小值），mid 本身可能就是最小 → `right = mid`（保守收缩，不跳过）。

left == right 时区间收敛到最小值。

为什么和右端点比：和左端点比无法区分"数组未旋转"与"mid 在第一段"两种情况（都满足 nums[mid] > nums[left]）。

## 代码实现

```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:   # mid 在前半段，最小值在右侧
                left = mid + 1
            else:                          # mid 在后半段，mid 可能就是最小
                right = mid
        return nums[left]
```

## 复杂度分析

- **时间复杂度**: O(log n)
- **空间复杂度**: O(1)

## 关键要点

- 与 33 题（旋转数组搜 target）同源，但本题用**值比较定位断崖**：断崖右侧即最小值所在段。
- `right = mid` 而非 `right = mid - 1`：mid 可能恰是最小值，不能越过。
- 未旋转数组（如 [1,2,3]）下 nums[mid] < nums[right] 恒成立，区间一直向左收缩，最终返回 nums[0]，自然兼容。

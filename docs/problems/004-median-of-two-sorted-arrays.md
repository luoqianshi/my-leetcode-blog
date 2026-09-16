---
title: "004. 寻找两个正序数组的中位数"
number: 4
difficulty: Hard
tags: ["数组", "二分查找"]
time_complexity: "O(log(min(m, n)))"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/median-of-two-sorted-arrays/"
related: [33, 153]
summary: "在较短数组上二分分割线位置，利用交叉不等式将两数组合并的中位数问题转化为分割线查找问题。"
starred: false
date: 2026-09-16
---

## 题目描述

给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请找出并返回这两个正序数组的中位数。要求算法的时间复杂度为 O(log(m+n))。

## 解题思路

中位数的本质是**把所有元素划分成左右两部分**：左边有 (m+n+1)//2 个元素，且左半部分的最大值 ≤ 右半部分的最小值。

在较短数组 nums1 上二分分割线位置 `i`，则 nums2 的分割线自动确定为 `j = half - i`（half 为左半部分总数）。分割合法需满足交叉不等式：

- `nums1[i-1] <= nums2[j]`（上左 ≤ 下右）
- `nums2[j-1] <= nums1[i]`（下左 ≤ 上右）

若 `nums1[i-1] > nums2[j]` 说明 i 太大，左移右边界；否则右移左边界。边界处用 ±∞ 哨兵处理。始终对较短的数组二分，保证 j 非负。

- 总长为奇数：中位数 = 左半部分的最大值
- 总长为偶数：中位数 = (左半最大值 + 右半最小值) / 2

## 代码实现

```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # 始终在较短的数组上二分，保证 j = half - i 不越界
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2  # 左半部分的元素总数
        left, right = 0, m
        while left <= right:
            i = (left + right) // 2      # nums1 的分割线（左半取 nums1[:i]）
            j = half - i                 # nums2 的分割线（左半取 nums2[:j]）
            a_left = nums1[i - 1] if i > 0 else float('-inf')
            a_right = nums1[i] if i < m else float('inf')
            b_left = nums2[j - 1] if j > 0 else float('-inf')
            b_right = nums2[j] if j < n else float('inf')
            if a_left <= b_right and b_left <= a_right:
                if (m + n) % 2:
                    return float(max(a_left, b_left))
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            elif a_left > b_right:
                right = i - 1
            else:
                left = i + 1
```

## 复杂度分析

- **时间复杂度**: O(log(min(m, n)))，只对较短数组二分
- **空间复杂度**: O(1)

## 关键要点

- 中位数 ⟺ 一条把所有元素分成"左多右少且左大 ≤ 右小"的分割线，两数组的合并问题被降维成"找分割线"问题。
- `half = (m+n+1)//2` 的 +1 保证奇数长度时左半部分多一个元素，中位数直接取左半最大值。
- 边界哨兵 ±∞ 是关键技巧：分割线贴边（i=0 或 i=m）时避免越界判断分支。
- 对较短数组二分：若对较长数组二分，j 可能为负，还需额外分类讨论。

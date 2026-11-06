---
title: "075. 颜色分类"
number: 75
difficulty: Medium
tags: ["数组", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/sort-colors/"
related: [283, 31]
summary: "三指针（荷兰国旗问题）：p0 收集 0、p2 收集 2、i 扫描，交换到 p2 的未知数不能前进需要重判。"
starred: false
date: 2026-09-16
---

## 题目描述

给定一个包含红色、白色和蓝色（分别用 0、1、2 表示）的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按 0、1、2 顺序排列。必须使用一趟扫描的原地算法。

## 解题思路

经典的**荷兰国旗问题**。维护三个指针：

- `p0`：下一个 0 应放的位置（左边界），左侧全是 0
- `p2`：下一个 2 应放的位置（右边界），右侧全是 2
- `i`：当前扫描位置，`[p0, i]` 之间是 1 或未处理区域

分三种情况：

1. `nums[i] == 0`：与 p0 交换后 i 前进——因为换过来的一定是 1（区间 [p0, i) 已保证全为 1），安全；
2. `nums[i] == 1`：跳过，i 前进；
3. `nums[i] == 2`：与 p2 交换后 **i 不前进**——从右侧换来的可能是 0、1、2 中任何值，必须重新判一遍。p2 左移。

循环条件是 `i <= p2`：越过 p2 说明未处理区已空。

## 代码实现

```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        p0, i, p2 = 0, 0, len(nums) - 1
        while i <= p2:
            if nums[i] == 0:
                nums[i], nums[p0] = nums[p0], nums[i]
                p0 += 1
                i += 1
            elif nums[i] == 2:
                nums[i], nums[p2] = nums[p2], nums[i]
                p2 -= 1                # 换来的数未知，i 原地重判
            else:
                i += 1
```

## 复杂度分析

- **时间复杂度**: O(n)，一趟扫描
- **空间复杂度**: O(1)

## 关键要点

- 为什么交换 0 后 i 能安全前进：[p0, i) 区间维护的不变式是"全为 1"，从 p0 换来的只可能是 1（或自身），无需重判。
- 为什么交换 2 后 i 不能前进：p2 右侧只保证"全为 2"，换过来的数完全未知。
- 循环条件用 `i <= p2` 而非 `i < n`：i > p2 时未处理区为空，继续扫会破坏已放好的 2。
- 本题是三向快速排序（3-way partition）处理大量重复元素的单趟核心，快排中用于把等于 pivot 的区段一次排掉。

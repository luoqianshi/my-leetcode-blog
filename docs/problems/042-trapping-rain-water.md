---
title: "042. 接雨水"
number: 42
difficulty: Hard
tags: ["数组", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/trapping-rain-water/"
related: [11, 84]
summary: "对向双指针：每个位置能接的水由两侧最大高度的较小者决定，移动较矮一侧可安全地边走边结算。"
starred: false
date: 2026-09-16
---

## 题目描述

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

## 解题思路

位置 i 能接的水 = `min(左侧最大高度, 右侧最大高度) - height[i]`（非负）。

朴素做法对每个位置两侧扫描求最大值，O(n²)；预处理两个数组（left_max / right_max）可降到 O(n) 空间。**双指针法**进一步压到 O(1)：

维护 `left`、`right` 对向移动，`left_max`、`right_max` 分别记录两侧扫过的最大值。核心推理：

> 若 `height[left] < height[right]`，则右侧至少存在一个比 height[left] 高的柱子，所以 `left_max < right_max` 必然成立与否不重要——**位置 left 的水只由 left_max 决定**（瓶颈在较短的一侧）。

于是移动较矮一侧：`water += left_max - height[left]`（若 height[left] 本身更高则更新 left_max），结算后指针前移。

## 代码实现

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = 0
        water = 0
        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max:
                    left_max = height[left]   # 更新左侧最大值
                else:
                    water += left_max - height[left]  # 瓶颈在左侧，可结算
                left += 1
            else:
                if height[right] >= right_max:
                    right_max = height[right]
                else:
                    water += right_max - height[right]  # 瓶颈在右侧，可结算
                right -= 1
        return water
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 木桶效应：一个位置的水位由**两侧最大值中较小的一方**决定，双指针法每次结算的都是"确定已知瓶颈"的那一侧。
- `height[left] < height[right]` 只用于决定移动方向，并不直接参与水位计算——它保证了右侧一定有更高的柱子兜底。
- 三种解法梯度：暴力 O(n²) → DP 预处理 O(n) 空间 → 双指针 O(1) 空间，是"空间换时间→再换回来"的经典演进案例。
- 同类题：11 题盛水容器也是对向双指针，但那题移动较短边是为了"贪心保留更大宽高乘积的可能"，本题是"安全结算已知答案"，移动理由不同。

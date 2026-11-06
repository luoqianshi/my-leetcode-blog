---
title: "084. 柱状图中最大的矩形"
number: 84
difficulty: Hard
tags: ["栈", "单调栈"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/largest-rectangle-in-histogram/"
related: [42, 239]
summary: "单调递增栈：每根柱子在出栈瞬间确定自己能左右扩展的边界，以它为高的最大矩形即刻结算。"
starred: false
date: 2026-09-16
---

## 题目描述

给定 n 个非负整数表示柱状图中各柱子的高度（宽度均为 1），求能在该柱状图中勾勒出的矩形的最大面积。

## 解题思路

枚举每根柱子作为**矩形的高度**，则该矩形的左右边界分别是：

- 左边界：左边第一个**严格小于**它的柱子（再左就装不下了）
- 右边界：右边第一个**小于等于**它的柱子

维护**单调递增栈**（存下标）：当前柱 `h` 比栈顶柱矮时，栈顶柱的右边界确定了——就是当前下标 i；左边界是弹出后的新栈顶（前一个更矮的柱子）。宽度 = `i - stack[-1] - 1`（弹空则为 i）。

在 heights 末尾追加哨兵 0，强制所有柱子最终出栈结算，避免循环后残留清理。

## 代码实现

```python
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []                     # 存下标，对应高度单调递增
        max_area = 0
        for i, h in enumerate(heights + [0]):   # 哨兵 0 强制清栈
            while stack and heights[stack[-1]] >= h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
        return max_area
```

## 复杂度分析

- **时间复杂度**: O(n)，每个下标各入栈、出栈一次
- **空间复杂度**: O(n)

## 关键要点

- 单调栈的本质：**以每个元素为"极值中心"时求它左右能扩展多远**，出栈瞬间恰好两个边界都已知。
- 栈里存下标而非高度——宽度计算需要位置信息。
- 哨兵技巧：末尾补 0（也可以首尾都补）让所有柱子必然出栈，循环结束栈必空，省去收尾处理。
- 相等高度的处理：`>=` 出栈保证等高柱子也能结算（宽度可能略保守但面积正确），不影响最大值。
- 与 42 题接雨水互为镜像：接雨水找两侧**更高**的柱子（单调递减栈），本题找两侧**更矮**的柱子（单调递增栈）。

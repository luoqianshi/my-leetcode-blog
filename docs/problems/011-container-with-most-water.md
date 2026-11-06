---
title: "011. 盛最多水的容器"
number: 11
difficulty: Medium
tags: ["贪心", "数组", "双指针`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/container-with-most-water/"
related: [42, 11]
summary: "容器盛水量 = min(左高, 右高) × 宽度。使用对向双指针，左指针从最左端开始，右指针从最右端开始，每次计算当前盛水量并更新最大值。关键决策：移动哪端的指..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个长度为 n 的整数数组 height。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。

## 解题思路

容器盛水量 = min(左高, 右高) × 宽度。使用对向双指针，左指针从最左端开始，右指针从最右端开始，每次计算当前盛水量并更新最大值。关键决策：移动哪端的指针？贪心策略是移动较短的那端。原因：盛水量由短板决定，宽度在不断缩小，如果移动长板端，由于高度只可能变小或不变，盛水量不可能增大；而移动短板端，虽然宽度减小，但高度可能增大，盛水量才有机会增加。这个贪心策略的正确性可以严格证明。

## 代码实现

```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        max_water = 0
        while left < right:
            width = right - left
            h = min(height[left], height[right])
            max_water = max(max_water, width * h)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_water
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



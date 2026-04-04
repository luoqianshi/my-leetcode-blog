---
title: "054. 螺旋矩阵"
number: 54
difficulty: Medium
tags: ["数组", "矩阵", "模拟"]
time_complexity: "O(m×n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/spiral-matrix/"
related: [59, 54]
summary: "四边界收缩法，右 -> 下 -> 左 -> 上逐层遍历。"
starred: false
date: 2024-01-01
---

## 题目描述

给定 m×n 矩阵，按顺时针螺旋顺序返回所有元素。

## 解题思路

定义上下左右四个边界，逐层向内遍历。每次遍历完一条边后收缩对应边界。

四条边的遍历顺序：右 → 下 → 左 → 上。每次遍历后收缩边界。注意向左和向上遍历前需要检查边界是否仍然合法（防止重复遍历单行/单列）。

## 代码实现

```python
class Solution:
    def spiralOrder(self, matrix):
        if not matrix:
            return []
        m, n = len(matrix), len(matrix[0])
        top, bottom = 0, m - 1
        left, right = 0, n - 1
        result = []
        while top <= bottom and left <= right:
            # 从左到右
            for j in range(left, right + 1):
                result.append(matrix[top][j])
            top += 1
            # 从上到下
            for i in range(top, bottom + 1):
                result.append(matrix[i][right])
            right -= 1
            # 从右到左
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    result.append(matrix[bottom][j])
                bottom -= 1
            # 从下到上
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    result.append(matrix[i][left])
                left += 1
        return result
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(1)

## 关键要点

- 四边界收缩法，右 -> 下 -> 左 -> 上逐层遍历。


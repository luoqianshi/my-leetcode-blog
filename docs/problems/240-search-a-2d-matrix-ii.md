---
title: "240. 搜索二维矩阵 II"
number: 240
difficulty: Medium
tags: ["数组", "矩阵", "二分查找"]
time_complexity: "O(m + n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/search-a-2d-matrix-ii/"
related: [74, 240]
summary: "从右上角开始搜索，每步排除一行或一列。"
starred: false
date: 2024-01-01
---

## 题目描述

在一个 m×n 矩阵中，每行从左到右升序，每列从上到下升序。判断目标值是否存在。

## 解题思路

从右上角开始搜索。如果当前值 > target，向左走（减小）；如果当前值 < target，向下走（增大）。

从右上角（或左下角）开始是关键——这两个位置能同时利用行和列的有序性。从左上角或右下角无法做到同时缩小搜索范围。

## 代码实现

```python
class Solution:
    def searchMatrix(self, matrix, target):
        if not matrix:
            return False
        m, n = len(matrix), len(matrix[0])
        i, j = 0, n - 1  # 右上角
        while i < m and j >= 0:
            if matrix[i][j] == target:
                return True
            elif matrix[i][j] > target:
                j -= 1  # 向左
            else:
                i += 1  # 向下
        return False
```

## 复杂度分析

- **时间复杂度**: O(m + n)
- **空间复杂度**: O(1)

## 关键要点

- 从右上角开始搜索，每步排除一行或一列。


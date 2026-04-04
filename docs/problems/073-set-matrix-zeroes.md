---
title: "073. 矩阵置零"
number: 73
difficulty: Medium
tags: ["数组", "矩阵"]
time_complexity: "O(m×n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/set-matrix-zeroes/"
related: [73]
summary: "复用矩阵首行首列作为标记数组，原地 O(1) 空间。"
starred: false
date: 2024-01-01
---

## 题目描述

给定一个 m×n 矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。必须原地操作。

## 解题思路

用矩阵的第一行和第一列作为标记数组，避免使用额外空间。需要先处理第一行和第一列本身是否有 0。

原地标记的核心技巧——复用矩阵的第一行和第一列。需要注意先标记再置零的顺序，避免标记信息被覆盖。必须单独处理第一行和第一列的初始零。

## 代码实现

```python
class Solution:
    def setZeroes(self, matrix):
        m, n = len(matrix), len(matrix[0])
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))

        # 用第一行和第一列标记
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        # 根据标记置零
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0

        # 处理第一行和第一列
        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0
```

## 复杂度分析

- **时间复杂度**: O(m×n)
- **空间复杂度**: O(1)

## 关键要点

- 复用矩阵首行首列作为标记数组，原地 O(1) 空间。


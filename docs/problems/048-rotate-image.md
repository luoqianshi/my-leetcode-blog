---
title: "048. 旋转图像"
number: 48
difficulty: Medium
tags: ["数组", "矩阵", "数学"]
time_complexity: "O(n²)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/rotate-image/"
related: [48]
summary: "顺时针 90 度 = 转置 + 水平翻转。"
starred: false
date: 2024-01-01
---

## 题目描述

将 n×n 矩阵顺时针旋转 90 度。必须原地操作。

## 解题思路

先沿主对角线转置（行列互换），再水平翻转每行。

```
转置：matrix[i][j] ↔ matrix[j][i]
水平翻转：matrix[i][j] ↔ matrix[i][n-1-j]
```

顺时针 90° = 转置 + 水平翻转。逆时针 90° = 转置 + 垂直翻转。也可以原地逐层交换四个位置：`matrix[i][j] → matrix[j][n-1-i] → matrix[n-1-i][n-1-j] → matrix[n-1-j][i]`。

## 代码实现

```python
class Solution:
    def rotate(self, matrix):
        n = len(matrix)
        # 转置
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        # 水平翻转
        for i in range(n):
            matrix[i].reverse()
```

## 复杂度分析

- **时间复杂度**: O(n²)
- **空间复杂度**: O(1)

## 关键要点

- 顺时针 90 度 = 转置 + 水平翻转。


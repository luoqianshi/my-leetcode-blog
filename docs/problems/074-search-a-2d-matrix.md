---
title: "074. 搜索二维矩阵"
number: 74
difficulty: Medium
tags: ["数组", "矩阵", "二分查找"]
time_complexity: "O(log(mn)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/search-a-2d-matrix/"
related: [240, 74]
summary: "将二维矩阵降维为一维有序数组，二分查找时做坐标映射。"
starred: false
date: 2024-01-01
---

## 题目描述

每行从左到右升序，每行第一个数大于上一行最后一个数。搜索目标值。

## 解题思路

把二维矩阵"展平"看成一维有序数组，二分查找。`mid` 对应矩阵中 `(mid // n, mid % n)` 的位置。

二维坐标映射——一维下标 `mid` 对应 `(mid // n, mid % n)`。这是降维思想在二分中的应用。

## 代码实现

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1
        while left <= right:
            mid = left + (right - left) // 2
            val = matrix[mid // n][mid % n]
            if val == target:
                return True
            elif val < target:
                left = mid + 1
            else:
                right = mid - 1
        return False
```

## 复杂度分析

- **时间复杂度**: O(log(mn)
- **空间复杂度**: O(1)

## 关键要点

- 将二维矩阵降维为一维有序数组，二分查找时做坐标映射。


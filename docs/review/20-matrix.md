---
title: "20. 矩阵操作"
description: 二维空间上的算法应用，包括旋转、搜索、螺旋遍历等，考察对二维数组的精细操作能力。
level: advanced
count: 4
prev: /review/19-dp-advanced
next: false
---

# 矩阵操作

> 难度：⭐⭐⭐⭐ | 核心思想：矩阵问题是二维空间上的算法应用，包括旋转、搜索、螺旋遍历等，考察对二维数组的精细操作能力。

## LC73. 矩阵置零

**题目**：给定一个 m×n 矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。必须原地操作。

**思路**：用矩阵的第一行和第一列作为标记数组，避免使用额外空间。需要先处理第一行和第一列本身是否有 0。

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

**复杂度**：时间 O(m×n)，空间 O(1)

**关键点**：原地标记的核心技巧——复用矩阵的第一行和第一列。需要注意先标记再置零的顺序，避免标记信息被覆盖。必须单独处理第一行和第一列的初始零。

---

## LC54. 螺旋矩阵

**题目**：给定 m×n 矩阵，按顺时针螺旋顺序返回所有元素。

**思路**：定义上下左右四个边界，逐层向内遍历。每次遍历完一条边后收缩对应边界。

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

**复杂度**：时间 O(m×n)，空间 O(1)（不计输出数组）

**关键点**：四条边的遍历顺序：右 → 下 → 左 → 上。每次遍历后收缩边界。注意向左和向上遍历前需要检查边界是否仍然合法（防止重复遍历单行/单列）。

---

## LC48. 旋转图像

**题目**：将 n×n 矩阵顺时针旋转 90 度。必须原地操作。

**思路**：先沿主对角线转置（行列互换），再水平翻转每行。

```
转置：matrix[i][j] ↔ matrix[j][i]
水平翻转：matrix[i][j] ↔ matrix[i][n-1-j]
```

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

**复杂度**：时间 O(n²)，空间 O(1)

**关键点**：顺时针 90° = 转置 + 水平翻转。逆时针 90° = 转置 + 垂直翻转。也可以原地逐层交换四个位置：`matrix[i][j] → matrix[j][n-1-i] → matrix[n-1-i][n-1-j] → matrix[n-1-j][i]`。

---

## LC240. 搜索二维矩阵 II

**题目**：在一个 m×n 矩阵中，每行从左到右升序，每列从上到下升序。判断目标值是否存在。

**思路**：从右上角开始搜索。如果当前值 > target，向左走（减小）；如果当前值 < target，向下走（增大）。

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

**复杂度**：时间 O(m + n)，空间 O(1)

**关键点**：从右上角（或左下角）开始是关键——这两个位置能同时利用行和列的有序性。从左上角或右下角无法做到同时缩小搜索范围。

---

## 总结

| 题目 | 核心技巧 | 难度 |
|------|---------|------|
| LC73 | 原地标记（复用首行首列） | 中等 |
| LC54 | 四边界收缩法 | 中等 |
| LC48 | 转置 + 翻转 | 中等 |
| LC240 | 右上角起点搜索 | 中等 |

矩阵问题的解题策略：
1. **旋转类**：掌握"转置 + 翻转"的组合技巧
2. **遍历类**：螺旋遍历用四边界法，注意边界收缩和去重检查
3. **搜索类**：利用矩阵的有序性选择合适的起点，每步能排除一行或一列
4. **标记类**：需要 O(1) 空间时考虑复用矩阵本身（首行首列作为标记数组）

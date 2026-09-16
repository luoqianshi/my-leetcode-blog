---
title: "118. 杨辉三角"
number: 118
difficulty: Easy
tags: ["数组", "动态规划"]
time_complexity: "O(n²)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/pascals-triangle/"
related: [70, 62]
summary: "每一行由上一行推出：首尾补 1，中间元素 = 上一行相邻两数之和，滚动生成即可。"
starred: false
date: 2026-09-16
---

## 题目描述

给定非负整数 numRows，生成"杨辉三角"的前 numRows 行。杨辉三角中，每个数是它左上方和右上方的数的和。

## 解题思路

杨辉三角的递推关系：`第 i 行的第 j 个数 = 第 i-1 行第 j-1 个数 + 第 i-1 行第 j 个数`，首尾恒为 1。

用滚动方式生成：维护当前行 row，每生成完一行就存入结果，再由当前行推下一行：

```python
next_row = [1] + [row[i] + row[i+1] for i in range(len(row)-1)] + [1]
```

首尾拼 1，中间用相邻对求和（zip 的思路），一行搞定。

这也是组合数的递推：第 n 行的第 k 个数是 C(n-1, k-1) = C(n-2, k-2) + C(n-2, k-1)（帕斯卡恒等式）。

## 代码实现

```python
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        result = []
        row = [1]
        for _ in range(numRows):
            result.append(row)
            # 由当前行推下一行：首尾补 1，中间为相邻元素之和
            row = [1] + [row[i] + row[i + 1] for i in range(len(row) - 1)] + [1]
        return result
```

## 复杂度分析

- **时间复杂度**: O(n²)，前 n 行的元素总数为 n(n+1)/2
- **空间复杂度**: O(1)，不计输出空间（滚动数组仅一行）

## 关键要点

- 列表拼接表达式 `[1] + [相邻和] + [1]` 是 Python 的惯用法，等价于先建全 1 数组再内部覆盖，但更简洁。
- `row` 被存入 result 后再派生新 row，原行不会被修改——注意 `append(row)` 后必须重新赋值 row 而不是原地改。
- 杨辉三角第 n 行就是 (a+b)^n 的展开系数，也是组合数 C(n, k)，与 62 题不同路径的数学背景相通。

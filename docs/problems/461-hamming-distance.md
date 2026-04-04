---
title: "461. 汉明距离"
number: 461
difficulty: Easy
tags: ["位运算`"]
time_complexity: "O(1)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/hamming-distance/"
related: []
summary: "汉明距离问题分两步走。第一步，异或：`x ^ y` 会将两个数中不同的位标记为 1、相同的位标记为 0，因此问题转化为「统计异或结果中 1 的个数」。第二步，统..."
starred: false
date: 2024-01-01
---

## 题目描述

两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。给你两个整数 x 和 y，计算并返回它们之间的汉明距离。

## 解题思路

汉明距离问题分两步走。第一步，异或：`x ^ y` 会将两个数中不同的位标记为 1、相同的位标记为 0，因此问题转化为「统计异或结果中 1 的个数」。第二步，统计 1 的个数：最朴素的方法是逐位右移检查，但更优雅的做法是 Brian Kernighan 算法——核心操作 `n & (n - 1)` 每次执行都会把 n 的二进制表示中最右边的 1 变成 0。原理在于：`n - 1` 会将最右边的 1 及其之后的所有位全部取反，再与原数做与运算，恰好消去最右边的 1。因此循环执行该操作直到 n 变为 0，执行次数就是 1 的个数。相比逐位检查的 O(log n)，Brian Kernighan 只需 O(k)（k 为 1 的个数），在 1 较少时效率更高。

## 代码实现

```python
class Solution:
    def hammingDistance(self, x: int, y: int) -> int:
        xor = x ^ y
        distance = 0
        while xor:
            xor &= xor - 1  # Brian Kernighan: 消除最右边的1
            distance += 1
        return distance
```

## 复杂度分析

- **时间复杂度**: O(1)
- **空间复杂度**: O(1)

## 关键要点



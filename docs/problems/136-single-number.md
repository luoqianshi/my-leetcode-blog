---
title: "136. 只出现一次的数字"
number: 136
difficulty: Easy
tags: ["位运算`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/single-number/"
related: []
summary: "这道题的突破口在于「其余每个元素均出现两次」这个特殊条件，它天然暗示了异或（XOR）运算。异或的核心性质有三条：(1) `a ^ a = 0`——任何数与自身异..."
starred: false
date: 2024-01-01
---

## 题目描述

给你一个非空整数数组 nums，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。

## 解题思路

这道题的突破口在于「其余每个元素均出现两次」这个特殊条件，它天然暗示了异或（XOR）运算。异或的核心性质有三条：(1) `a ^ a = 0`——任何数与自身异或结果为零；(2) `a ^ 0 = a`——任何数与零异或结果不变；(3) 异或满足交换律和结合律。基于这三条性质，将数组中所有元素依次异或，出现两次的数会两两抵消为 0，最终结果就是那个只出现一次的数。例如 `[4,1,2,1,2]` → `4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4`。

## 代码实现

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for num in nums:
            result ^= num
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



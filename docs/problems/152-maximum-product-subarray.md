---
title: "152. 乘积最大子数组"
number: 152
difficulty: Medium
tags: ["动态规划", "数组"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/maximum-product-subarray/"
related: [53, 152]
summary: "同时维护最大乘积和最小乘积，负数时交换两者。"
starred: false
date: 2024-01-01
---

## 题目描述

给定整数数组 nums，找出乘积最大的非空连续子数组并返回其乘积。

## 解题思路

由于负数乘以负数变正数，需要同时维护当前最大乘积和最小乘积。遇到负数时，最大值和最小值交换。

与 LC53（最大子数组和）的区别在于乘法有负数翻转效应。当 num < 0 时，之前的最大正积乘以负数变成最小值，之前的最小负积乘以负数变成最大值，因此需要交换 max_prod 和 min_prod。

## 代码实现

```python
class Solution:
    def maxProduct(self, nums):
        max_prod = min_prod = result = nums[0]
        for num in nums[1:]:
            if num < 0:
                max_prod, min_prod = min_prod, max_prod
            max_prod = max(num, max_prod * num)
            min_prod = min(num, min_prod * num)
            result = max(result, max_prod)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 同时维护最大乘积和最小乘积，负数时交换两者。


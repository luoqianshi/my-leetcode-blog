---
title: "238. 除自身以外数组的乘积"
number: 238
difficulty: Medium
tags: ["数组", "前缀和"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/product-of-array-except-self/"
related: [238]
summary: "前缀积 + 后缀积，两次线性遍历代替暴力乘法，空间优化到 O(1)。"
starred: false
date: 2024-01-01
---

## 题目描述

给定数组 nums，返回数组 answer，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。不能用除法。

## 解题思路

两次遍历——第一次从左到右记录每个位置左侧所有元素的乘积，第二次从右到左乘上右侧所有元素的乘积。

前缀积 + 后缀积的思想，两次线性遍历代替了一次 O(n^2) 的暴力计算。空间优化到 O(1) 的关键是复用输出数组。

## 代码实现

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        answer = [1] * n
        # 左侧乘积
        left = 1
        for i in range(n):
            answer[i] = left
            left *= nums[i]
        # 右侧乘积
        right = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= right
            right *= nums[i]
        return answer
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 前缀积 + 后缀积，两次线性遍历代替暴力乘法，空间优化到 O(1)。


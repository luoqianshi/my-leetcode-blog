---
title: "053. 最大子数组和"
number: 53
difficulty: Medium
tags: ["数组", "分治", "动态规划"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/maximum-subarray/"
related: [152, 53]
summary: "Kadane 算法，维护以当前位置结尾的最大子数组和，负前缀不如重新开始。"
starred: false
date: 2024-01-01
---

## 题目描述

给定整数数组 nums，找到和最大的连续子数组，返回其和。

## 解题思路

动态规划，dp[i] 表示以 nums[i] 结尾的最大子数组和。如果前一个状态为负，不如从当前重新开始。

Kadane 算法的精髓——`dp = max(dp + nums[i], nums[i])`，即"带着前缀走"还是"从零开始"的抉择。

## 代码实现

```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        dp = nums[0]
        result = nums[0]
        for i in range(1, len(nums)):
            dp = max(dp + nums[i], nums[i])
            result = max(result, dp)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- Kadane 算法，维护以当前位置结尾的最大子数组和，负前缀不如重新开始。


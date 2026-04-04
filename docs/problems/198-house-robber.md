---
title: "198. 打家劫舍"
number: 198
difficulty: Medium
tags: ["动态规划", "数组"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/house-robber/"
related: [213, 198]
summary: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])，抢或不抢的二选一。"
starred: false
date: 2024-01-01
---

## 题目描述

不能偷相邻的两间房屋，求能偷到的最高金额。

## 解题思路

到第 i 间房屋时，两个选择：偷（加上 i-2 的最大金额）或不偷（取 i-1 的最大金额）。

`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`——"抢当前"vs"不抢当前"的二选一。

## 代码实现

```python
class Solution:
    def rob(self, nums: list[int]) -> int:
        if not nums:
            return 0
        if len(nums) <= 2:
            return max(nums)
        a, b = nums[0], max(nums[0], nums[1])
        for i in range(2, len(nums)):
            a, b = b, max(b, a + nums[i])
        return b
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- dp[i] = max(dp[i-1], dp[i-2] + nums[i])，抢或不抢的二选一。


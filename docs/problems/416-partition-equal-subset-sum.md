---
title: "416. 分割等和子集"
number: 416
difficulty: Medium
tags: ["动态规划", "背包问题"]
time_complexity: "O(n × target)"
space_complexity: "O(target)"
leetcode_url: "https://leetcode.cn/problems/partition-equal-subset-sum/"
related: [416]
summary: "0-1 背包，判断能否选出和为 sum/2 的子集。"
starred: false
date: 2024-01-01
---

## 题目描述

给定一个只包含正整数的非空数组，判断是否可以将其分割成两个子集，使得两个子集的元素和相等。

## 解题思路

等价于 0-1 背包问题——能否从数组中选出若干数使其和等于 target = sum / 2。`dp[j]` 表示能否凑出和为 j。

0-1 背包的经典应用。从后往前遍历确保每个数字只使用一次（如果从前往后遍历，同一数字可能被重复使用，变成完全背包）。`dp[j] = dp[j] or dp[j - num]` 表示"不选当前数"或"选当前数"。

## 代码实现

```python
class Solution:
    def canPartition(self, nums):
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            # 从后往前遍历，避免重复使用
            for j in range(target, num - 1, -1):
                dp[j] = dp[j] or dp[j - num]
        return dp[target]
```

## 复杂度分析

- **时间复杂度**: O(n × target)
- **空间复杂度**: O(target)

## 关键要点

- 0-1 背包，判断能否选出和为 sum/2 的子集。


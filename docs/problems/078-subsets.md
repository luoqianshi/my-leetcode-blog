---
title: "078. 子集"
number: 78
difficulty: Medium
tags: ["回溯", "数组", "位运算"]
time_complexity: "O(n × 2^n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/subsets/"
related: [90, 78]
summary: "回溯收集所有子集，每个中间状态都是合法子集，用 start 参数避免重复。"
starred: false
date: 2024-01-01
---

## 题目描述

给定不含重复元素的整数数组 nums，返回所有可能的子集。

## 解题思路

与全排列不同，子集不需要"选满"才收集答案——每一个中间状态都是一个合法子集。

`start` 参数确保不重复选择前面的元素（避免 `[1,2]` 和 `[2,1]` 同时出现）。每个节点都是答案，区别于排列问题只在叶子节点收集。

## 代码实现

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []

        def backtrack(start):
            result.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()

        backtrack(0)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n × 2^n)
- **空间复杂度**: O(n)

## 关键要点

- 回溯收集所有子集，每个中间状态都是合法子集，用 start 参数避免重复。


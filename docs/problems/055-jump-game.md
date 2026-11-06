---
title: "055. 跳跃游戏"
number: 55
difficulty: Medium
tags: ["贪心", "数组", "动态规划"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/jump-game/"
related: [45, 55]
summary: "维护最远可达位置，遍历过程中判断当前位置是否可达。"
starred: false
date: 2024-01-01
---

## 题目描述

给定非负整数数组 nums，初始在第一个位置。每个元素代表最大跳跃长度，判断是否能到达最后一个位置。

## 解题思路

维护最远可达位置 `max_reach`，遍历每个位置，如果当前位置超过最远可达位置则无法继续。

不需要真正去跳，只需要知道"能到达的最远位置"是否覆盖终点。

## 代码实现

```python
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        max_reach = 0
        for i in range(len(nums)):
            if i > max_reach:
                return False
            max_reach = max(max_reach, i + nums[i])
        return True
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 维护最远可达位置，遍历过程中判断当前位置是否可达。


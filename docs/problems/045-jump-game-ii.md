---
title: "045. 跳跃游戏 II"
number: 45
difficulty: Medium
tags: ["贪心", "数组", "动态规划"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/jump-game-ii/"
related: [55, 45]
summary: "贪心选择每次跳跃能覆盖最远的位置，i == end 时触发跳跃。"
starred: false
date: 2024-01-01
---

## 题目描述

同 LC55，但求到达终点的最少跳跃次数。

## 解题思路

维护当前跳跃能到达的边界 `end`，以及下一次跳跃能到达的最远位置 `farthest`。当遍历到 `end` 时，必须跳一次，跳跃次数 +1，并将 `end` 更新为 `farthest`。

贪心选择——在当前跳跃范围内的所有位置中，选择能跳最远的位置。`i == end` 触发"必须跳了"的条件。

## 代码实现

```python
class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        end = 0
        farthest = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == end:
                jumps += 1
                end = farthest
        return jumps
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 贪心选择每次跳跃能覆盖最远的位置，i == end 时触发跳跃。


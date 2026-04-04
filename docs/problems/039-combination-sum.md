---
title: "039. 组合总和"
number: 39
difficulty: Medium
tags: ["回溯", "数组"]
time_complexity: "O(n^(target/min)"
space_complexity: "O(target/min)"
leetcode_url: "https://leetcode.cn/problems/combination-sum/"
related: [40, 39]
summary: "回溯 + 允许重复选同一元素，传 i 而非 i+1。"
starred: false
date: 2024-01-01
---

## 题目描述

给定无重复元素的正整数数组 candidates 和目标数 target，找出所有唯一组合使和为 target。每个数字可以无限使用。

## 解题思路

回溯，每层从当前索引开始选（允许重复选自己），目标和减去选中值，递归到下一层。目标和为 0 时收集答案。

`backtrack(i, ...)` 传 `i` 而非 `i+1`，允许重复选同一元素。先排序可以做剪枝——如果 `remain - candidates[i] < 0` 直接 break。

## 代码实现

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        def backtrack(start, remain):
            if remain == 0:
                result.append(path[:])
                return
            if remain < 0:
                return
            for i in range(start, len(candidates)):
                path.append(candidates[i])
                backtrack(i, remain - candidates[i])
                path.pop()

        backtrack(0, target)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n^(target/min)
- **空间复杂度**: O(target/min)

## 关键要点

- 回溯 + 允许重复选同一元素，传 i 而非 i+1。


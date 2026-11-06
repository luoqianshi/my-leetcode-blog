---
title: "046. 全排列"
number: 46
difficulty: Medium
tags: ["回溯", "数组"]
time_complexity: "O(n × n!)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/permutations/"
related: [47, 46]
summary: "经典回溯：维护 path 和 used 数组，选择 -> 递归 -> 撤销。"
starred: false
date: 2024-01-01
---

## 题目描述

给定不含重复数字的数组 nums，返回其所有可能的全排列。

## 解题思路

经典回溯。维护一个 `path` 列表和一个 `used` 布尔数组，每层选一个未使用的数字加入路径，递归到下一层。

`result.append(path[:])` 必须用切片拷贝，因为 path 会被后续操作修改。回溯模板：选择 → 递归 → 撤销。

## 代码实现

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []
        used = [False] * len(nums)

        def backtrack():
            if len(path) == len(nums):
                result.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                used[i] = True
                path.append(nums[i])
                backtrack()
                path.pop()
                used[i] = False

        backtrack()
        return result
```

## 复杂度分析

- **时间复杂度**: O(n × n!)
- **空间复杂度**: O(n)

## 关键要点

- 经典回溯：维护 path 和 used 数组，选择 -> 递归 -> 撤销。


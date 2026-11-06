---
title: "001. 两数之和"
number: 1
difficulty: Easy
tags: ["数组", "哈希表`"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/two-sum/"
related: [15, 167]
summary: "暴力解法是双层循环 O(n²)，但利用哈希表可以优化到 O(n)。核心思想是：遍历数组时，对于当前元素 num，检查 target - num 是否已经在哈希表..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案，并且不能使用同一个元素两次。

## 解题思路

暴力解法是双层循环 O(n²)，但利用哈希表可以优化到 O(n)。核心思想是：遍历数组时，对于当前元素 num，检查 target - num 是否已经在哈希表中（即之前遍历过）。如果在，直接返回两个下标；如果不在，将当前元素及其下标存入哈希表。这种"一边遍历、一边查找"的方式将查找过程从 O(n) 降到了 O(1)。

## 代码实现

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点



---
title: "169. 多数元素"
number: 169
difficulty: Easy
tags: ["数组", "哈希表", "Boyer-Moore投票算法`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/majority-element/"
related: []
summary: "这道题最直接的思路是用哈希表计数，但进阶要求 O(1) 空间复杂度。Boyer-Moore 投票算法是此题的最优解——核心思想类似异或的\"配对抵消\"：维护一个候..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个大小为 n 的数组 nums，返回其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。你可以假设数组是非空的，并且给定的数组总是存在多数元素。

## 解题思路

这道题最直接的思路是用哈希表计数，但进阶要求 O(1) 空间复杂度。Boyer-Moore 投票算法是此题的最优解——核心思想类似异或的"配对抵消"：维护一个候选者 candidate 和计数器 count。遍历数组时，若 count == 0 则更换候选者为当前元素；若当前元素等于候选者则 count + 1，否则 count - 1。直觉理解：把多数元素看成一个阵营，其他所有元素看成一个阵营，多数元素的票数严格超过半数，因此即使过程中被其他元素"抵消"掉一些票，最终剩下的候选者一定是多数元素。这种"不同则抵消"的思想与异或消去成对元素如出一辙。

## 代码实现

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = 0, 0
        for num in nums:
            if count == 0:
                candidate = num
            count += 1 if num == candidate else -1
        return candidate
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



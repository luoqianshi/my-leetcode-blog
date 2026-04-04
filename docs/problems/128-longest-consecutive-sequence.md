---
title: "128. 最长连续序列"
number: 128
difficulty: Medium
tags: ["并查集", "数组", "哈希表`"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/longest-consecutive-sequence/"
related: [128]
summary: "如果先排序再遍历，时间复杂度 O(n log n)，不满足要求。核心技巧是利用哈希集合实现 O(1) 查找。先将所有数字放入集合，然后遍历数组，对于每个数字 n..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

## 解题思路

如果先排序再遍历，时间复杂度 O(n log n)，不满足要求。核心技巧是利用哈希集合实现 O(1) 查找。先将所有数字放入集合，然后遍历数组，对于每个数字 num，只当 num - 1 不在集合中时（说明 num 是某个连续序列的起点），才向右不断检查 num + 1, num + 2, ... 是否在集合中，统计序列长度。这个"只从起点开始检查"的优化确保了每个数字最多被访问两次（一次作为起点遍历序列，一次在别的序列中被跳过），整体时间复杂度 O(n)。

## 代码实现

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        num_set = set(nums)
        longest = 0
        for num in nums:
            # 只有当num是序列起点时才检查
            if num - 1 not in num_set:
                current = num
                length = 1
                while current + 1 in num_set:
                    current += 1
                    length += 1
                longest = max(longest, length)
        return longest
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点



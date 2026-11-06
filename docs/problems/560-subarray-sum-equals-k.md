---
title: "560. 和为 K 的子数组"
number: 560
difficulty: Medium
tags: ["数组", "哈希表", "前缀和"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/subarray-sum-equals-k/"
related: [560]
summary: "前缀和 + 哈希表，用 prefix_count 记录之前出现过的前缀和频率。"
starred: false
date: 2024-01-01
---

## 题目描述

给定整数数组 nums 和整数 k，统计数组中和为 k 的连续子数组的个数。

## 解题思路

前缀和 + 哈希表。前缀和 `pre[j] - pre[i] = k` 等价于 `pre[j] - k = pre[i]`。遍历时用哈希表记录之前出现过的前缀和及其频率。

`prefix_count = {0: 1}`——前缀和本身为 0 的情况要初始化进去，否则 `prefix_sum == k` 的情况会被漏掉。

## 代码实现

```python
class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        prefix_count = {0: 1}
        count = 0
        prefix_sum = 0
        for num in nums:
            prefix_sum += num
            count += prefix_count.get(prefix_sum - k, 0)
            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
        return count
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 前缀和 + 哈希表，用 prefix_count 记录之前出现过的前缀和频率。


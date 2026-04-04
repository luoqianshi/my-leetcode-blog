---
title: "189. 轮转数组"
number: 189
difficulty: Medium
tags: ["数组", "数学"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/rotate-array/"
related: [189]
summary: "三次翻转法：翻转全部、翻转前 k 个、翻转剩余部分。"
starred: false
date: 2024-01-01
---

## 题目描述

将数组向右轮转 k 步。

## 解题思路

三次翻转法。翻转整个数组，再分别翻转前 k 个和剩余部分。注意 k 需取模。

三次翻转 = 环状替换的优雅实现。`[1,2,3,4,5]` → 翻转全部 → `[5,4,3,2,1]` → 翻转前 k=2 → `[4,5,3,2,1]` → 翻转后 n-k=3 → `[4,5,1,2,3]`。

## 代码实现

```python
class Solution:
    def rotate(self, nums: list[int], k: int) -> None:
        n = len(nums)
        k %= n
        def reverse(i, j):
            while i < j:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
                j -= 1
        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 三次翻转法：翻转全部、翻转前 k 个、翻转剩余部分。


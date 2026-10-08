---
title: "041. 缺失的第一个正数"
number: 41
difficulty: Hard
tags: ["数组", "哈希表"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/first-missing-positive/"
related: [128, 448]
summary: "原地哈希（置换法）：把值 v 交换到下标 v-1 处，扫完后再找第一个 nums[i] != i+1 的位置。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个未排序的整数数组 nums，请找出其中没有出现的最小正整数。要求实现时间复杂度为 O(n) 且只使用常数级别额外空间的算法。

## 解题思路

关键洞察：长度为 n 的数组，答案一定落在 **[1, n+1]** 内（最坏情况 1~n 都在，答案是 n+1）。所以 ≤0 和 >n 的数都无关紧要。

**原地哈希（置换法）**：让值 v 归位到下标 v-1，即 `nums[v-1] == v`。遍历每个位置，不断把 `nums[i]` 交换到它该去的位置，直到：

- 当前值不在 [1, n] 内（无效，跳过）；或
- 目标位置已经是正确值 `nums[nums[i]-1] == nums[i]`（防死循环，如 [1,1]）。

归位后再扫一遍，第一个 `nums[i] != i+1` 的位置，答案就是 `i+1`；全部正确则答案是 `n+1`。

## 代码实现

```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        for i in range(n):
            # 值在 [1,n] 且目标位置还没放对时，持续交换归位
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1
```

## 复杂度分析

- **时间复杂度**: O(n)，看似双重循环，但每次 while 交换都让一个元素永久归位，总交换次数 ≤ n，均摊 O(n)
- **空间复杂度**: O(1)，复用原数组作哈希表

## 关键要点

- 答案范围 [1, n+1] 的结论把"无限正整数"缩小成 n+1 种情况，是 O(1) 空间方案成立的前提。
- while 条件里的 `nums[nums[i]-1] != nums[i]` 是防死循环的核心：重复元素（如 [1,1]）会使交换永远不终止。
- 交换写法注意 Python 同时赋值顺序：写成 `nums[i], nums[nums[i]-1] = nums[nums[i]-1], nums[i]` 会先改 nums[i] 导致目标下标错乱，必须让带 nums[i] 的下标先被求值。

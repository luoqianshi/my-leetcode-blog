---
title: "287. 寻找重复数"
number: 287
difficulty: Medium
tags: ["数组", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/find-the-duplicate-number/"
related: [141, 142]
summary: "把 nums[i] 看作 i → nums[i] 的函数指针，重复数即链表环入口，快慢指针 Floyd 判环一步到位。"
starred: false
date: 2026-09-16
---

## 题目描述

给定一个包含 n + 1 个整数的数组 nums，其数字都在 [1, n] 范围内（n ≥ 1）。请找出数组中唯一的重复数字。要求：不能修改数组 nums，只用 O(1) 的额外空间，时间复杂度小于 O(n²)。

## 解题思路

把 `i → nums[i]` 看成一条"函数边"，从下标 0 出发不断迭代，会得到一条链。由于值域 [1,n] 而下标 0..n，从 0 出发的链**永远不会回到 0**（没有值指向下标 0 的入口），且必进入一个环。

**重复的数字 k 意味着两个下标 i≠j 都指向 nums[i] = nums[j] = k**，即结点 k 有两个前驱，正是这两条入边汇成环的交汇点——重复数就是环的入口。

套用 Floyd 判环（同 142 题环形链表 II）：

1. 快指针每次走 `nums[nums[fast]]` 两步，慢指针每次 `nums[slow]` 一步，相遇；
2. 慢指针回到起点 0，两者同步单步前进，再次相遇的下标值即环入口——重复数。

## 代码实现

```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = nums[0]
        while True:                    # 相遇在环内
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = nums[0]                 # 回到起点
        while slow != fast:            # 同步前进，相遇即入口
            slow = nums[slow]
            fast = nums[fast]
        return slow
```

## 复杂度分析

- **时间复杂度**: O(n)，两阶段指针各走有限步（证明同 Floyd 判环）
- **空间复杂度**: O(1)

## 关键要点

- 建模力：数组即隐式链表 `i → nums[i]`，三重限制（不改数组、O(1) 空间、< O(n²)）逼出图论视角。
- 起点必须选下标 0：0 没有入边，保证从它出发一定"先走在链上、再进环"，环入口证明才成立。
- 数学基础：相遇点距入口 a，起点距环入口 b，环长 c，由 a = b (mod c) 得出同步前进 b 步后相遇在入口。
- 二进制计数（逐位统计 1 的个数与 [1,n] 基准比较）也能 O(n log n) 求解，但 Floyd 判环更优雅。

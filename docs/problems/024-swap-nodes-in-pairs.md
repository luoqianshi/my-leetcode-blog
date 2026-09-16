---
title: "024. 两两交换链表中的节点"
number: 24
difficulty: Medium
tags: ["链表"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/swap-nodes-in-pairs/"
related: [25, 206]
summary: "哑结点 + 三步指针重连：每轮用 prev 追踪前驱，把 first、second 两结点交换方向后整体接回去。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个链表，两两交换其中相邻的结点，并返回交换后链表的头结点。你必须在不修改结点内部的值的情况下完成本题（即只能进行结点交换）。

## 解题思路

交换"first → second → 后续"两个结点，本质是四条指针的重连。每轮迭代维护 `prev`（已处理部分的尾结点）：

1. `first = prev.next`、`second = first.next`，若 second 不存在说明只剩一个结点，直接结束；
2. 三步重连：
   - `first.next = second.next`：first 接到后面的链
   - `second.next = first`：second 反过来指向 first，完成交换
   - `prev.next = second`：把换好的 pair 挂回主链
3. `prev = first`（交换后 first 在后面，成为下一轮的前驱）。

哑结点让第一对结点的交换与后续完全同构，无需特判头结点。

## 代码实现

```python
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            first = prev.next
            second = first.next
            first.next = second.next   # 1. first 接到后面
            second.next = first        # 2. second 反指 first
            prev.next = second         # 3. pair 挂回主链
            prev = first               # first 成为新的前驱
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 画图是链表指针题的第一生产力：先写 `first.next = second.next` 再反指，顺序颠倒会产生环。
- 迭代写法只需常数空间；递归写法更短但栈深 O(n)。
- 循环条件 `prev.next and prev.next.next` 同时覆盖了"剩 0 个"和"剩 1 个"两种尾部情况。

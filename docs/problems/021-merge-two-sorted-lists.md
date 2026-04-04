---
title: "021. 合并两个有序链表"
number: 21
difficulty: Easy
tags: ["递归", "链表`"]
time_complexity: "O(m + n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/merge-two-sorted-lists/"
related: [23, 148]
summary: "迭代合并，dummy 节点简化头处理。"
starred: false
date: 2024-01-01
---

## 题目描述

将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

## 解题思路

这道题同时展示了递归和迭代两种链表操作范式。递归法非常优雅：比较两个头节点的值，较小的作为结果头节点，其 next 指向剩余部分的合并结果。迭代法则使用哑节点简化头节点处理，维护一个 tail 指针，每次将较小的节点接到 tail 后面。两种方法时间复杂度相同，递归法代码更简洁但有栈溢出风险（链表过长时），迭代法更稳妥。

## 代码实现

```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(m + n)
- **空间复杂度**: O(1)

## 关键要点

- 迭代合并，dummy 节点简化头处理。


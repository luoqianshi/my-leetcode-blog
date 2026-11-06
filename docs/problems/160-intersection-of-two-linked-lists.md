---
title: "160. 相交链表"
number: 160
difficulty: Easy
tags: ["哈希表", "链表", "双指针`"]
time_complexity: "O(m + n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/intersection-of-two-linked-lists/"
related: [160]
summary: "最直观的方法是用哈希表记录链表A的所有节点，然后遍历链表B看哪个节点已经在哈希表中。但更优雅的双指针解法利用了\"消除长度差\"的思想：指针 pA 从 headA ..."
starred: false
date: 2024-01-01
---

## 题目描述

给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null。整个链式结构中不存在环。注意，函数返回结果后，链表必须保持其原始结构。

## 解题思路

最直观的方法是用哈希表记录链表A的所有节点，然后遍历链表B看哪个节点已经在哈希表中。但更优雅的双指针解法利用了"消除长度差"的思想：指针 pA 从 headA 出发走完A链表后切换到 headB，指针 pB 从 headB 出发走完B链表后切换到 headA。这样两者走过的总路径长度相等（lenA + lenB），如果有交点，它们一定会在交点处相遇。如果无交点，它们会同时到达 null。这种"走完一条链再走另一条"的技巧非常巧妙，代码也极为简洁。

## 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if not headA or not headB:
            return None
        pA, pB = headA, headB
        while pA != pB:
            pA = pA.next if pA else headB
            pB = pB.next if pB else headA
        return pA
```

## 复杂度分析

- **时间复杂度**: O(m + n)
- **空间复杂度**: O(1)

## 关键要点



---
title: "206. 反转链表"
number: 206
difficulty: Easy
tags: ["递归", "链表`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/reverse-linked-list/"
related: [92, 206]
summary: "反转链表有两种经典写法——迭代法和递归法。迭代法使用三个指针 prev、curr、next，遍历链表时将 curr.next 指向 prev，然后三个指针整体前..."
starred: false
date: 2024-01-01
---

## 题目描述

给你单链表的头节点 head，请你反转链表，并返回反转后的链表。

## 解题思路

反转链表有两种经典写法——迭代法和递归法。迭代法使用三个指针 prev、curr、next，遍历链表时将 curr.next 指向 prev，然后三个指针整体前进一步。递归法则先递归到链表末尾，然后在回溯过程中逐层修改指针。面试中推荐掌握迭代法（更常用、不易栈溢出），同时也理解递归法的思想。

迭代法思路：prev 初始为 null，curr 从 head 开始。每次循环：先用 next 记录 curr.next（防止断链），然后将 curr.next 指向 prev（反转指针），最后 prev 和 curr 都前进一步。循环结束后 prev 就是新的头节点。

## 代码实现

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



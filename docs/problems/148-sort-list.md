---
title: "148. 排序链表"
number: 148
difficulty: Medium
tags: ["链表", "排序", "归并排序"]
time_complexity: "O(n log n)"
space_complexity: "O(log n)"
leetcode_url: "https://leetcode.cn/problems/sort-list/"
related: [21, 148]
summary: "归并排序链表版：快慢指针找中点，递归排序后合并。"
starred: false
date: 2024-01-01
---

## 题目描述

对链表进行排序，要求 O(n log n) 时间复杂度和 O(1) 级额外空间。

## 解题思路

归并排序的链表版本。找中点（快慢指针），递归排序两半，合并两个有序链表。

找中点时 `fast = head.next`（而非 `head`）确保偶数个节点时左半部分更短，避免死循环。归并排序天然适合链表——不需要额外空间，只需修改指针。

## 代码实现

```python
class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head
        # 找中点
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        mid = slow.next
        slow.next = None  # 断开
        # 递归排序
        left = self.sortList(head)
        right = self.sortList(mid)
        # 合并
        return self._merge(left, right)

    def _merge(self, l1, l2):
        dummy = tail = ListNode()
        while l1 and l2:
            if l1.val <= l2.val:
                tail.next, l1 = l1, l1.next
            else:
                tail.next, l2 = l2, l2.next
            tail = tail.next
        tail.next = l1 or l2
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n log n)
- **空间复杂度**: O(log n)

## 关键要点

- 归并排序链表版：快慢指针找中点，递归排序后合并。


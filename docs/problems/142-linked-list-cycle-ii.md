---
title: "142. 环形链表 II"
number: 142
difficulty: Medium
tags: ["链表", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/linked-list-cycle-ii/"
related: [141, 142]
summary: "快慢指针找相遇点后，一个指针回 head 同步前进，再次相遇即为入环点。"
starred: false
date: 2024-01-01
---

## 题目描述

给定链表头节点，返回链表开始入环的第一个节点。如果无环则返回 null。

## 解题思路

快慢指针。快指针每次走两步，慢指针每次走一步。快慢相遇后，将一个指针移回 head，两者同步前进，再次相遇处即为入环点。

**数学原理**：设头到入环点距离 a，入环点到相遇点距离 b，环长 c。相遇时快指针走了 a + b + k*c，慢指针走了 a + b。由于快是慢的两倍：2(a+b) = a + b + k*c → a = k*c - b = (k-1)*c + (c-b)。即从 head 走 a 步等于从相遇点走 (k-1)*c + (c-b) 步——都是从相遇点出发绕若干圈后再走 c-b 步到达入环点。

与 LC141（只判断是否有环）的区别在于，找到相遇点后需要第二次遍历来定位入环节点。注意判断 `is` 而非 `==`，因为节点可能值相同但不是同一对象。

## 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                # 找到相遇点，开始找入环点
                ptr = head
                while ptr is not slow:
                    ptr = ptr.next
                    slow = slow.next
                return ptr
        return None
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 快慢指针找相遇点后，一个指针回 head 同步前进，再次相遇即为入环点。


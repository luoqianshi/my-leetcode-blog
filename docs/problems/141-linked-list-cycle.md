---
title: "141. 环形链表"
number: 141
difficulty: Easy
tags: ["哈希表", "链表", "双指针`"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/linked-list-cycle/"
related: [142, 202]
summary: "检测环的最经典方法是 Floyd 快慢指针（也叫龟兔赛跑算法）。快指针每次走两步，慢指针每次走一步。如果链表有环，快指针最终一定会追上慢指针（在环内\"套圈\"）；..."
starred: false
date: 2024-01-01
---

## 题目描述

给你一个链表的头节点 head，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递。仅仅是为了标识链表的实际情况。如果链表中存在环，则返回 true，否则返回 false。

## 解题思路

检测环的最经典方法是 Floyd 快慢指针（也叫龟兔赛跑算法）。快指针每次走两步，慢指针每次走一步。如果链表有环，快指针最终一定会追上慢指针（在环内"套圈"）；如果无环，快指针会先到达 null。这个方法空间复杂度仅为 O(1)，比哈希表方法更优。证明思路：进入环后，快指针相对于慢指针的速度为 1（每次多走一步），相当于快指针在以步长 1 靠近慢指针，在有环的情况下一定会相遇。

## 代码实现

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow, fast = head, head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        return False
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点



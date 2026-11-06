---
title: "002. 两数相加"
number: 2
difficulty: Medium
tags: ["链表", "递归", "数学"]
time_complexity: "O(max(m,n)"
space_complexity: "O(max(m,n)"
leetcode_url: "https://leetcode.cn/problems/add-two-numbers/"
related: [2]
summary: "逐位相加维护进位，divmod 同时得到商和余数。"
starred: false
date: 2024-01-01
---

## 题目描述

两个非空链表表示两个非负整数，各位数字逆序存储，求两数之和也用链表表示。

## 解题思路

逐位相加，维护进位。注意最高位可能产生新的进位。

`while l1 or l2 or carry` 优雅地处理了不同长度和最终进位。`divmod(s, 10)` 同时得到商（进位）和余数（当前位）。

## 代码实现

```python
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            s = carry
            if l1:
                s += l1.val
                l1 = l1.next
            if l2:
                s += l2.val
                l2 = l2.next
            carry, s = divmod(s, 10)
            tail.next = ListNode(s)
            tail = tail.next
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(max(m,n)
- **空间复杂度**: O(max(m,n)

## 关键要点

- 逐位相加维护进位，divmod 同时得到商和余数。


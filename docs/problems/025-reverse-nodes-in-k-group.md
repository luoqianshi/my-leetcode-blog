---
title: "025. K 个一组翻转链表"
number: 25
difficulty: Hard
tags: ["链表"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/reverse-nodes-in-k-group/"
related: [24, 206]
summary: "先统计长度，再逐段用头插法原地翻转：不足 k 个的尾部保持原序，dummy 保证头段与后续统一处理。"
starred: false
date: 2026-09-16
---

## 题目描述

给你链表的头结点 head 和整数 k，每 k 个结点一组进行翻转，请返回修改后的链表。若结点总数不是 k 的整数倍，最后剩余的结点保持原有顺序。只能用 O(1) 额外空间。

## 解题思路

分两步走：

1. **统计链表长度 n**，决定有多少个完整组（`n // k` 组需要翻转）；
2. **逐组头插翻转**：每组内，curr 始终指向组内第一个结点，把 curr 后面的结点依次插到组头：

```
prev → [a b c d] ...
        ↑curr
```

每插一次，`nxt = curr.next` 摘出，插入 `prev.next` 位置：`nxt.next = prev.next; prev.next = nxt`。重复 k-1 次后该组翻转完毕，curr 恰好落在组尾，成为下一组的 prev。

剩余不足 k 个（n < k）时循环直接不再执行，尾部天然保持原序。

## 代码实现

```python
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        n = 0
        node = head
        while node:
            n += 1
            node = node.next
        dummy = ListNode(0, head)
        prev = dummy
        while n >= k:                      # 只翻转完整的 k 组
            curr = prev.next                # curr 固定为组内第一个结点
            for _ in range(k - 1):          # 头插 k-1 次
                nxt = curr.next
                curr.next = nxt.next
                nxt.next = prev.next
                prev.next = nxt
            prev = curr                     # curr 已被推到组尾
            n -= k
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n)，每个结点只被常数次指针操作
- **空间复杂度**: O(1)

## 关键要点

- 头插法的妙处：curr 永远指向组内原第一个结点，反转过程中它逐步"沉"到组尾，循环结束直接成为下一组前驱。
- 与"25 题"相对的偷懒解法是把结点值取出来数组翻转再塞回去，但题目要求交换结点本身，改值不符合题意。
- 先数长度比"探测一组够不够 k 个再决定翻不翻"更简单直观；两种写法都是 O(n)。

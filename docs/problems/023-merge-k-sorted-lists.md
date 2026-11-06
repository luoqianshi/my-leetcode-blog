---
title: "023. 合并 K 个升序链表"
number: 23
difficulty: Hard
tags: ["链表", "堆", "分治"]
time_complexity: "O(n log k)"
space_complexity: "O(k)"
leetcode_url: "https://leetcode.cn/problems/merge-k-sorted-lists/"
related: [21, 23]
summary: "最小堆合并 K 个有序链表，用 (val, i, node) 三元组确保可比较。"
starred: false
date: 2024-01-01
---

## 题目描述

合并 k 个升序链表为一个升序链表。

## 解题思路

优先队列（最小堆）。将所有链表头节点放入堆，每次弹出最小节点，将其 next（如果存在）推入堆。

用 `(val, i, node)` 三元组避免节点比较失败（Python 3 不支持直接比较 ListNode）。`i` 是链表索引，作为 tiebreaker 确保堆元素可比较。逐个节点操作，每次堆操作 O(log k)。

## 代码实现

```python
import heapq

class Solution:
    def mergeKLists(self, lists):
        min_heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(min_heap, (node.val, i, node))
        dummy = tail = ListNode()
        while min_heap:
            val, i, node = heapq.heappop(min_heap)
            tail.next = node
            tail = tail.next
            if node.next:
                heapq.heappush(min_heap, (node.next.val, i, node.next))
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n log k)
- **空间复杂度**: O(k)

## 关键要点

- 最小堆合并 K 个有序链表，用 (val, i, node) 三元组确保可比较。


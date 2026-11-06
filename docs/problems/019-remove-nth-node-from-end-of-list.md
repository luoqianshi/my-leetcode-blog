---
title: "019. 删除链表的倒数第 N 个结点"
number: 19
difficulty: Medium
tags: ["链表", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/"
related: [21, 83]
summary: "哑结点 + 快慢指针：fast 先走 n 步，两指针同步前进，slow 停在倒数第 n+1 个结点，一步越过删除。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。要求一趟扫描实现（进阶）。

## 解题思路

核心是**让两个指针保持固定间距 n**：

1. 建哑结点 dummy 指向 head，fast 和 slow 都从 dummy 出发；
2. fast 先走 n 步，此时 fast 与 slow 间距为 n；
3. fast、slow 同步前进，直到 fast 到达最后一个结点（`fast.next is None`），slow 恰好停在**倒数第 n+1 个结点**——即待删结点的前驱；
4. `slow.next = slow.next.next` 越过待删结点。

哑结点必不可少：待删的可能是头结点本身，没有前驱可停。

## 代码实现

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n):          # fast 先走 n 步，拉开间距
            fast = fast.next
        while fast.next:            # 同步前进，slow 停在前驱位置
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next  # 越过待删结点
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n)，一趟扫描
- **空间复杂度**: O(1)

## 关键要点

- 快慢指针保持固定间距 n，"倒数第 n 个"就被转化成了"fast 到尾时 slow 的位置"，天然一趟完成。
- 哑结点统一了"删头结点"与"删中间结点"两种情况，是链表题的通用防御手法。
- 若不用哑结点，删除头结点需要单独 `if` 分支并返回 `head.next`，代码不对称。

---
title: "234. 回文链表"
number: 234
difficulty: Easy
tags: ["链表", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/palindrome-linked-list/"
related: [206, 141]
summary: "快慢指针找中点 + 原地反转后半段 + 双向对撞比较，O(1) 空间判断链表回文。"
starred: false
date: 2026-09-16
---

## 题目描述

给你单链表的头结点 head，请你判断该链表是否为回文链表。如果是，返回 true；否则返回 false。进阶：能否用 O(n) 时间复杂度和 O(1) 空间解决？

## 解题思路

数组复制判回文最简单但空间 O(n)。O(1) 空间三步走：

1. **快慢指针找中点**：slow 每次一步、fast 每次两步，fast 到尾时 slow 停在中间（偶数长度时 slow 停在后半的第一个结点）；
2. **反转后半段**：从 slow 开始迭代反转，prev 最终指向新的后半段头（原尾结点）；
3. **对撞比较**：left 从 head、right 从反转后的头同步前进，right 走完（后半段较短或等长）即全部匹配。

比较时以 right（后半段）为循环边界，天然兼容奇偶长度：奇数时正中间的结点被划入前半段不影响回文判定。

## 代码实现

```python
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        # 1. 快慢指针找中点
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        # 2. 反转后半段
        prev, curr = None, slow
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        # 3. 双向对撞比较
        left, right = head, prev
        while right:
            if left.val != right.val:
                return False
            left = left.next
            right = right.next
        return True
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 偶数长度 [1,2,2,1]：slow 停在第二个 2，反转后 right 链长 2；奇数长度 [1,0,1]：slow 停在 0，反转后 right 链长 2（含中间结点）——以 right 为界都能正确对撞。
- 本解法破坏了链表结构（后半被反转）；若要求恢复，比较结束后把后半再反转回去即可。
- 快慢指针找中点 + 反转，是链表题两大原语（206 题 + 141 题技巧）的组合应用。

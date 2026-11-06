---
title: "138. 随机链表的复制"
number: 138
difficulty: Medium
tags: ["链表", "哈希表"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/copy-list-with-random-pointer/"
related: [146, 133]
summary: "三步原地拼接：每个结点后插入复制结点 → 复制结点的 random 指向原结点 random 的 next → 拆链，O(1) 空间完成深拷贝。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个长度为 n 的链表，每个结点除了包含 next 指针外，还包含一个 random 指针，指向链表中的任意结点或空结点。请构造该链表的深拷贝，使新链表中每个结点的 val、next、random 都与原链表对应。

## 解题思路

难点在 random：复制结点在建立时，它 random 指向的目标结点可能还没被创建。哈希表（原结点 → 复制结点）是 O(n) 空间的直观解。**原地拼接法**把它压到 O(1)：

1. **交错插入**：遍历原链表，每个结点 curr 后插入它的复制 `copy = Node(curr.val, curr.next)`，形成 `原1 → 复1 → 原2 → 复2 …` 的交错链；
2. **复制 random**：`curr.next.random = curr.random.next`——原结点的 random 的**下一个**就是该 random 的复制结点（若 random 非空）；
3. **拆分两链**：把奇数位（原链）和偶数位（新链）拆开，恢复原链 next 同时用哑结点串出复制链。

交错结构让"原结点 ↔ 复制结点"的映射关系隐含在指针里，替代了哈希表。

## 代码实现

```python
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None
        # 1. 每个原结点后插入其复制结点
        curr = head
        while curr:
            copy = Node(curr.val, curr.next)
            curr.next = copy
            curr = copy.next
        # 2. 设置复制结点的 random
        curr = head
        while curr:
            if curr.random:
                curr.next.random = curr.random.next
            curr = curr.next.next
        # 3. 拆分原链与复制链
        dummy = Node(0)
        tail = dummy
        curr = head
        while curr:
            copy = curr.next
            curr.next = copy.next      # 恢复原链
            tail.next = copy          # 串接复制链
            tail = copy
            curr = curr.next
        return dummy.next
```

## 复杂度分析

- **时间复杂度**: O(n)，三趟线性遍历
- **空间复杂度**: O(1)，不使用哈希表（交错指针本身即映射）

## 关键要点

- 哈希表解法 `dict[原结点] = 复制结点` 两趟即可，简单直观；三步拼接法是空间优化的标准进阶。
- `curr.random.next` 恰是 random 结点的复制版——交错结构的全部价值就在这一句。
- 第 3 步拆链必须同时修复原链（`curr.next = copy.next`），题目虽不校验原链，但保持调用方数据完整是好习惯。

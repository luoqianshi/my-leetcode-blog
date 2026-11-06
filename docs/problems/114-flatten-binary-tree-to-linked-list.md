---
title: "114. 二叉树展开为链表"
number: 114
difficulty: Medium
tags: ["树", "链表", "栈"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/"
related: [114]
summary: "Morris 遍历思想，将左子树接到右子树前面。"
starred: false
date: 2024-01-01
---

## 题目描述

将二叉树原地展开为单链表（按前序遍历顺序，每个节点的右子指针指向下一个节点，左子指针为 None）。

## 解题思路

迭代法，维护一个 prev 指针。前序遍历的顺序是：根 → 左 → 右。展开后 prev.right = 当前节点。

Morris 遍历不需要递归栈或显式栈，通过修改树的结构来实现遍历。面试中如果能写出 Morris 解法是很大的加分项。

## 代码实现

```python
class Solution:
    def flatten(self, root):
        if not root:
            return
        prev = None
        stack = [root]
        while stack:
            node = stack.pop()
            if prev:
                prev.right = node
                prev.left = None
            prev = node
            # 前序遍历：先右后左入栈
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        if prev:
            prev.left = None
            prev.right = None
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- Morris 遍历思想，将左子树接到右子树前面。


---
title: "094. 二叉树的中序遍历"
number: 94
difficulty: Easy
tags: ["栈", "树", "DFS`"]
time_complexity: "O(n)"
space_complexity: "O(h)"
leetcode_url: "https://leetcode.cn/problems/binary-tree-inorder-traversal/"
related: [144, 145, 94]
summary: "中序遍历的顺序是左 → 根 → 右。递归法最直观：先递归左子树，访问根节点，再递归右子树。但面试中更常考的是迭代法——使用显式栈模拟递归过程。迭代法的核心是：不..."
starred: false
date: 2024-01-01
---

## 题目描述

给定一个二叉树的根节点 root，返回它的中序遍历结果。

## 解题思路

中序遍历的顺序是左 → 根 → 右。递归法最直观：先递归左子树，访问根节点，再递归右子树。但面试中更常考的是迭代法——使用显式栈模拟递归过程。迭代法的核心是：不断将左子节点压栈直到最左端，然后弹出栈顶节点并访问，再转向其右子树重复同样操作。这个"一路向左"的模式是所有迭代式树遍历的基础，务必牢记。

## 代码实现

```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        stack = []
        curr = root
        while curr or stack:
            # 一路向左，将左边界压栈
            while curr:
                stack.append(curr)
                curr = curr.left
            # 弹出栈顶，访问，转向右子树
            curr = stack.pop()
            result.append(curr.val)
            curr = curr.right
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(h)

## 关键要点



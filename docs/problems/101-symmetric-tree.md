---
title: "101. 对称二叉树"
number: 101
difficulty: Easy
tags: ["树", "DFS"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/symmetric-tree/"
related: [226, 100]
summary: "镜像递归：同时递归 (a.left, b.right) 与 (a.right, b.left)，任何时刻两子树都要“照镜子相等”。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个二叉树的根结点 root，检查它是否轴对称。

## 解题思路

轴对称不是"左右子树相等"，而是**左右子树互为镜像**。定义镜像判定 `is_mirror(a, b)`：

1. 都为空 → 对称；
2. 一空一非空 → 不对称；
3. 都非空 → `a.val == b.val`，且 `a 的左子树` 与 `b 的右子树` 镜像、`a 的右子树` 与 `b 的左子树` 镜像。

即把两棵树"由外向内折"，每次递归同时取两棵树的**外侧一对**和**内侧一对**继续比较。

## 代码实现

```python
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def is_mirror(a: Optional[TreeNode], b: Optional[TreeNode]) -> bool:
            if not a and not b:
                return True
            if not a or not b:
                return False
            return (a.val == b.val
                    and is_mirror(a.left, b.right)
                    and is_mirror(a.right, b.left))

        return is_mirror(root.left, root.right)
```

## 复杂度分析

- **时间复杂度**: O(n)，每个结点恰好访问一次
- **空间复杂度**: O(n)，最坏（链状树）递归深度

## 关键要点

- 对称 ⟺ 左右子树镜像；镜像 ⟺ "根相等 + 外侧镜像 + 内侧镜像"，这是一个天然的递归定义。
- 与"相同二叉树"（100 题）只差两个参数的顺序——`a.left/b.left` 变成 `a.left/b.right`，抓住这层关系可一题通两题。
- 写成 BFS 版本时用队列每次弹出两个结点比较，再把 (a.left, b.right) 和 (a.right, b.left) 成对入队，思路完全一致。

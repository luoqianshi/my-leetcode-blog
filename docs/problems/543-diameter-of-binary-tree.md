---
title: "543. 二叉树的直径"
number: 543
difficulty: Easy
tags: ["树", "DFS"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/diameter-of-binary-tree/"
related: [124, 104]
summary: "直径 = 某结点左右子树深度之和的最大值，DFS 求深度的途中顺手用 左深+右深 更新全局答案。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一棵二叉树的根结点 root，返回该树的直径。二叉树的直径是树中任意两个结点间最长路径的长度，这条路径可能经过也可能不经过根结点。两结点间路径的长度由它们之间边数表示。

## 解题思路

任意一条路径都形如"某结点的左子树深度向下延伸 + 该结点 + 右子树深度向下延伸"，即在某个结点处**拐弯**。所以：

```
直径 = max over 所有结点 node 的 (depth(node.left) + depth(node.right))
```

求深度的 DFS 递归 `depth(node) = max(depth(left), depth(right)) + 1`，在返回之前用 `left + right` 更新全局最大值 `diameter`，一趟遍历同时完成两件事——**返回值算深度（单边），全局变量记直径（双拐）**。

## 代码实现

```python
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        self.diameter = 0

        def depth(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            left = depth(node.left)
            right = depth(node.right)
            self.diameter = max(self.diameter, left + right)  # 拐弯处
            return max(left, right) + 1                        # 单边深度

        depth(root)
        return self.diameter
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)，递归栈深度最坏为链状树

## 关键要点

- "边数"口径：路径长度 = 结点数 - 1 = 左右子树深度之和（深度按结点数计）。
- 递归返回单边、全局记录拐弯的二分法，与 124 题最大路径和完全同构——把 max(深度) 换成 max(带符号和) 即迁移。
- 直径不一定经过根结点，所以不能只算 root 的左右深度之和，必须每个结点都尝试当拐点。

---
title: "06. 二叉树入门"
description: 二叉树是递归思想的最佳训练场，覆盖翻转、深度计算、中序遍历、层序遍历四个入门问题。
level: beginner
count: 4
prev: /review/05-linked-list-basics
next: /review/07-sliding-window
---

# 二叉树入门

二叉树是面试中最重要的树形数据结构，几乎所有与树相关的面试题都围绕二叉树展开。理解二叉树的关键在于掌握两种遍历方式：深度优先遍历（DFS，包括前序、中序、后序）和广度优先遍历（BFS，即层序遍历）。同时，二叉树的递归思想——"将子问题交给左右子树处理"——是解决大部分树形问题的核心。

本模块精选四道二叉树入门题：翻转二叉树展示递归的简洁力量，最大深度是递归思维的起点，中序遍历展示迭代与递归的对应关系，层序遍历引入 BFS 和队列。这四道题构成了二叉树操作的完整入门体系。

**二叉树遍历速查**：

| 遍历方式 | 访问顺序 | 典型应用 |
|----------|----------|----------|
| 前序 (Pre-order) | 根 → 左 → 右 | 复制树、序列化 |
| 中序 (In-order) | 左 → 根 → 右 | BST 排序输出 |
| 后序 (Post-order) | 左 → 右 → 根 | 释放空间、求高度 |
| 层序 (Level-order) | 逐层从左到右 | 最短路径、层次处理 |

---

### 226. 翻转二叉树 | 简单
`标签: 树, DFS, 分治`

**题目描述**：给你一棵二叉树的根节点 root，翻转这棵二叉树，并返回其根节点。

**示例**：
```
输入：root = [4, 2, 7, 1, 3, 6, 9]
输出：[4, 7, 2, 9, 6, 3, 1]

输入：root = [2, 1, 3]
输出：[2, 3, 1]
```

**思路分析**：翻转二叉树的操作非常直观——交换每个节点的左右子树。使用递归，对当前节点：先翻转左子树，再翻转右子树，最后交换左右子节点。这是分治思想的典型应用：翻转整棵树 = 翻转左子树 + 翻转右子树 + 交换根节点的左右子节点。递归终止条件是遇到空节点。这道题代码极其简洁，但其递归思想是所有树形问题的基础。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
```

**复杂度**：时间 O(n)，空间 O(h)（h 为树高，最坏 O(n)，平衡树 O(log n)）

---

### 104. 二叉树的最大深度 | 简单
`标签: 树, DFS, BFS`

**题目描述**：给定一个二叉树 root，返回其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**示例**：
```
输入：root = [3, 9, 20, null, null, 15, 7]
输出：3

输入：root = [1, null, 2]
输出：2
```

**思路分析**：这是二叉树递归的入门题。最大深度等于 max(左子树深度, 右子树深度) + 1（当前节点本身算一层）。递归终止条件：空节点深度为 0。这个递归公式直接对应代码实现，非常简洁。也可以用 BFS（层序遍历）求解：每遍历完一层，深度加一，直到队列为空。

```python
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return max(self.maxDepth(root.left), self.maxDepth(root.right)) + 1
```

**复杂度**：时间 O(n)，空间 O(h)

---

### 94. 二叉树的中序遍历 | 简单
`标签: 栈, 树, DFS`

**题目描述**：给定一个二叉树的根节点 root，返回它的中序遍历结果。

**示例**：
```
输入：root = [1, null, 2, 3]
输出：[1, 3, 2]

输入：root = []
输出：[]
```

**思路分析**：中序遍历的顺序是左 → 根 → 右。递归法最直观：先递归左子树，访问根节点，再递归右子树。但面试中更常考的是迭代法——使用显式栈模拟递归过程。迭代法的核心是：不断将左子节点压栈直到最左端，然后弹出栈顶节点并访问，再转向其右子树重复同样操作。这个"一路向左"的模式是所有迭代式树遍历的基础，务必牢记。

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

**复杂度**：时间 O(n)，空间 O(h)

---

### 102. 二叉树的层序遍历 | 中等
`标签: 树, BFS, 二叉树`

**题目描述**：给你二叉树的根节点 root，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。

**示例**：
```
输入：root = [3, 9, 20, null, null, 15, 7]
输出：[[3], [9, 20], [15, 7]]
```

**思路分析**：层序遍历使用 BFS（广度优先搜索），核心工具是队列。基本流程：将根节点入队，然后循环执行：记录当前层的节点数，逐个出队并记录值，同时将子节点入队。利用"先记录当前层大小"的技巧，可以在一次 BFS 中按层分组结果。这是二叉树 BFS 的标准模板，后续的"锯齿形层序遍历"（103）、"二叉树最大宽度"（662）等题目都是在此基础上的变种。

```python
from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result
```

**复杂度**：时间 O(n)，空间 O(n)（队列最宽时存储一层的所有节点）

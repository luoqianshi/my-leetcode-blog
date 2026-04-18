---
title: "18. 二叉树进阶"
description: 二叉树的高阶操作，覆盖 BST 验证、中序第K小、右视图、Morris遍历、构造、前缀和路径、LCA 七大问题。
level: advanced
count: 7
prev: /review/17-multidim-dp
next: /review/19-dp-advanced
---

# 二叉树进阶

> 难度：⭐⭐⭐⭐⭐ | 核心思想：二叉树进阶问题涉及 BST 特性利用、二叉树序列化/反序列化、路径求和、最近公共祖先等，考验递归思维和对树结构的综合运用能力。

## LC98. 验证二叉搜索树

**题目**：给定二叉树的根节点，判断它是否是有效的二叉搜索树（BST）。

**思路**：BST 的定义：左子树所有节点值 < 根节点值 < 右子树所有节点值。中序遍历 BST 应该得到严格递增序列。因此只需在中序遍历时检查当前节点值是否大于前一个节点值。

```python
class Solution:
    def isValidBST(self, root):
        prev = float('-inf')
        def inorder(node):
            nonlocal prev
            if not node:
                return True
            if not inorder(node.left):
                return False
            if node.val <= prev:
                return False
            prev = node.val
            return inorder(node.right)
        return inorder(root)
```

**复杂度**：时间 O(n)，空间 O(h)，h 为树高

**关键点**：常见的错误做法是只比较父子节点（`node.val > node.left.val and node.val < node.right.val`），这只能保证局部有序，不能保证左子树的所有值都小于根。正确做法是利用中序遍历的有序性或传递上下界。

**递归 + 上下界解法（同样优雅）：**

```python
class Solution:
    def isValidBST(self, root):
        def validate(node, low=float('-inf'), high=float('inf')):
            if not node:
                return True
            if node.val <= low or node.val >= high:
                return False
            return (validate(node.left, low, node.val) and
                    validate(node.right, node.val, high))
        return validate(root)
```

---

## LC230. 二叉搜索树中第 K 小的元素

**题目**：给定 BST 的根节点和整数 k，返回第 k 小的元素。

**思路**：中序遍历 BST 得到有序序列，第 k 个即为答案。可以提前终止遍历。

```python
class Solution:
    def kthSmallest(self, root, k):
        count = 0
        result = None
        def inorder(node):
            nonlocal count, result
            if not node or result is not None:
                return
            inorder(node.left)
            count += 1
            if count == k:
                result = node.val
                return
            inorder(node.right)
        inorder(root)
        return result
```

**复杂度**：时间 O(h + k)，空间 O(h)

**关键点**：利用 BST 中序遍历有序的特性。找到后通过 `result is not None` 提前终止，避免遍历整棵树。如果需要频繁查询第 k 小，可以提前中序遍历存入数组或维护每个子树的节点数。

---

## LC199. 二叉树的右视图

**题目**：给定二叉树的根节点，从右侧看到的节点值（即每一层最右边的节点）。

**思路**：BFS 层序遍历，每层最后一个元素即为右视图的值。或者 DFS 优先遍历右子树，记录每层第一个访问的节点。

```python
# BFS 解法
from collections import deque

class Solution:
    def rightSideView(self, root):
        if not root:
            return []
        q = deque([root])
        result = []
        while q:
            for _ in range(len(q)):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            result.append(node.val)  # 每层最后一个
        return result
```

**DFS 解法（更省空间）：**

```python
class Solution:
    def rightSideView(self, root):
        result = []
        def dfs(node, depth):
            if not node:
                return
            if depth == len(result):
                result.append(node.val)  # 每层第一个访问的
            dfs(node.right, depth + 1)  # 先右后左
            dfs(node.left, depth + 1)
        dfs(root, 0)
        return result
```

**复杂度**：时间 O(n)，空间 O(n)（BFS 最坏情况存一整层）

**关键点**：BFS 每层最后一个节点，DFS 优先右子树每层首个节点。两种方法殊途同归。

---

## LC114. 二叉树展开为链表

**题目**：将二叉树原地展开为单链表（按前序遍历顺序，每个节点的右子指针指向下一个节点，左子指针为 None）。

**思路**：迭代法，维护一个 prev 指针。前序遍历的顺序是：根 → 左 → 右。展开后 prev.right = 当前节点。

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

**更优雅的解法（Morris 遍历思想）：**

```python
class Solution:
    def flatten(self, root):
        cur = root
        while cur:
            if cur.left:
                # 找到左子树的最右节点
                pre = cur.left
                while pre.right:
                    pre = pre.right
                # 将右子树接到左子树最右节点后面
                pre.right = cur.right
                cur.right = cur.left
                cur.left = None
            cur = cur.right
```

**复杂度**：Morris 解法时间 O(n)，空间 O(1)

**关键点**：Morris 遍历不需要递归栈或显式栈，通过修改树的结构来实现遍历。面试中如果能写出 Morris 解法是很大的加分项。

---

## LC105. 从前序与中序遍历序列构造二叉树

**题目**：给定前序遍历和中序遍历序列，构造二叉树（假设无重复元素）。

**思路**：前序遍历第一个元素是根节点。在中序遍历中找到根节点，其左边是左子树，右边是右子树。递归构造。

```python
class Solution:
    def buildTree(self, preorder, inorder):
        def build(pre_start, pre_end, in_start, in_end):
            if pre_start > pre_end:
                return None
            root_val = preorder[pre_start]
            root = TreeNode(root_val)
            # 在中序遍历中找根节点位置
            idx = inorder_map[root_val]
            left_size = idx - in_start
            root.left = build(pre_start + 1, pre_start + left_size,
                              in_start, idx - 1)
            root.right = build(pre_start + left_size + 1, pre_end,
                               idx + 1, in_end)
            return root

        inorder_map = {val: i for i, val in enumerate(inorder)}
        return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

**复杂度**：时间 O(n)，空间 O(n)（哈希表 + 递归栈）

**关键点**：哈希表加速中序查找。关键在于计算左右子树在前序和中序数组中的边界。左子树大小 = 根在中序中的位置 - 中序起点。

---

## LC437. 路径总和 III

**题目**：给定二叉树，找到所有路径，使得路径上节点值之和等于目标值。路径不需要从根节点开始，也不需要在叶子节点结束（但必须向下）。

**思路**：前缀和 + DFS。维护从根到当前节点的路径和，用哈希表记录出现过的前缀和及其次数。如果 `curr_sum - target` 在哈希表中存在，说明存在合法路径。

```python
class Solution:
    def pathSum(self, root, targetSum):
        from collections import defaultdict
        count = 0
        prefix = defaultdict(int)
        prefix[0] = 1  # 前缀和为 0 出现 1 次

        def dfs(node, curr_sum):
            nonlocal count
            if not node:
                return
            curr_sum += node.val
            count += prefix.get(curr_sum - targetSum, 0)
            prefix[curr_sum] += 1
            dfs(node.left, curr_sum)
            dfs(node.right, curr_sum)
            prefix[curr_sum] -= 1  # 回溯

        dfs(root, 0)
        return count
```

**复杂度**：时间 O(n)，空间 O(n)

**关键点**：这是"前缀和 + 哈希表"在树上的经典应用，与数组子数组和问题（LC560）思路完全一致。回溯时需要将 prefix 中的计数减 1，因为路径必须向下走。

---

## LC236. 二叉树的最近公共祖先

**题目**：给定二叉树和两个节点 p 和 q，找到它们的最近公共祖先（LCA）。

**思路**：后序遍历。如果当前节点是 p 或 q，返回当前节点。如果左右子树分别找到了 p 和 q，则当前节点就是 LCA。如果只有一边找到了，返回找到的那边。

```python
class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root  # p 和 q 分别在左右子树
        return left or right  # 只在一侧找到
```

**复杂度**：时间 O(n)，空间 O(h)

**关键点**：简洁优雅的递归解法。核心逻辑：两边都找到了 → 当前就是 LCA；只有一边找到 → LCA 在那一侧；都没找到 → 不在当前子树中。对于 BST，可以利用大小关系更快地找到 LCA。

---

## 总结

| 题目 | 核心技巧 | 难度 |
|------|---------|------|
| LC98 | 中序遍历有序性 / 上下界递归 | 中等 |
| LC230 | 中序遍历第 k 个 | 中等 |
| LC199 | BFS 层序 / DFS 优先右子树 | 中等 |
| LC105 | 前序+中序构造树 | 中等 |
| LC114 | 前序遍历 + Morris 遍历 | 中等 |
| LC437 | 前缀和 + 哈希表 + 回溯 | 中等 |
| LC236 | 后序遍历递归 | 中等 |

二叉树进阶的核心能力：
1. BST 特性的巧妙利用（中序有序、大小关系）
2. 树的序列化与构造（前序+中序）
3. 前缀和在树上的应用
4. Morris 遍历实现 O(1) 空间遍历
5. LCA 问题的后序遍归思想

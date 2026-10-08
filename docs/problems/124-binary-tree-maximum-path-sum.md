---
title: "124. 二叉树中的最大路径和"
number: 124
difficulty: Hard
tags: ["树", "DFS", "动态规划"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/binary-tree-maximum-path-sum/"
related: [543, 104]
summary: "后序遍历返回“单边最大贡献”，递归途中用 左贡献+根+右贡献 更新全局答案——贡献为负时果断丢弃（取 0）。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个二叉树的根结点 root，返回其最大路径和。路径被定义为一条从树中任意结点出发、沿父结点-子结点连接达到任意结点的序列，同一个结点在一条路径序列中至多出现一次。路径至少包含一个结点，且不一定经过根结点。结点权值可能为负。

## 解题思路

路径可以"拐弯"（同时经过左右子树），这是与一般"单链路径"问题的本质区别。拆成两个量：

1. **贡献值 gain(node)**：以 node 为**端点**、只向下延伸的一条路径的最大和。由于路径不能分叉，node 只能选择左、右子树中较大的一边延续：

```
gain(node) = node.val + max(gain(node.left), gain(node.right), 0)
```

负贡献子树直接丢弃（取 0），因为带上只会变小。

2. **以 node 为拐点的路径和**：`node.val + gain(node.left) + gain(node.right)`——左右同时接上，在 node 处拐弯。

后序遍历递归计算 gain 的过程中，每个结点都用它的"拐弯值"更新全局最大值 `max_sum`，最终返回 max_sum。**递归返回值（单边）与全局答案（可拐弯）分离**是本题的核心。

## 代码实现

```python
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        self.max_sum = float('-inf')

        def max_gain(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            left_gain = max(max_gain(node.left), 0)    # 负贡献丢弃
            right_gain = max(max_gain(node.right), 0)
            # 以当前结点为拐点的路径：左 + 根 + 右
            self.max_sum = max(self.max_sum, node.val + left_gain + right_gain)
            # 向父结点返回：只能选一边延续
            return node.val + max(left_gain, right_gain)

        max_gain(root)
        return self.max_sum
```

## 复杂度分析

- **时间复杂度**: O(n)，每个结点访问一次
- **空间复杂度**: O(n)，递归深度最坏为链状树

## 关键要点

- "返回单边、记录全局拐弯"的二分法处理了所有非分叉约束的路径类树题。
- `max(gain, 0)` 是负数结点的命运分水岭：拐弯值要尽量吸收正值，但向下延伸时负子树是累赘。
- max_sum 初始化为 `-inf` 而非 0：结点全为负时答案也必须选一个结点（题目要求路径至少一个结点）。
- 全负树 [ -3 ] 返回 -3 而非 0，就是这个初始化在兜底。

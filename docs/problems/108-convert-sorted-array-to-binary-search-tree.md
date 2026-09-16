---
title: "108. 将有序数组转换为二叉搜索树"
number: 108
difficulty: Easy
tags: ["树", "分治", "二叉搜索树"]
time_complexity: "O(n)"
space_complexity: "O(log n)"
leetcode_url: "https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/"
related: [105, 98]
summary: "分治取中点：每次取区间中点做根，左半递归建左子树、右半递归建右子树，高度天然平衡。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个整数数组 nums，其中元素已经按严格递增顺序排列，请将其转换成一棵高度平衡的二叉搜索树。高度平衡指每个结点的左右两棵子树的高度差的绝对值不超过 1。

## 解题思路

有序数组就是 BST 的中序遍历序列。要让树**平衡**，只需让每个结点左右两侧的结点数量尽量均分：

```
def build(left, right):
    mid = (left + right) // 2     # 取中点做根
    root = TreeNode(nums[mid])
    root.left = build(left, mid - 1)   # 左半 → 左子树
    root.right = build(mid + 1, right) # 右半 → 右子树
```

分治的每层把区间对半分，子树高度差 ≤1 自动成立；`left > right` 时返回空树。

## 代码实现

```python
class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def build(left: int, right: int) -> Optional[TreeNode]:
            if left > right:
                return None
            mid = (left + right) // 2
            node = TreeNode(nums[mid])
            node.left = build(left, mid - 1)
            node.right = build(mid + 1, right)
            return node

        return build(0, len(nums) - 1)
```

## 复杂度分析

- **时间复杂度**: O(n)，每个元素只创建一次结点
- **空间复杂度**: O(log n)，递归深度即树高，平衡树为对数级

## 关键要点

- "有序数组 + 取中点"是平衡的充分条件：对半分保证任意子树的结点数差 ≤1。
- 中点取 `(left+right)//2`（偏左）或 `(left+right+1)//2`（偏右）都能得到合法答案，答案不唯一。
- 本题是"中序遍历重建 BST"家族的基础款：进阶版是从有序链表建平衡 BST（109 题），需要快慢指针找中点。

---
title: "105. 从前序与中序遍历序列构造二叉树"
number: 105
difficulty: Medium
tags: ["树", "数组", "分治"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
related: [106, 105]
summary: "前序第一个元素为根，在中序中定位根划分左右子树递归构造。"
starred: false
date: 2024-01-01
---

## 题目描述

给定前序遍历和中序遍历序列，构造二叉树（假设无重复元素）。

## 解题思路

前序遍历第一个元素是根节点。在中序遍历中找到根节点，其左边是左子树，右边是右子树。递归构造。

哈希表加速中序查找。关键在于计算左右子树在前序和中序数组中的边界。左子树大小 = 根在中序中的位置 - 中序起点。

## 代码实现

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

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 前序第一个元素为根，在中序中定位根划分左右子树递归构造。


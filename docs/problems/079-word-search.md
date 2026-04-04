---
title: "079. 单词搜索"
number: 79
difficulty: Medium
tags: ["回溯", "矩阵", "字符串"]
time_complexity: "O(mn × 3^L)"
space_complexity: "O(L)"
leetcode_url: "https://leetcode.cn/problems/word-search/"
related: [79]
summary: "DFS + 回溯在矩阵中搜索单词，用 '#' 标记已访问格子。"
starred: false
date: 2024-01-01
---

## 题目描述

给定 m×n 字符矩阵 board 和单词 word，判断 word 是否存在于矩阵中（相邻格子的水平/垂直方向组成）。

## 解题思路

DFS + 回溯。从每个匹配起始字符的位置开始搜索，四个方向递归，走过的格子临时标记。

用 `board[i][j] = '#'` 标记已访问，搜索完恢复。注意递归只有 3 个方向（不回头），不是 4 个。

## 代码实现

```python
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        m, n = len(board), len(board[0])

        def dfs(i, j, k):
            if k == len(word):
                return True
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
                return False
            temp = board[i][j]
            board[i][j] = '#'
            found = (dfs(i + 1, j, k + 1) or
                     dfs(i - 1, j, k + 1) or
                     dfs(i, j + 1, k + 1) or
                     dfs(i, j - 1, k + 1))
            board[i][j] = temp
            return found

        for i in range(m):
            for j in range(n):
                if board[i][j] == word[0] and dfs(i, j, 0):
                    return True
        return False
```

## 复杂度分析

- **时间复杂度**: O(mn × 3^L)
- **空间复杂度**: O(L)

## 关键要点

- DFS + 回溯在矩阵中搜索单词，用 '#' 标记已访问格子。


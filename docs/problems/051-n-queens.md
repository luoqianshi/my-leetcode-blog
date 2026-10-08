---
title: "051. N 皇后"
number: 51
difficulty: Hard
tags: ["回溯"]
time_complexity: "O(n!)"
space_complexity: "O(n²)"
leetcode_url: "https://leetcode.cn/problems/n-queens/"
related: [46, 37]
summary: "按行放置皇后，用三个集合 O(1) 判重（列、主对角线 r-c、副对角线 r+c），回溯枚举所有摆法。"
starred: false
date: 2026-09-16
---

## 题目描述

将 n 个皇后放置在 n×n 棋盘上，使得皇后彼此之间不能互相攻击（不在同一行、同一列或同一对角线上）。返回所有不同的解决方案。

## 解题思路

**按行放置**是关键决策：每行恰好一个皇后，行冲突天然不存在，问题变成"每行选哪一列"。这把二维棋盘问题降成一维的逐行决策树。

冲突判重用三个集合 O(1) 完成：

- 列冲突：`col in cols`
- 主对角线（左上→右下）：同一对角线上 `r - c` 恒定，`r-c in diag1`
- 副对角线（右上→左下）：同一对角线上 `r + c` 恒定，`r+c in diag2`

递归函数处理第 row 行，枚举每列 col，无冲突则标记、进入下一行；回溯时撤销标记。row == n 时，按 `queens` 数组还原棋盘字符串（`'.'*c + 'Q' + '.'*(n-c-1)`）。

`queens[row] = col` 这个一维数组本身就是棋盘的压缩表示。

## 代码实现

```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        results = []
        queens = [-1] * n            # queens[row] = 该行皇后所在列
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> None:
            if row == n:
                results.append(['.' * c + 'Q' + '.' * (n - c - 1) for c in queens])
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                queens[row] = col
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)
                backtrack(row + 1)
                cols.remove(col)     # 撤销
                diag1.remove(row - col)
                diag2.remove(row + col)

        backtrack(0)
        return results
```

## 复杂度分析

- **时间复杂度**: O(n!)，第一行 n 种选择，第二行约 n-1 种……剪枝后远小于 n^n 但上界仍是阶乘级
- **空间复杂度**: O(n²)，主要为结果棋盘（判重集合仅 O(n)）

## 关键要点

- 对角线的代数刻画是本题精髓：主对角线 `r-c` 相同、副对角线 `r+c` 相同，把 O(n) 的扫描判重降到 O(1)。
- 按行搜索消除了行冲突这个维度，决策树从 n² 层变成 n 层。
- `queens[row] = col` 回溯时无需撤销（会被覆盖），只有集合需要显式 remove——这是数组"覆盖式标记"与集合"显式标记"的差异。
- n=8 时恰好 92 个解，是检验回溯正确性的经典数据点。

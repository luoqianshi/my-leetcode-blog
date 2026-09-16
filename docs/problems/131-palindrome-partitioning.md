---
title: "131. 分割回文串"
number: 131
difficulty: Medium
tags: ["字符串", "回溯", "动态规划"]
time_complexity: "O(n · 2^n)"
space_complexity: "O(n²)"
leetcode_url: "https://leetcode.cn/problems/palindrome-partitioning/"
related: [5, 139]
summary: "回溯切割：start 到每个回文 end 都是一刀，递归切剩余部分；is_pal 二维表 O(1) 判回文免重复扫描。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个字符串 s，请将 s 分割成一些子串，使每个子串都是回文串，返回 s 所有可能的分割方案。

## 解题思路

决策树按"**切在哪一刀**"展开：从 start 出发，枚举切割点 end，若 `s[start..end]` 是回文则切下来放入 path，递归处理 `end+1` 之后的部分；start 到达 n 时收集。

直接切片判断回文每次 O(n) 扫描，总体退化。先用**区间 DP** 预处理 `is_pal[i][j]`（s[i..j] 是否回文）：

```
is_pal[i][j] = (s[i] == s[j]) and (j - i < 2 or is_pal[i+1][j-1])
```

按 i 从 n-1 到 0 逆序填表（保证 i+1 行先算好），回溯中回文判断变 O(1)。

## 代码实现

```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        # 预处理：is_pal[i][j] 表示 s[i..j] 是否回文
        is_pal = [[False] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                    is_pal[i][j] = True
        result, path = [], []

        def backtrack(start: int) -> None:
            if start == n:
                result.append(path[:])
                return
            for end in range(start, n):
                if is_pal[start][end]:
                    path.append(s[start:end + 1])
                    backtrack(end + 1)
                    path.pop()

        backtrack(0)
        return result
```

## 复杂度分析

- **时间复杂度**: O(n · 2^n)，最坏（如 "aaaa"）每个位置切/不切都合法，方案数指数级
- **空间复杂度**: O(n²)，回文判定表

## 关键要点

- 切割型回溯与组合型（78 题）同构：start 之前是已定部分，[start, end] 是本次选择，end+1 是下一个子问题。
- 回文预处理把判断降到 O(1)，枚举量级仍是指数级但常数大幅缩小——预处理+查询是字符串回溯的标配优化。
- 递推式 `s[i]==s[j] 且内部回文` 按长度从短到长扩张，倒序 i 保证依赖的 i+1 行先就绪。

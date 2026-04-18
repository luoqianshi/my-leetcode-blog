---
title: "17. 多维动态规划"
description: 从一维扩展到二维，状态转移变为 dp[i][j]，覆盖路径计数、回文子串、LCS、编辑距离四大经典。
level: advanced
count: 4
prev: /review/16-graph
next: /review/18-binary-tree-advanced
---

# 多维动态规划

> 难度：⭐⭐⭐⭐⭐ | 核心思想：当问题的状态依赖两个或更多维度的子问题时，需要使用多维 DP。常见形式包括二维网格 DP、字符串匹配 DP 等。

## LC62. 不同路径

**题目**：从 m×n 网格的左上角走到右下角，每次只能向右或向下，有多少条不同路径。

**思路**：`dp[i][j]` = 到达 (i,j) 的路径数 = dp[i-1][j] + dp[i][j-1]。初始条件：第一行和第一列都只有 1 条路径。

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n  # 空间优化为一维
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]
        return dp[-1]
```

**复杂度**：时间 O(m×n)，空间 O(n)

**关键点**：二维 DP 的标准入门题。空间优化技巧：`dp[j]` 在更新前存储的是 dp[i-1][j]（上方），`dp[j-1]` 已经更新为 dp[i][j-1]（左方），所以 `dp[j] += dp[j-1]` 等价于 `dp[i][j] = dp[i-1][j] + dp[i][j-1]`。

---

## LC5. 最长回文子串

**题目**：给定字符串 s，找到其中最长的回文子串。

**思路**：中心扩展法。以每个字符（以及每对相邻字符）为中心，向两边扩展寻找回文。比 DP 更高效且直观。

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if len(s) < 2:
            return s
        start, max_len = 0, 1

        def expand(l, r):
            nonlocal start, max_len
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            # 回文为 s[l+1:r]
            if r - l - 1 > max_len:
                max_len = r - l - 1
                start = l + 1

        for i in range(len(s)):
            expand(i, i)      # 奇数长度回文
            expand(i, i + 1)  # 偶数长度回文

        return s[start:start + max_len]
```

**复杂度**：时间 O(n²)，空间 O(1)

**关键点**：中心扩展法每次扩展的时间均摊为 O(1)（因为回文的总数是有限的）。Manacher 算法能做到 O(n)，但面试中通常不要求。

**DP 解法（供理解）：**

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        start, max_len = 0, 1
        for i in range(n):
            dp[i][i] = True
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j]:
                    dp[i][j] = (length == 2) or dp[i + 1][j - 1]
                if dp[i][j] and length > max_len:
                    start, max_len = i, length
        return s[start:start + max_len]
```

DP 解法时间空间都是 O(n²)，理解其状态转移有助于掌握 DP 思维。

---

## LC1143. 最长公共子序列

**题目**：给定两个字符串 text1 和 text2，返回它们的**最长公共子序列**的长度。

**思路**：`dp[i][j]` = text1[0:i] 和 text2[0:j] 的 LCS 长度。如果 text1[i-1] == text2[j-1]，则 dp[i][j] = dp[i-1][j-1] + 1；否则 dp[i][j] = max(dp[i-1][j], dp[i][j-1])。

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]
```

**复杂度**：时间 O(m×n)，空间 O(m×n)，可优化为 O(n)

**关键点**：二维 DP 的经典模板题。可以空间优化为一维：只需要上一行的 dp 值。`dp[j] = dp[j-1] + 1 if match else max(dp[j], prev[j])`（需要保存 prev）。

---

## LC72. 编辑距离

**题目**：给定两个单词 word1 和 word2，返回将 word1 转换成 word2 所使用的最少操作数（插入、删除、替换）。

**思路**：`dp[i][j]` = word1[0:i] 转换为 word2[0:j] 的最少操作数。

三种操作：
- 删除 word1[i-1]：dp[i][j] = dp[i-1][j] + 1
- 插入 word2[j-1]：dp[i][j] = dp[i][j-1] + 1
- 替换 word1[i-1] 为 word2[j-1]：dp[i][j] = dp[i-1][j-1] + 1

如果 word1[i-1] == word2[j-1]，无需操作：dp[i][j] = dp[i-1][j-1]

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        # 初始化
        for i in range(m + 1):
            dp[i][0] = i  # word1 前 i 个字符全部删除
        for j in range(n + 1):
            dp[0][j] = j  # 全部插入 word2 的前 j 个字符

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j],      # 删除
                                        dp[i][j - 1],      # 插入
                                        dp[i - 1][j - 1])  # 替换
        return dp[m][n]
```

**复杂度**：时间 O(m×n)，空间 O(m×n)

**关键点**：编辑距离是二维 DP 的天花板之一。理解三种操作的对称性——在 word1 上"删除"等价于在 word2 上"插入"。初始化：dp[i][0] = i（删除 i 个字符），dp[0][j] = j（插入 j 个字符）。

---

## 总结

| 题目 | DP 类型 | 状态转移 |
|------|--------|---------|
| LC62 | 网格路径 DP | dp[i][j] = dp[i-1][j] + dp[i][j-1] |
| LC5 | 区间 DP / 中心扩展 | dp[i][j] = dp[i+1][j-1] if s[i]==s[j] |
| LC1143 | 字符串匹配 DP | dp[i][j] = dp[i-1][j-1]+1 or max(dp[i-1][j], dp[i][j-1]) |
| LC72 | 编辑距离 DP | dp[i][j] = min(删/插/替) or dp[i-1][j-1] |

多维 DP 的解题步骤：
1. 确定状态维度（通常是两个下标 i, j）
2. 定义 dp[i][j] 的含义
3. 找到状态转移方程（分析最后一步的操作）
4. 确定初始条件和边界
5. 考虑空间优化（滚动数组、一维化）

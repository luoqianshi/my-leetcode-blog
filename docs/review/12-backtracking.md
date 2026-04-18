---
title: "12. 回溯算法"
description: 穷举所有可能，通过选择→递归→撤销三步走，在解空间树上搜索，配合剪枝可大幅优化。
level: intermediate
count: 5
prev: /review/11-greedy
next: /review/13-heap
---

# 回溯算法

> 难度：⭐⭐⭐⭐ | 核心思想：穷举所有可能，通过"选择 → 递归 → 撤销选择"三步走，在解空间树上搜索。配合剪枝可以大幅优化。

## LC46. 全排列

**题目**：给定不含重复数字的数组 nums，返回其所有可能的全排列。

**思路**：经典回溯。维护一个 `path` 列表和一个 `used` 布尔数组，每层选一个未使用的数字加入路径，递归到下一层。

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []
        used = [False] * len(nums)

        def backtrack():
            if len(path) == len(nums):
                result.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                used[i] = True
                path.append(nums[i])
                backtrack()
                path.pop()
                used[i] = False

        backtrack()
        return result
```

**复杂度**：时间 O(n × n!)，空间 O(n)

**关键点**：`result.append(path[:])` 必须用切片拷贝，因为 path 会被后续操作修改。回溯模板：选择 → 递归 → 撤销。

---

## LC78. 子集

**题目**：给定不含重复元素的整数数组 nums，返回所有可能的子集。

**思路**：与全排列不同，子集不需要"选满"才收集答案——每一个中间状态都是一个合法子集。

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []

        def backtrack(start):
            result.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()

        backtrack(0)
        return result
```

**复杂度**：时间 O(n × 2^n)，空间 O(n)

**关键点**：`start` 参数确保不重复选择前面的元素（避免 `[1,2]` 和 `[2,1]` 同时出现）。每个节点都是答案，区别于排列问题只在叶子节点收集。

---

## LC39. 组合总和

**题目**：给定无重复元素的正整数数组 candidates 和目标数 target，找出所有唯一组合使和为 target。每个数字可以无限使用。

**思路**：回溯，每层从当前索引开始选（允许重复选自己），目标和减去选中值，递归到下一层。目标和为 0 时收集答案。

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        def backtrack(start, remain):
            if remain == 0:
                result.append(path[:])
                return
            if remain < 0:
                return
            for i in range(start, len(candidates)):
                path.append(candidates[i])
                backtrack(i, remain - candidates[i])
                path.pop()

        backtrack(0, target)
        return result
```

**复杂度**：时间 O(n^(target/min))，空间 O(target/min)

**关键点**：`backtrack(i, ...)` 传 `i` 而非 `i+1`，允许重复选同一元素。先排序可以做剪枝——如果 `remain - candidates[i] < 0` 直接 break。

---

## LC22. 括号生成

**题目**：给定 n 对括号，生成所有合法的括号组合。

**思路**：回溯时维护"剩余左括号数"和"剩余右括号数"。只有左括号数 > 右括号数时才能放右括号（保证合法）。

```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        result = []

        def backtrack(s, left, right):
            if len(s) == 2 * n:
                result.append(s)
                return
            if left < n:
                backtrack(s + '(', left + 1, right)
            if right < left:
                backtrack(s + ')', left, right + 1)

        backtrack('', 0, 0)
        return result
```

**复杂度**：时间 O(4^n / sqrt(n))，空间 O(n)

**关键点**：`right < left` 是合法性保证——任何前缀中，左括号数量 ≥ 右括号数量。

---

## LC79. 单词搜索

**题目**：给定 m×n 字符矩阵 board 和单词 word，判断 word 是否存在于矩阵中（相邻格子的水平/垂直方向组成）。

**思路**：DFS + 回溯。从每个匹配起始字符的位置开始搜索，四个方向递归，走过的格子临时标记。

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

**复杂度**：时间 O(mn × 3^L)，空间 O(L)

**关键点**：用 `board[i][j] = '#'` 标记已访问，搜索完恢复。注意递归只有 3 个方向（不回头），不是 4 个。

---

## 总结

| 题目 | 回溯类型 | 剪枝策略 |
|------|---------|---------|
| LC46 | 排列 | used 数组去重 |
| LC78 | 子集 | start 参数避免重复 |
| LC39 | 组合（无限选） | remain < 0 提前返回 |
| LC22 | 括号生成 | right < left 合法性约束 |
| LC79 | 二维搜索 | '#' 标记已访问 + 方向限定 |

回溯万能模板：
```python
def backtrack(参数):
    if 满足结束条件:
        收集答案
        return
    for 选择 in 所有选择:
        if 剪枝条件: continue
        做选择
        backtrack(更新后的参数)
        撤销选择
```

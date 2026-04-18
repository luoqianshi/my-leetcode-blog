---
title: "16. 图论"
description: 将实际问题抽象为图模型，掌握 DFS、BFS、拓扑排序、字典树等基本算法。
level: advanced
count: 4
prev: /review/15-linked-list-advanced
next: /review/17-multidim-dp
---

# 图论

> 难度：⭐⭐⭐⭐⭐ | 核心思想：图论问题需要将实际问题抽象为图模型，掌握 DFS、BFS、并查集、拓扑排序等基本算法。

## LC200. 岛屿数量

**题目**：给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿数量。岛屿被水包围，通过水平或垂直相邻连接。

**思路**：DFS/BFS 遍历。遇到 '1' 时计数并 DFS 将所有相连的 '1' 标记为已访问（改为 '0' 或用 visited 集合）。

```python
class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0
        m, n = len(grid), len(grid[0])
        count = 0

        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
                return
            grid[i][j] = '0'  # 标记已访问
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        return count
```

**复杂度**：时间 O(m×n)，空间 O(m×n)（最坏情况递归深度）

**关键点**：原地修改 grid 作为 visited 标记，省去额外空间。DFS 四方向递归，也可以用 BFS + deque 实现。

---

## LC994. 腐烂的橘子

**题目**：在网格中，每分钟新鲜橘子（1）会被上下左右四个方向的腐烂橘子（2）感染。返回所有新鲜橘子腐烂的最短时间，如果有橘子永远无法腐烂则返回 -1。

**思路**：多源 BFS。将所有初始腐烂橘子同时入队，逐层扩展。记录扩散层数即为时间。

```python
from collections import deque

class Solution:
    def orangesRotting(self, grid):
        m, n = len(grid), len(grid[0])
        q = deque()
        fresh = 0
        # 收集所有腐烂橘子和新鲜橘子数量
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    q.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1
        if fresh == 0:
            return 0
        # 多源 BFS
        minutes = 0
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while q:
            for _ in range(len(q)):  # 逐层处理
                x, y = q.popleft()
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                        grid[nx][ny] = 2
                        fresh -= 1
                        q.append((nx, ny))
            if q:
                minutes += 1
        return minutes if fresh == 0 else -1
```

**复杂度**：时间 O(m×n)，空间 O(m×n)

**关键点**：多源 BFS 的经典应用。`for _ in range(len(q))` 实现逐层遍历，每层代表一分钟。最后检查 fresh 是否为 0。

---

## LC207. 课程表

**题目**：有 n 门课程，用 prerequisites[i] = [a, b] 表示学 a 之前必须先学 b。判断是否可能完成所有课程。

**思路**：拓扑排序。课程和先修关系构成有向图，如果能完成拓扑排序则无环，可以完成所有课程。

```python
from collections import deque

class Solution:
    def canFinish(self, numCourses, prerequisites):
        # 建图 + 入度数组
        adj = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indegree[a] += 1
        # 入度为 0 的节点入队
        q = deque([i for i in range(numCourses) if indegree[i] == 0])
        count = 0
        while q:
            node = q.popleft()
            count += 1
            for neighbor in adj[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    q.append(neighbor)
        return count == numCourses
```

**复杂度**：时间 O(V+E)，空间 O(V+E)

**关键点**：Kahn 算法——不断移除入度为 0 的节点。如果最终访问的节点数等于总课程数，说明无环。也可以用 DFS 检测环（三种状态：未访问、访问中、已完成，遇到"访问中"的节点说明有环）。

---

## LC208. 实现 Trie（前缀树）

**题目**：实现前缀树，支持 insert、search 和 startsWith 操作。

**思路**：每个节点包含 children 字典和一个 is_end 标记。insert 逐字符创建节点，search 需要匹配到最后一个字符且 is_end 为 True，startsWith 只需匹配到最后一个字符。

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
```

**复杂度**：所有操作均为 O(L)，L 为字符串长度。空间 O(总字符数)。

**关键点**：Trie 的核心是每个节点用字典存储子节点，而非数组（更节省空间）。Trie 的典型应用包括：自动补全、拼写检查、IP 路由。变体：压缩前缀树（Radix Tree）合并单分支节点。

---

## 总结

| 题目 | 图论技巧 | 难度 |
|------|---------|------|
| LC200 | DFS/BFS 遍历连通块 | 中等 |
| LC994 | 多源 BFS（逐层扩展） | 中等 |
| LC207 | 拓扑排序（Kahn 算法） | 中等 |
| LC208 | Trie 前缀树的实现 | 中等 |

图论问题的解题框架：
1. **建图**：邻接表（最常用）或邻接矩阵
2. **遍历**：DFS（适合找路径、连通块）或 BFS（适合最短路径、层序处理）
3. **检测环**：拓扑排序或 DFS 状态标记
4. **最短路径**：BFS（无权图）、Dijkstra（带权图）、Floyd（全源最短路）
5. **并查集**：适合动态连通性判断，如 Kruskal 最小生成树

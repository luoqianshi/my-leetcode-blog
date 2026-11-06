---
title: "207. 课程表"
number: 207
difficulty: Medium
tags: ["图", "拓扑排序"]
time_complexity: "O(V+E)"
space_complexity: "O(V+E)"
leetcode_url: "https://leetcode.cn/problems/course-schedule/"
related: [210, 207]
summary: "拓扑排序（Kahn 算法），不断移除入度为 0 的节点判断是否有环。"
starred: false
date: 2024-01-01
---

## 题目描述

有 n 门课程，用 prerequisites[i] = [a, b] 表示学 a 之前必须先学 b。判断是否可能完成所有课程。

## 解题思路

拓扑排序。课程和先修关系构成有向图，如果能完成拓扑排序则无环，可以完成所有课程。

Kahn 算法——不断移除入度为 0 的节点。如果最终访问的节点数等于总课程数，说明无环。也可以用 DFS 检测环（三种状态：未访问、访问中、已完成，遇到"访问中"的节点说明有环）。

## 代码实现

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

## 复杂度分析

- **时间复杂度**: O(V+E)
- **空间复杂度**: O(V+E)

## 关键要点

- 拓扑排序（Kahn 算法），不断移除入度为 0 的节点判断是否有环。


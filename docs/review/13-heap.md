---
title: "13. 堆"
description: 堆是特殊的完全二叉树，Python heapq 提供高效最小堆操作，核心应用是 Top-K 问题和动态极值。
level: intermediate
count: 2
prev: /review/12-backtracking
next: /review/14-1d-dp
---

# 堆

> 难度：⭐⭐⭐ | 核心思想：堆是一种特殊的完全二叉树，Python 的 `heapq` 模块提供高效的最小堆操作。最大堆可通过存负数模拟。

## LC215. 数组中的第 K 个最大元素

**题目**：给定未排序数组，找到第 k 个最大的元素。

**思路**：维护一个大小为 k 的最小堆。遍历数组，将元素压入堆中，当堆大小超过 k 时弹出最小值。最终堆顶就是第 k 大。

```python
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
```

**复杂度**：时间 O(n log k)，空间 O(k)

**关键点**：用最小堆保持"最大的 k 个元素"——堆顶是这 k 个中最小的，也就是第 k 大。比全局排序 O(n log n) 更高效，尤其当 k 远小于 n 时。

---

## LC347. 前 K 个高频元素

**题目**：给定非空整数数组，返回出现频率前 k 高的元素。

**思路**：先用字典统计频率，然后用大小为 k 的最小堆，按频率排序，堆满后弹出频率最低的。

```python
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        # 最小堆，按频率排序，堆满 k 个后弹出最小的
        heap = []
        for num, freq in count.items():
            heapq.heappush(heap, (freq, num))
            if len(heap) > k:
                heapq.heappop(heap)
        return [num for freq, num in heap]
```

**复杂度**：时间 O(n log k)，空间 O(n)

**关键点**：`heapq` 是最小堆，所以用 `(freq, num)` 元组时，堆顶是频率最低的。Python 的元组比较会逐元素比较，freq 相同时按 num 比较（num 要是可比较的）。

---

## 总结

| 题目 | 堆类型 | 用途 |
|------|--------|------|
| LC215 | 最小堆（固定大小 k） | Top-K 问题 |
| LC347 | 最小堆（固定大小 k） | 频率 Top-K |

堆的两个经典应用场景：
1. **Top-K 问题**：维护大小为 k 的最小堆，堆满后弹出最小值，最终堆中保留最大的 k 个。
2. **动态极值**：需要频繁获取最大/最小值时，堆比线性扫描高效得多。

Python `heapq` 常用操作：
- `heapq.heappush(heap, item)` — 入堆
- `heapq.heappop(heap)` — 弹出最小值
- `heapq.heapify(list)` — 原地建堆，O(n)
- `heap[0]` — 查看堆顶（最小值）
- 最大堆技巧：存储 `-x` 代替 `x`

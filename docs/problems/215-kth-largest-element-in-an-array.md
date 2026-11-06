---
title: "215. 数组中的第 K 个最大元素"
number: 215
difficulty: Medium
tags: ["堆", "数组", "分治"]
time_complexity: "O(n log k)"
space_complexity: "O(k)"
leetcode_url: "https://leetcode.cn/problems/kth-largest-element-in-an-array/"
related: [347, 215]
summary: "维护大小为 k 的最小堆，堆顶即为第 k 大元素。"
starred: false
date: 2024-01-01
---

## 题目描述

给定未排序数组，找到第 k 个最大的元素。

## 解题思路

维护一个大小为 k 的最小堆。遍历数组，将元素压入堆中，当堆大小超过 k 时弹出最小值。最终堆顶就是第 k 大。

用最小堆保持"最大的 k 个元素"——堆顶是这 k 个中最小的，也就是第 k 大。比全局排序 O(n log n) 更高效，尤其当 k 远小于 n 时。

## 代码实现

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

## 复杂度分析

- **时间复杂度**: O(n log k)
- **空间复杂度**: O(k)

## 关键要点

- 维护大小为 k 的最小堆，堆顶即为第 k 大元素。


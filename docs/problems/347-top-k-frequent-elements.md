---
title: "347. 前 K 个高频元素"
number: 347
difficulty: Medium
tags: ["堆", "哈希表"]
time_complexity: "O(n log k)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/top-k-frequent-elements/"
related: [215, 347]
summary: "哈希表统计频率 + 最小堆取 Top-K。"
starred: false
date: 2024-01-01
---

## 题目描述

给定非空整数数组，返回出现频率前 k 高的元素。

## 解题思路

先用字典统计频率，然后用大小为 k 的最小堆，按频率排序，堆满后弹出频率最低的。

`heapq` 是最小堆，所以用 `(freq, num)` 元组时，堆顶是频率最低的。Python 的元组比较会逐元素比较，freq 相同时按 num 比较（num 要是可比较的）。

## 代码实现

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

## 复杂度分析

- **时间复杂度**: O(n log k)
- **空间复杂度**: O(n)

## 关键要点

- 哈希表统计频率 + 最小堆取 Top-K。


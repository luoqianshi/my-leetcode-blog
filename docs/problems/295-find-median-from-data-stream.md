---
title: "295. 数据流的中位数"
number: 295
difficulty: Hard
tags: ["堆", "设计"]
time_complexity: "O(log n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/find-median-from-data-stream/"
related: [215, 347]
summary: "双堆对半分：大顶堆存较小一半、小顶堆存较大一半，两堆规模差 ≤ 1，中位数由堆顶直接读出。"
starred: false
date: 2026-09-16
---

## 题目描述

中位数是有序整数列表中的中间值。如果列表长度为偶数，中位数则是中间两个数的平均值。实现 MedianFinder 类：`addNum(num)` 从数据流中添加一个整数，`findMedian()` 返回目前所有元素的中位数。

## 解题思路

维护两个堆，把数据**对半劈开**：

- `small`：**大顶堆**（Python 存相反数），装较小的一半，堆顶是这一半的最大值
- `large`：**小顶堆**，装较大的一半，堆顶是这一半的最小值

不变式：`len(small) == len(large)` 或 `len(small) == len(large) + 1`。

**addNum(num)**：
1. 若 `small` 为空或 `num <= -small[0]`（不超过下半最大值），入 small；否则入 large；
2. 重平衡：small 多出 2 个 → 把 small 堆顶挪给 large；large 反超 → 把 large 堆顶挪给 small。

**findMedian()**：总长奇数取 `-small[0]`，偶数取两堆顶均值。

每个元素入堆一次、至多被搬一次，单次操作 O(log n)。

## 代码实现

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []   # 大顶堆（存相反数）：较小的一半
        self.large = []   # 小顶堆：较大的一半

    def addNum(self, num: int) -> None:
        if not self.small or num <= -self.small[0]:
            heapq.heappush(self.small, -num)
        else:
            heapq.heappush(self.large, num)
        # 维护规模不变式：small 比 large 多 0 或 1 个
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2
```

## 复杂度分析

- **时间复杂度**: addNum O(log n)，findMedian O(1)
- **空间复杂度**: O(n)

## 关键要点

- 中位数只与"中间一两个数"有关：双堆把全序信息压缩成两个堆顶，插入维护的正是这个骨架。
- Python 没有 `heapq` 大顶堆，**存相反数**是标准手法：堆顶最小值取负后恰是最大值。
- 也可以用 `SortedList`（有序集合）或每次插入二分定位，但双堆是本题的标准最优解。
- 有序数组的静态中位数是 4 题（双分割线），本题的"动态流"版本由双堆接管——中位数问题的动静两版对照记忆。

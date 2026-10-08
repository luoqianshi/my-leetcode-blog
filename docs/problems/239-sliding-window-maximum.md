---
title: "239. 滑动窗口最大值"
number: 239
difficulty: Hard
tags: ["队列", "单调队列", "滑动窗口"]
time_complexity: "O(n)"
space_complexity: "O(k)"
leetcode_url: "https://leetcode.cn/problems/sliding-window-maximum/"
related: [347, 155]
summary: "单调递减双端队列存下标：队首永远是当前窗口最大值，入队前弹出所有 ≤ 新值的元素（它们永远没机会当最大）。"
starred: false
date: 2026-09-16
---

## 题目描述

给你一个整数数组 nums 和滑动窗口的大小 k，有一个大小为 k 的窗口从数组最左侧移动到最右侧，返回每个窗口中的最大值。

## 解题思路

朴素做法每个窗口 O(k) 扫描，总 O(nk)。**单调队列**把均摊代价压到 O(1)：

双端队列 deque 存**下标**，保持对应值从队首到队尾**单调递减**。遍历到 nums[i]：

1. **过期清理**：队首下标 `<= i - k`（已滑出窗口左边界）则 popleft；
2. **队尾维护单调性**：弹出所有对应值 `<= nums[i]` 的队尾下标——这些元素比新来的数小（或相等）且更早过期，**永远不可能再成为窗口最大值**；
3. **入队** i；
4. **i >= k-1** 后队首下标对应的值即该窗口答案。

每个下标各入队一次、至多出队一次，总操作 O(n)。

## 代码实现

```python
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq = deque()          # 存下标，对应值单调递减
        result = []
        for i, num in enumerate(nums):
            if dq and dq[0] <= i - k:        # 队首过期
                dq.popleft()
            while dq and nums[dq[-1]] <= num: # 维护单调性
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                result.append(nums[dq[0]])   # 队首即窗口最大
        return result
```

## 复杂度分析

- **时间复杂度**: O(n)，均摊每元素常数次操作
- **空间复杂度**: O(k)，队列至多存一个窗口内的下标

## 关键要点

- 单调队列 = 滑动窗口版单调栈：栈底（队首）被"窗口左边界"这个新约束淘汰，所以要从栈退化成双端队列。
- "下标 ≤ 值都弹出"的底气：**更老且更小**的元素在剩余生命周期里永远被新值压制，留着无意义。
- 存下标而非值的原因：过期判断 `dq[0] <= i - k` 需要位置信息，这也是很多单调结构（84 题柱状图）的统一选择。

---
title: "121. 买卖股票的最佳时机"
number: 121
difficulty: Easy
tags: ["数组", "贪心", "动态规划"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/"
related: [122, 121]
summary: "贪心记录历史最低价格，每天计算当前利润取最大值。"
starred: false
date: 2024-01-01
---

## 题目描述

给定数组 prices，prices[i] 表示第 i 天的股票价格。只能买卖一次，求最大利润。

## 解题思路

维护历史最低价格，每天用当前价格减去历史最低价，取最大差值。

贪心在于——最终最大利润一定是在某个"历史最低点"买入，在之后某个点卖出。所以只需要记录遍历过程中的最低点。

## 代码实现

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

## 关键要点

- 贪心记录历史最低价格，每天计算当前利润取最大值。


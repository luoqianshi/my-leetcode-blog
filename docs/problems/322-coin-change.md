---
title: "322. 零钱兑换"
number: 322
difficulty: Medium
tags: ["动态规划", "广度优先搜索"]
time_complexity: "O(amount × |coins|)"
space_complexity: "O(amount)"
leetcode_url: "https://leetcode.cn/problems/coin-change/"
related: [518, 322]
summary: "完全背包模板，dp[i] = min(dp[i - coin] + 1)。"
starred: false
date: 2024-01-01
---

## 题目描述

给定面额数组 coins 和总金额 amount，求最少硬币数。无法凑出返回 -1。

## 解题思路

与 LC279 几乎相同，`dp[i]` 表示凑出金额 i 的最少硬币数。

完全背包模板。如果先遍历 coins 再遍历 amount，则是"组合"（每种面额只用一次）；当前写法（先 amount 后 coins）是"排列"。对于求最少数量，两者结果相同。

## 代码实现

```python
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1
```

## 复杂度分析

- **时间复杂度**: O(amount × |coins|)
- **空间复杂度**: O(amount)

## 关键要点

- 完全背包模板，dp[i] = min(dp[i - coin] + 1)。


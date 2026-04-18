---
title: "11. 贪心算法"
description: 贪心每步选择局部最优，覆盖股票买卖、跳跃游戏、区间划分等经典场景，核心是证明局部最优能推导全局最优。
level: intermediate
count: 4
prev: /review/10-string-techniques
next: /review/12-backtracking
---

# 贪心算法

> 难度：⭐⭐⭐ | 核心思想：每一步都做当前看来最优的选择，不回头。关键是证明"局部最优 → 全局最优"。

## LC121. 买卖股票的最佳时机

**题目**：给定数组 prices，prices[i] 表示第 i 天的股票价格。只能买卖一次，求最大利润。

**思路**：维护历史最低价格，每天用当前价格减去历史最低价，取最大差值。

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

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：贪心在于——最终最大利润一定是在某个"历史最低点"买入，在之后某个点卖出。所以只需要记录遍历过程中的最低点。

---

## LC55. 跳跃游戏

**题目**：给定非负整数数组 nums，初始在第一个位置。每个元素代表最大跳跃长度，判断是否能到达最后一个位置。

**思路**：维护最远可达位置 `max_reach`，遍历每个位置，如果当前位置超过最远可达位置则无法继续。

```python
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        max_reach = 0
        for i in range(len(nums)):
            if i > max_reach:
                return False
            max_reach = max(max_reach, i + nums[i])
        return True
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：不需要真正去跳，只需要知道"能到达的最远位置"是否覆盖终点。

---

## LC45. 跳跃游戏 II

**题目**：同 LC55，但求到达终点的最少跳跃次数。

**思路**：维护当前跳跃能到达的边界 `end`，以及下一次跳跃能到达的最远位置 `farthest`。当遍历到 `end` 时，必须跳一次，跳跃次数 +1，并将 `end` 更新为 `farthest`。

```python
class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        end = 0
        farthest = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == end:
                jumps += 1
                end = farthest
        return jumps
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：贪心选择——在当前跳跃范围内的所有位置中，选择能跳最远的位置。`i == end` 触发"必须跳了"的条件。

---

## LC763. 划分字母区间

**题目**：将字符串 s 划分为尽可能多的片段，同一字母最多出现在一个片段中。

**思路**：先遍历一遍记录每个字母最后出现的位置，然后贪心地扩展当前片段——当遍历到当前片段中所有字母的最后位置时，就可以切割。

```python
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {ch: i for i, ch in enumerate(s)}
        result = []
        start = 0
        end = 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                result.append(end - start + 1)
                start = i + 1
        return result
```

**复杂度**：时间 O(n)，空间 O(1)（26个字母）

**关键点**：先预处理每个字符的最后出现位置，然后用贪心保证每个片段包含其内所有字符的完整出现。

---

## 总结

| 题目 | 贪心策略 | 验证方式 |
|------|---------|---------|
| LC121 | 记录历史最低价 | 最大利润一定来自某个最低点 |
| LC55 | 记录最远可达位置 | 能到终点即可，不需要最优路径 |
| LC45 | 每次跳到能覆盖最远的位置 | 局部最远选择 → 全局最少跳跃 |
| LC763 | 片段必须覆盖所有字符最后位置 | 贪心切割保证片段数最多 |

贪心的前提：**当前选择不会影响未来的选择空间**。如果不能保证这一点，就需要 DP 或回溯。

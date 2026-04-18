---
title: "19. 动态规划高级"
description: DP 的进阶技巧，覆盖乘积最大子数组、0-1背包、字符串DP、栈+DP混合等综合应用。
level: advanced
count: 4
prev: /review/18-binary-tree-advanced
next: /review/20-matrix
---

# 动态规划高级

> 难度：⭐⭐⭐⭐⭐ | 核心思想：高级 DP 问题往往状态转移不那么直观，需要深入分析问题本质，综合运用区间 DP、背包 DP、状态压缩等技巧。

## LC152. 乘积最大子数组

**题目**：给定整数数组 nums，找出乘积最大的非空连续子数组并返回其乘积。

**思路**：由于负数乘以负数变正数，需要同时维护当前最大乘积和最小乘积。遇到负数时，最大值和最小值交换。

```python
class Solution:
    def maxProduct(self, nums):
        max_prod = min_prod = result = nums[0]
        for num in nums[1:]:
            if num < 0:
                max_prod, min_prod = min_prod, max_prod
            max_prod = max(num, max_prod * num)
            min_prod = min(num, min_prod * num)
            result = max(result, max_prod)
        return result
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：与 LC53（最大子数组和）的区别在于乘法有负数翻转效应。当 num < 0 时，之前的最大正积乘以负数变成最小值，之前的最小负积乘以负数变成最大值，因此需要交换 max_prod 和 min_prod。

---

## LC416. 分割等和子集

**题目**：给定一个只包含正整数的非空数组，判断是否可以将其分割成两个子集，使得两个子集的元素和相等。

**思路**：等价于 0-1 背包问题——能否从数组中选出若干数使其和等于 target = sum / 2。`dp[j]` 表示能否凑出和为 j。

```python
class Solution:
    def canPartition(self, nums):
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            # 从后往前遍历，避免重复使用
            for j in range(target, num - 1, -1):
                dp[j] = dp[j] or dp[j - num]
        return dp[target]
```

**复杂度**：时间 O(n × target)，空间 O(target)

**关键点**：0-1 背包的经典应用。从后往前遍历确保每个数字只使用一次（如果从前往后遍历，同一数字可能被重复使用，变成完全背包）。`dp[j] = dp[j] or dp[j - num]` 表示"不选当前数"或"选当前数"。

---

## LC139. 单词拆分

**题目**：给定字符串 s 和单词字典 wordDict，判断 s 是否可以被拆分为一个或多个字典中的单词。

**思路**：`dp[i]` 表示 s[0:i] 是否可以被拆分。对每个位置 i，遍历所有可能的分割点 j，检查 s[j:i] 是否在字典中且 dp[j] 为 True。

```python
class Solution:
    def wordBreak(self, s, wordDict):
        word_set = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True  # 空字符串可拆分
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        return dp[n]
```

**复杂度**：时间 O(n²)，空间 O(n)

**关键点**：完全背包的变体。`dp[0] = True` 是重要的初始条件——空字符串永远可以被拆分。优化：限制 j 的范围不超过最大单词长度。

---

## LC32. 最长有效括号

**题目**：给定一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

**思路**：用栈存储下标。初始将 -1 入栈作为"基准"。遇到 '(' 入栈其下标，遇到 ')' 弹栈后用当前下标减去栈顶下标即为有效长度。

```python
class Solution:
    def longestValidParentheses(self, s):
        max_len = 0
        stack = [-1]  # 哨兵
        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)  # 新的基准
                else:
                    max_len = max(max_len, i - stack[-1])
        return max_len
```

**复杂度**：时间 O(n)，空间 O(n)

**关键点**：栈中存储下标而非字符——这样可以计算长度。`-1` 作为哨兵处理边界情况。当栈空时将当前右括号下标入栈作为新基准。例如 "(()" 的过程：push(0), push(1), pop→栈顶0, len=2-0=2。

**DP 解法（供理解）：**

```python
class Solution:
    def longestValidParentheses(self, s):
        n = len(s)
        dp = [0] * n
        max_len = 0
        for i in range(1, n):
            if s[i] == ')':
                if s[i - 1] == '(':
                    dp[i] = (dp[i - 2] if i >= 2 else 0) + 2
                elif i - dp[i - 1] - 1 >= 0 and s[i - dp[i - 1] - 1] == '(':
                    dp[i] = dp[i - 1] + 2 + (dp[i - dp[i - 1] - 2] if i - dp[i - 1] >= 2 else 0)
                max_len = max(max_len, dp[i])
        return max_len
```

---

## 总结

| 题目 | DP 类型 | 核心思想 |
|------|--------|---------|
| LC152 | 线性 DP（双状态） | 同时维护最大值和最小值 |
| LC416 | 0-1 背包 | 能否选出和为 target 的子集 |
| LC139 | 完全背包（字符串） | dp[i] = OR(dp[j] && s[j:i] in dict) |
| LC32 | 栈 / DP | 利用栈下标计算有效长度 |

高级 DP 的解题策略：
1. **识别本质**：看到"最大/最小/计数/是否可行"想 DP，然后将问题归类到背包、区间、字符串匹配等经典模型
2. **双状态**：遇到有负数、乘法等问题，考虑维护多个状态（max + min）
3. **初始条件**：仔细思考 dp[0] 的含义，往往是解题的关键
4. **空间优化**：熟练掌握一维化技巧（倒序遍历 = 0-1 背包，正序遍历 = 完全背包）

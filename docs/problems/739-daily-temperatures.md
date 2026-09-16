---
title: "739. 每日温度"
number: 739
difficulty: Medium
tags: ["栈", "单调栈"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/daily-temperatures/"
related: [84, 42]
summary: "单调递减栈：温度更高的那天到来时，栈里所有更冷的日子同时结算答案——下一个更大元素模板。"
starred: false
date: 2026-09-16
---

## 题目描述

给定一个整数数组 temperatures 表示每天的气温，返回一个数组 answer，其中 answer[i] 表示对于第 i 天，还要等几天才会有更高的气温。如果之后的气温都不会升高，用 0 表示。

## 解题思路

answer[i] 本质是"**下一个更大元素的距离**"。从左到右遍历，维护一个存下标的**单调递减栈**（栈顶到栈底温度递增，对应等待中的日子）：

- 当前温度 `t` 比栈顶下标对应的温度高：说明今天就是那些冷天的"升温日"，弹出并结算 `answer[j] = i - j`，直到栈顶不再更冷；
- 当前温度入栈，继续等待未来的升温。

每个下标入栈、出栈各一次，总操作 O(n)。栈中留下的下标永远等不到升温，answer 保持 0。

## 代码实现

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        answer = [0] * n
        stack = []                     # 存下标，对应温度单调递减
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                answer[j] = i - j      # j 等到了升温日 i
            stack.append(i)
        return answer
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 单调栈一次性解决"等待中"的一批元素：一个升温日的到来可让多个冷天同时出栈。
- 栈里存下标而非温度：答案需要位置差 `i - j`。
- 相等温度不出栈（`<` 而非 `<=`）也正确：等的天数以最后一次出现为准，先到者由后来者一并结算。
- 本题是"下一个更大元素"（NGE）家族的原型：496/503 题、84 题柱状图、42 题接雨水都是这一模板的变体。

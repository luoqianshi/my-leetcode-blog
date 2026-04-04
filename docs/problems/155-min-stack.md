---
title: "155. 最小栈"
number: 155
difficulty: Medium
tags: ["栈", "设计`"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/min-stack/"
related: [155]
summary: "最直觉的方法是用一个辅助栈同步记录当前最小值，或者用两个栈分别存储值和最小值。但更优雅的做法是\"辅助栈只记录最小值的变化\"——每当新元素小于等于当前最小值时，才..."
starred: false
date: 2024-01-01
---

## 题目描述

设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。实现 MinStack 类：MinStack() 初始化堆栈对象；void push(int val) 将元素val推入堆栈；void pop() 删除堆栈的顶部元素；int top() 获取堆栈顶部的元素；int getMin() 获取堆栈中的最小元素。

## 解题思路

最直觉的方法是用一个辅助栈同步记录当前最小值，或者用两个栈分别存储值和最小值。但更优雅的做法是"辅助栈只记录最小值的变化"——每当新元素小于等于当前最小值时，才将其压入辅助栈；弹出时，如果弹出的值等于辅助栈顶，辅助栈也弹出。这样辅助栈始终存储着每个历史时刻的最小值，且空间复杂度在最坏情况下仍然是 O(n)，但平均情况下更省空间。另一种更简洁的做法是"差值法"，用单栈存储与最小值的差值，但代码可读性较差。这里采用辅助栈法，代码简洁且易于理解。

## 代码实现

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self) -> None:
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点



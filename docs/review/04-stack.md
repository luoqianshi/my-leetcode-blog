---
title: "04. 栈基础"
description: 栈是后进先出数据结构，主要用于处理需要回溯的场景，覆盖括号匹配和辅助栈设计两个经典问题。
level: beginner
count: 2
prev: /review/03-two-pointers
next: /review/05-linked-list-basics
---

# 栈基础

栈（Stack）是一种后进先出（LIFO, Last In First Out）的数据结构，在算法面试中主要用于处理"需要回溯"的场景——匹配括号、函数调用、表达式求值、DFS 等。Python 中可以直接用 list 模拟栈：append() 入栈、pop() 出栈，[-1] 查看栈顶。

本模块精选两道栈的入门题：有效的括号是栈的"Hello World"，几乎每场面试都会出现；最小栈则是栈的进阶设计题，考察对栈操作的深入理解。掌握这两道题后，可以应对后续的字符串解码（394）、逆波兰表达式（150）等更复杂的栈题目。

**栈的核心操作速查**：

| 操作 | Python 实现 | 时间复杂度 |
|------|-------------|-----------|
| 入栈 | `stack.append(x)` | O(1) 均摊 |
| 出栈 | `stack.pop()` | O(1) |
| 查看栈顶 | `stack[-1]` | O(1) |
| 判空 | `not stack` | O(1) |
| 栈大小 | `len(stack)` | O(1) |

---

### 20. 有效的括号 | 简单
`标签: 栈, 字符串`

**题目描述**：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。有效字符串需满足：左括号必须用相同类型的右括号闭合；左括号必须以正确的顺序闭合；每个右括号都有一个对应的相同类型的左括号。

**示例**：
```
输入：s = "()"
输出：true

输入：s = "()[]{}"
输出：true

输入：s = "(]"
输出：false

输入：s = "([)]"
输出：false

输入：s = "{[]}"
输出：true
```

**思路分析**：这是栈最经典的应用场景。遍历字符串，遇到左括号就入栈，遇到右括号就检查栈顶是否是对应的左括号——如果是，弹出栈顶（配对成功）；如果不是，说明括号不匹配。遍历结束后，如果栈为空说明所有括号都正确配对。关键点在于使用哈希表建立右括号到左括号的映射，使代码更简洁。时间复杂度 O(n)，空间复杂度 O(n)（最坏情况全是左括号）。

```python
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                stack.append(ch)
        return not stack
```

**复杂度**：时间 O(n)，空间 O(n)

---

### 155. 最小栈 | 中等
`标签: 栈, 设计`

**题目描述**：设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。实现 MinStack 类：MinStack() 初始化堆栈对象；void push(int val) 将元素val推入堆栈；void pop() 删除堆栈的顶部元素；int top() 获取堆栈顶部的元素；int getMin() 获取堆栈中的最小元素。

**示例**：
```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
输出：
[null,null,null,null,-3,null,0,-2]
解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3
minStack.pop();
minStack.top();      --> 返回 0
minStack.getMin();   --> 返回 -2
```

**思路分析**：最直觉的方法是用一个辅助栈同步记录当前最小值，或者用两个栈分别存储值和最小值。但更优雅的做法是"辅助栈只记录最小值的变化"——每当新元素小于等于当前最小值时，才将其压入辅助栈；弹出时，如果弹出的值等于辅助栈顶，辅助栈也弹出。这样辅助栈始终存储着每个历史时刻的最小值，且空间复杂度在最坏情况下仍然是 O(n)，但平均情况下更省空间。另一种更简洁的做法是"差值法"，用单栈存储与最小值的差值，但代码可读性较差。这里采用辅助栈法，代码简洁且易于理解。

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

**复杂度**：所有操作均为 O(1) 时间，空间 O(n)

---
title: "146. LRU 缓存"
number: 146
difficulty: Medium
tags: ["链表", "哈希表", "设计"]
time_complexity: "O(n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/lru-cache/"
related: [146]
summary: "哈希表 + 双向链表 / OrderedDict 实现 LRU 缓存。"
starred: false
date: 2024-01-01
---

## 题目描述

设计 LRU（最近最少使用）缓存，支持 get 和 put 操作，均 O(1) 时间。

## 解题思路

哈希表 + 双向链表。哈希表存储 key → 节点的映射，双向链表维护访问顺序（头部最近，尾部最久）。Python 可用 `OrderedDict` 直接实现。

`OrderedDict` 的 `move_to_end` 将 key 移到字典末尾（最近使用），`popitem(last=False)` 弹出最前面的元素（最久未使用）。这是面试中链表 + 哈希表的经典设计题，需要能手写双向链表版本。

**手写双向链表版本（面试时可能被要求）：**

```python
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key → Node
        self.head = Node()  # 哨兵头
        self.tail = Node()  # 哨兵尾
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add_to_front(node)
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
```

## 代码实现

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.cap = capacity

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # 移到最近使用
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # 移除最久未使用
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(n)

## 关键要点

- 哈希表 + 双向链表 / OrderedDict 实现 LRU 缓存。


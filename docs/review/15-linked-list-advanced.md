---
title: "15. 链表进阶"
description: 链表的进阶操作，覆盖入环点检测、归并排序、K路合并、LRU缓存、大数加法等综合应用。
level: intermediate
count: 6
prev: /review/14-1d-dp
next: /review/16-graph
---

# 链表进阶

> 难度：⭐⭐⭐⭐ | 核心思想：链表进阶问题涉及带环链表检测、链表排序、合并 K 个链表等，考察指针操作的精细控制能力和对链表结构的深刻理解。

## LC142. 环形链表 II

**题目**：给定链表头节点，返回链表开始入环的第一个节点。如果无环则返回 null。

**思路**：快慢指针。快指针每次走两步，慢指针每次走一步。快慢相遇后，将一个指针移回 head，两者同步前进，再次相遇处即为入环点。

**数学原理**：设头到入环点距离 a，入环点到相遇点距离 b，环长 c。相遇时快指针走了 a + b + k*c，慢指针走了 a + b。由于快是慢的两倍：2(a+b) = a + b + k*c → a = k*c - b = (k-1)*c + (c-b)。即从 head 走 a 步等于从相遇点走 (k-1)*c + (c-b) 步——都是从相遇点出发绕若干圈后再走 c-b 步到达入环点。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                # 找到相遇点，开始找入环点
                ptr = head
                while ptr is not slow:
                    ptr = ptr.next
                    slow = slow.next
                return ptr
        return None
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：与 LC141（只判断是否有环）的区别在于，找到相遇点后需要第二次遍历来定位入环节点。注意判断 `is` 而非 `==`，因为节点可能值相同但不是同一对象。

---

## LC21. 合并两个有序链表

**题目**：将两个升序链表合并为一个新的升序链表并返回。

**思路**：迭代法。维护一个 dummy 头节点和一个 tail 指针，每次比较两个链表的头节点，将较小的接到 tail 后面。

```python
class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next
```

**复杂度**：时间 O(m+n)，空间 O(1)

**关键点**：dummy 节点简化了头节点的处理。`tail.next = list1 or list2` 优雅地处理了剩余部分。

---

## LC148. 排序链表

**题目**：对链表进行排序，要求 O(n log n) 时间复杂度和 O(1) 级额外空间。

**思路**：归并排序的链表版本。找中点（快慢指针），递归排序两半，合并两个有序链表。

```python
class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head
        # 找中点
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        mid = slow.next
        slow.next = None  # 断开
        # 递归排序
        left = self.sortList(head)
        right = self.sortList(mid)
        # 合并
        return self._merge(left, right)

    def _merge(self, l1, l2):
        dummy = tail = ListNode()
        while l1 and l2:
            if l1.val <= l2.val:
                tail.next, l1 = l1, l1.next
            else:
                tail.next, l2 = l2, l2.next
            tail = tail.next
        tail.next = l1 or l2
        return dummy.next
```

**复杂度**：时间 O(n log n)，空间 O(log n)（递归栈）

**关键点**：找中点时 `fast = head.next`（而非 `head`）确保偶数个节点时左半部分更短，避免死循环。归并排序天然适合链表——不需要额外空间，只需修改指针。

---

## LC23. 合并 K 个升序链表

**题目**：合并 k 个升序链表为一个升序链表。

**思路**：优先队列（最小堆）。将所有链表头节点放入堆，每次弹出最小节点，将其 next（如果存在）推入堆。

```python
import heapq

class Solution:
    def mergeKLists(self, lists):
        min_heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(min_heap, (node.val, i, node))
        dummy = tail = ListNode()
        while min_heap:
            val, i, node = heapq.heappop(min_heap)
            tail.next = node
            tail = tail.next
            if node.next:
                heapq.heappush(min_heap, (node.next.val, i, node.next))
        return dummy.next
```

**复杂度**：时间 O(n log k)，空间 O(k)，其中 n 为所有链表节点总数，k 为链表数。

**关键点**：用 `(val, i, node)` 三元组避免节点比较失败（Python 3 不支持直接比较 ListNode）。`i` 是链表索引，作为 tiebreaker 确保堆元素可比较。逐个节点操作，每次堆操作 O(log k)。

---

## LC146. LRU 缓存

**题目**：设计 LRU（最近最少使用）缓存，支持 get 和 put 操作，均 O(1) 时间。

**思路**：哈希表 + 双向链表。哈希表存储 key → 节点的映射，双向链表维护访问顺序（头部最近，尾部最久）。Python 可用 `OrderedDict` 直接实现。

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

**复杂度**：get 和 put 均 O(1)

**关键点**：`OrderedDict` 的 `move_to_end` 将 key 移到字典末尾（最近使用），`popitem(last=False)` 弹出最前面的元素（最久未使用）。这是面试中链表 + 哈希表的经典设计题，需要能手写双向链表版本。

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

---

## LC2. 两数相加

**题目**：两个非空链表表示两个非负整数，各位数字逆序存储，求两数之和也用链表表示。

**思路**：逐位相加，维护进位。注意最高位可能产生新的进位。

```python
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            s = carry
            if l1:
                s += l1.val
                l1 = l1.next
            if l2:
                s += l2.val
                l2 = l2.next
            carry, s = divmod(s, 10)
            tail.next = ListNode(s)
            tail = tail.next
        return dummy.next
```

**复杂度**：时间 O(max(m,n))，空间 O(max(m,n))

**关键点**：`while l1 or l2 or carry` 优雅地处理了不同长度和最终进位。`divmod(s, 10)` 同时得到商（进位）和余数（当前位）。

---

## 总结

| 题目 | 核心技巧 | 难度 |
|------|---------|------|
| LC142 | 快慢指针 + 数学推导找入环点 | 中等 |
| LC21 | 迭代合并，dummy 节点 | 简单 |
| LC148 | 归并排序（链表版） | 中等 |
| LC23 | 最小堆合并 K 个链表 | 困难 |
| LC146 | 哈希表 + 双向链表 / OrderedDict | 中等 |
| LC2 | 逐位相加 + 进位处理 | 中等 |

链表进阶的核心能力：
1. 快慢指针的高级应用（找中点、找入环点）
2. dummy 节点和哨兵节点的使用
3. 链表归并排序
4. 堆与链表结合（合并 K 个有序链表）
5. 链表 + 哈希表的系统设计（LRU）

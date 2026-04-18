---
title: "05. 链表入门"
description: 链表是面试高频数据结构，覆盖相交检测、反转、合并、环检测四个基础操作，掌握指针操控的核心技巧。
level: beginner
count: 4
prev: /review/04-stack
next: /review/06-binary-tree-basics
---

# 链表入门

链表（Linked List）是面试中仅次于数组和哈希表的高频数据结构。与数组的连续内存不同，链表通过指针将分散的节点串联起来，这使得插入和删除操作（在已知位置时）可以达到 O(1) 时间复杂度。但代价是随机访问需要 O(n) 时间。

本模块精选四道链表入门题：反转链表是链表操作的基石，几乎每个链表难题都会用到；合并两个有序链表展示递归与迭代的对比；相交链表考验对链表结构的数学思维；环形链表是 Floyd 快慢指针的经典应用。这四道题覆盖了链表操作的四大基本功：遍历、修改指针、合并、检测环。

**链表核心技巧速查**：

| 技巧 | 适用场景 | 核心操作 |
|------|----------|----------|
| 哑节点 | 头部可能被修改 | `dummy = ListNode(0, head)` |
| 快慢指针 | 检测环/找中点 | fast每次2步，slow每次1步 |
| 递归 | 反转/合并 | 从子问题到原问题 |
| 双指针 | 倒数/交点 | 维护距离差或同步前进 |

---

### 160. 相交链表 | 简单
`标签: 哈希表, 链表, 双指针`

**题目描述**：给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null。整个链式结构中不存在环。注意，函数返回结果后，链表必须保持其原始结构。

**示例**：
```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'
解释：相交节点的值为 8（注意，如果两个链表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
```

**思路分析**：最直观的方法是用哈希表记录链表A的所有节点，然后遍历链表B看哪个节点已经在哈希表中。但更优雅的双指针解法利用了"消除长度差"的思想：指针 pA 从 headA 出发走完A链表后切换到 headB，指针 pB 从 headB 出发走完B链表后切换到 headA。这样两者走过的总路径长度相等（lenA + lenB），如果有交点，它们一定会在交点处相遇。如果无交点，它们会同时到达 null。这种"走完一条链再走另一条"的技巧非常巧妙，代码也极为简洁。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if not headA or not headB:
            return None
        pA, pB = headA, headB
        while pA != pB:
            pA = pA.next if pA else headB
            pB = pB.next if pB else headA
        return pA
```

**复杂度**：时间 O(m + n)，空间 O(1)

---

### 206. 反转链表 | 简单
`标签: 递归, 链表`

**题目描述**：给你单链表的头节点 head，请你反转链表，并返回反转后的链表。

**示例**：
```
输入：head = [1, 2, 3, 4, 5]
输出：[5, 4, 3, 2, 1]

输入：head = [1, 2]
输出：[2, 1]

输入：head = []
输出：[]
```

**思路分析**：反转链表有两种经典写法——迭代法和递归法。迭代法使用三个指针 prev、curr、next，遍历链表时将 curr.next 指向 prev，然后三个指针整体前进一步。递归法则先递归到链表末尾，然后在回溯过程中逐层修改指针。面试中推荐掌握迭代法（更常用、不易栈溢出），同时也理解递归法的思想。

迭代法思路：prev 初始为 null，curr 从 head 开始。每次循环：先用 next 记录 curr.next（防止断链），然后将 curr.next 指向 prev（反转指针），最后 prev 和 curr 都前进一步。循环结束后 prev 就是新的头节点。

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev
```

**复杂度**：时间 O(n)，空间 O(1)

---

### 21. 合并两个有序链表 | 简单
`标签: 递归, 链表`

**题目描述**：将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

**示例**：
```
输入：l1 = [1, 2, 4], l2 = [1, 3, 4]
输出：[1, 1, 2, 3, 4, 4]

输入：l1 = [], l2 = []
输出：[]
```

**思路分析**：这道题同时展示了递归和迭代两种链表操作范式。递归法非常优雅：比较两个头节点的值，较小的作为结果头节点，其 next 指向剩余部分的合并结果。迭代法则使用哑节点简化头节点处理，维护一个 tail 指针，每次将较小的节点接到 tail 后面。两种方法时间复杂度相同，递归法代码更简洁但有栈溢出风险（链表过长时），迭代法更稳妥。

```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2
        return dummy.next
```

**复杂度**：时间 O(m + n)，空间 O(1)

---

### 141. 环形链表 | 简单
`标签: 哈希表, 链表, 双指针`

**题目描述**：给你一个链表的头节点 head，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递。仅仅是为了标识链表的实际情况。如果链表中存在环，则返回 true，否则返回 false。

**示例**：
```
输入：head = [3, 2, 0, -4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。

输入：head = [1, 2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。

输入：head = [1], pos = -1
输出：false
```

**思路分析**：检测环的最经典方法是 Floyd 快慢指针（也叫龟兔赛跑算法）。快指针每次走两步，慢指针每次走一步。如果链表有环，快指针最终一定会追上慢指针（在环内"套圈"）；如果无环，快指针会先到达 null。这个方法空间复杂度仅为 O(1)，比哈希表方法更优。证明思路：进入环后，快指针相对于慢指针的速度为 1（每次多走一步），相当于快指针在以步长 1 靠近慢指针，在有环的情况下一定会相遇。

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow, fast = head, head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        return False
```

**复杂度**：时间 O(n)，空间 O(1)

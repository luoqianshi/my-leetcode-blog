---
title: "10. 字符串技巧"
description: 前缀和与递归解码——字符串问题往往是数组问题的伪装，加上编码技巧。
level: intermediate
count: 2
prev: /review/09-binary-search
next: /review/11-greedy
---

# 字符串技巧

> 难度：⭐⭐⭐ | 核心思想：前缀和、递归解码——字符串问题往往是数组问题的伪装，加上一些编码技巧。

## LC560. 和为 K 的子数组

**题目**：给定整数数组 nums 和整数 k，统计数组中和为 k 的连续子数组的个数。

**思路**：前缀和 + 哈希表。前缀和 `pre[j] - pre[i] = k` 等价于 `pre[j] - k = pre[i]`。遍历时用哈希表记录之前出现过的前缀和及其频率。

```python
class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        prefix_count = {0: 1}
        count = 0
        prefix_sum = 0
        for num in nums:
            prefix_sum += num
            count += prefix_count.get(prefix_sum - k, 0)
            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
        return count
```

**复杂度**：时间 O(n)，空间 O(n)

**关键点**：`prefix_count = {0: 1}`——前缀和本身为 0 的情况要初始化进去，否则 `prefix_sum == k` 的情况会被漏掉。

---

## LC394. 字符串解码

**题目**：给定编码字符串 `k[encoded_string]`，返回解码后的字符串。支持嵌套。

**思路**：用两个栈——数字栈和字符串栈。遇到数字进数字栈，遇到 `[` 进当前字符串到栈并重置，遇到 `]` 弹出并拼接。

```python
class Solution:
    def decodeString(self, s: str) -> str:
        num_stack = []
        str_stack = []
        current_str = ""
        current_num = 0
        for ch in s:
            if ch.isdigit():
                current_num = current_num * 10 + int(ch)
            elif ch == '[':
                num_stack.append(current_num)
                str_stack.append(current_str)
                current_str = ""
                current_num = 0
            elif ch == ']':
                current_str = str_stack.pop() + current_str * num_stack.pop()
            else:
                current_str += ch
        return current_str
```

**复杂度**：时间 O(n)，空间 O(n)

**关键点**：双栈的配合——数字栈控制重复次数，字符串栈保存当前层的状态。遇到 `]` 时弹出并重建，完美处理嵌套。注意数字可能是多位数（`current_num = current_num * 10 + int(ch)`）。

---

## 总结

| 题目 | 核心技巧 | 一句话总结 |
|------|---------|-----------|
| LC560 | 前缀和 + 哈希 | 用哈希表查"之前是否存在某个前缀和" |
| LC394 | 双栈 | 数字栈管次数，字符串栈管层级 |

这两道题虽然分类在字符串，但本质都是通用算法思维在前缀/编码场景下的应用。

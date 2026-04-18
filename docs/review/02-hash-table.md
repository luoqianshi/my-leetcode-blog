---
title: "02. 哈希表基础"
description: 哈希表通过哈希函数将键映射到存储位置，查找、插入、删除均为 O(1)，覆盖查找补数、特征分组、连续性判断三大场景。
level: beginner
count: 3
prev: /review/01-bit-manipulation
next: /review/03-two-pointers
---

# 哈希表基础

哈希表（Hash Table）是算法面试中出现频率最高的数据结构，没有之一。它通过哈希函数将键映射到存储位置，使得查找、插入、删除操作的平均时间复杂度均为 O(1)。在 LeetCode Hot 100 中，哈希表相关题目几乎贯穿所有难度级别。

本模块精选三道哈希表基础题：两数之和是哈希表的"Hello World"，字母异位词分组考察哈希表的灵活构造，最长连续序列则是哈希表与数学思维的结合。这三道题分别展示了哈希表在"查找补数"、"特征分组"、"连续性判断"三个场景下的经典用法。

**哈希表核心速查**：

| 场景 | 数据结构 | Python 实现 | 查找复杂度 |
|------|----------|-------------|-----------|
| 键值映射 | 哈希表 | `dict` | O(1) |
| 去重 | 哈希集合 | `set` | O(1) |
| 计数 | 计数器 | `Counter` | O(1) |
| 有序映射 | 有序哈希 | `OrderedDict` | O(log n) |

---

### 1. 两数之和 | 简单
`标签: 数组, 哈希表`

**题目描述**：给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案，并且不能使用同一个元素两次。

**示例**：
```
输入：nums = [2, 7, 11, 15], target = 9
输出：[0, 1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]

输入：nums = [3, 2, 4], target = 6
输出：[1, 2]
```

**思路分析**：暴力解法是双层循环 O(n²)，但利用哈希表可以优化到 O(n)。核心思想是：遍历数组时，对于当前元素 num，检查 target - num 是否已经在哈希表中（即之前遍历过）。如果在，直接返回两个下标；如果不在，将当前元素及其下标存入哈希表。这种"一边遍历、一边查找"的方式将查找过程从 O(n) 降到了 O(1)。

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
```

**复杂度**：时间 O(n)，空间 O(n)

---

### 49. 字母异位词分组 | 中等
`标签: 数组, 哈希表, 字符串, 排序`

**题目描述**：给你一个字符串数组 strs，请你将字母异位词组合在一起。可以按任意顺序返回结果列表。字母异位词是由重新排列源单词的所有字母得到的一个新单词。

**示例**：
```
输入：strs = ["eat","tea","tan","ate","nat","bat"]
输出：[["bat"],["nat","tan"],["ate","eat","tea"]]

输入：strs = [""]
输出：[[""]]
```

**思路分析**：字母异位词的特征是：字母相同、顺序不同。因此关键在于找到一种"与字母顺序无关"的标识。有两种主流方法：(1) 排序法：将字符串排序后作为哈希表的键，如 "eat" → "aet"，"tea" → "aet"，两者映射到同一个键。(2) 计数法：统计每个字母的出现次数，将其转化为元组作为键，如 "eat" → (1,0,0,...,1,0,...,1,0,...)（表示 a、e、t 各出现一次）。排序法代码更简洁，计数法在字符串较长时效率更高。这里采用排序法。

```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}
        for s in strs:
            key = ''.join(sorted(s))
            if key not in groups:
                groups[key] = []
            groups[key].append(s)
        return list(groups.values())
```

**复杂度**：时间 O(n·k·log k)（n 为字符串数量，k 为字符串平均长度），空间 O(n·k)

---

### 128. 最长连续序列 | 中等
`标签: 并查集, 数组, 哈希表`

**题目描述**：给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

**示例**：
```
输入：nums = [100, 4, 200, 1, 3, 2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]，长度为 4。

输入：nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
输出：9
```

**思路分析**：如果先排序再遍历，时间复杂度 O(n log n)，不满足要求。核心技巧是利用哈希集合实现 O(1) 查找。先将所有数字放入集合，然后遍历数组，对于每个数字 num，只当 num - 1 不在集合中时（说明 num 是某个连续序列的起点），才向右不断检查 num + 1, num + 2, ... 是否在集合中，统计序列长度。这个"只从起点开始检查"的优化确保了每个数字最多被访问两次（一次作为起点遍历序列，一次在别的序列中被跳过），整体时间复杂度 O(n)。

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        num_set = set(nums)
        longest = 0
        for num in nums:
            # 只有当num是序列起点时才检查
            if num - 1 not in num_set:
                current = num
                length = 1
                while current + 1 in num_set:
                    current += 1
                    length += 1
                longest = max(longest, length)
        return longest
```

**复杂度**：时间 O(n)，空间 O(n)

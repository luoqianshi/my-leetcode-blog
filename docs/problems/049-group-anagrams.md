---
title: "049. 字母异位词分组"
number: 49
difficulty: Medium
tags: ["数组", "哈希表", "字符串", "排序`"]
time_complexity: "O(n·k·log k)"
space_complexity: "O(n·k)"
leetcode_url: "https://leetcode.cn/problems/group-anagrams/"
related: [242, 49]
summary: "字母异位词的特征是：字母相同、顺序不同。因此关键在于找到一种\"与字母顺序无关\"的标识。有两种主流方法：(1) 排序法：将字符串排序后作为哈希表的键，如 \"eat..."
starred: false
date: 2024-01-01
---

## 题目描述

给你一个字符串数组 strs，请你将字母异位词组合在一起。可以按任意顺序返回结果列表。字母异位词是由重新排列源单词的所有字母得到的一个新单词。

## 解题思路

字母异位词的特征是：字母相同、顺序不同。因此关键在于找到一种"与字母顺序无关"的标识。有两种主流方法：(1) 排序法：将字符串排序后作为哈希表的键，如 "eat" → "aet"，"tea" → "aet"，两者映射到同一个键。(2) 计数法：统计每个字母的出现次数，将其转化为元组作为键，如 "eat" → (1,0,0,...,1,0,...,1,0,...)（表示 a、e、t 各出现一次）。排序法代码更简洁，计数法在字符串较长时效率更高。这里采用排序法。

## 代码实现

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

## 复杂度分析

- **时间复杂度**: O(n·k·log k)
- **空间复杂度**: O(n·k)

## 关键要点



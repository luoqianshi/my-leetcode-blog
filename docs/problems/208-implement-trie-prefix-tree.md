---
title: "208. 实现 Trie（前缀树）"
number: 208
difficulty: Medium
tags: ["字典树", "设计", "哈希表"]
time_complexity: "O(n)"
space_complexity: "O(总字符数)"
leetcode_url: "https://leetcode.cn/problems/implement-trie-prefix-tree/"
related: [208]
summary: "Trie 前缀树，每个节点用字典存储子节点，支持 insert/search/startsWith。"
starred: false
date: 2024-01-01
---

## 题目描述

实现前缀树，支持 insert、search 和 startsWith 操作。

## 解题思路

每个节点包含 children 字典和一个 is_end 标记。insert 逐字符创建节点，search 需要匹配到最后一个字符且 is_end 为 True，startsWith 只需匹配到最后一个字符。

Trie 的核心是每个节点用字典存储子节点，而非数组（更节省空间）。Trie 的典型应用包括：自动补全、拼写检查、IP 路由。变体：压缩前缀树（Radix Tree）合并单分支节点。

## 代码实现

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
```

## 复杂度分析

- **时间复杂度**: O(n)
- **空间复杂度**: O(总字符数)

## 关键要点

- Trie 前缀树，每个节点用字典存储子节点，支持 insert/search/startsWith。


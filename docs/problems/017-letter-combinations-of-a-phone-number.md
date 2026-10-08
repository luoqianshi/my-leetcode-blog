---
title: "017. 电话号码的字母组合"
number: 17
difficulty: Medium
tags: ["回溯", "字符串"]
time_complexity: "O(4^n × n)"
space_complexity: "O(n)"
leetcode_url: "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/"
related: [22, 46]
summary: " digits 的每个位置都是一棵分支树，回溯枚举每个数字对应的所有字母即可，属于无剪枝的乘积型回溯。"
starred: false
date: 2026-09-16
---

## 题目描述

给定一个仅包含数字 2-9 的字符串 digits，返回它能表示的字母组合。数字到字母的映射与电话按键相同（2→abc，3→def，…，9→wxyz）。答案可以按任意顺序返回。

## 解题思路

把每个数字对应的字母集合看成一棵"多层选择树"：第 0 层选 digits[0] 的某个字母，第 1 层选 digits[1] 的某个字母……当 path 长度等于 digits 长度时，收集结果。

这是标准的**指数型（乘积型）回溯**：

1. 递归参数 `index` 表示当前处理 digits 的第几位；
2. 每层枚举该数字对应的 3~4 个字母，依次选择 → 递归 → 撤销；
3. 终止条件：`index == len(digits)`，把 path 拼接成字符串收集。

注意空串的边界：digits 为空时没有组合，应返回 `[]` 而不是 `[""]`。

## 代码实现

```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        phone = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
                 '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
        result, path = [], []

        def backtrack(index: int) -> None:
            if index == len(digits):
                result.append(''.join(path))
                return
            for ch in phone[digits[index]]:
                path.append(ch)
                backtrack(index + 1)
                path.pop()

        backtrack(0)
        return result
```

## 复杂度分析

- **时间复杂度**: O(4^n × n)，每个数字最多 4 个字母（7 和 9），n 为 digits 长度
- **空间复杂度**: O(n)，递归深度与 path 长度（不计结果数组）

## 关键要点

- 乘积型回溯：答案总数是各层分支数的乘积，与全排列的"交换型"回溯区分开。
- `index == len(digits)` 时才收集，且此时 path 一定非空——所以空输入必须在入口特判。
- 用 `path` 列表 + 最后 `join`，比每层做字符串拼接更高效（字符串不可变，反复拼接是 O(n²)）。

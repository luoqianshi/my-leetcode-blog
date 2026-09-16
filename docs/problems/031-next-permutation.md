---
title: "031. 下一个排列"
number: 31
difficulty: Medium
tags: ["数组", "双指针"]
time_complexity: "O(n)"
space_complexity: "O(1)"
leetcode_url: "https://leetcode.cn/problems/next-permutation/"
related: [46, 75]
summary: "从右往左找第一个降序点 i，再从右找第一个大于 nums[i] 的数交换，最后把 i 之后的部分反转。"
starred: false
date: 2026-09-16
---

## 题目描述

将给定整数数组重新排列成字典序中下一个更大的排列。如果不存在下一个更大的排列，则将数组重新排列成最小的排列（即升序）。必须原地修改，只允许 O(1) 额外空间。

## 解题思路

"下一个排列"是比当前排列大且最接近的那一个。三步法：

1. **从右向左找第一个降序点 i**：找到第一处 `nums[i] < nums[i+1]`。i 右侧是**非递增**（从左往右看递减）的后缀，它已是自身最大排列，没法再变大，只能动 nums[i]。
2. **从右向左找第一个大于 nums[i] 的数 j**，交换 `nums[i]` 和 `nums[j]`。j 是右侧后缀中"刚大于 nums[i]"的数，保证变大幅度最小。
3. **反转 i 之后的后缀**：交换后 i 右侧仍保持非递增，反转成非递减，得到该前缀下的最小后缀。

若第 1 步找不到 i，整个数组是非递增的，即最大排列，直接全部反转得到最小排列。

## 代码实现

```python
class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        n = len(nums)
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:  # 1. 找第一个降序点
            i -= 1
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:             # 2. 找刚大于 nums[i] 的数
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])     # 3. 反转后缀
```

## 复杂度分析

- **时间复杂度**: O(n)，三次线性扫描
- **空间复杂度**: O(1)，原地修改

## 关键要点

- 为什么交换后后缀仍然非递增：j 是从右往左第一个大于 nums[i] 的位置，交换后 nums[j] 位置放的是更小的原 nums[i]，后缀有序性不被破坏。
- 反转用 `reversed()` 切片赋值，等价于双指针原地交换，仍满足 O(1) 空间（reversed 返回迭代器而非拷贝）。
- [1,1,5] → [1,5,1] 验证了"降序点"必须用 `>=` 跳过相等情况，否则重复元素间交换会得到更小的排列。

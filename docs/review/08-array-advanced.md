---
title: "08. 数组进阶技巧"
description: 前缀和、分治、原地操作——数组问题的三大杀手锏，掌握 Kadane、排序合并、前缀积、三次翻转等核心技巧。
level: intermediate
count: 4
prev: /review/07-sliding-window
next: /review/09-binary-search
---

# 数组进阶技巧

> 难度：⭐⭐⭐ | 核心思想：前缀和、分治、原地操作——数组问题的三大杀手锏。

## LC53. 最大子数组和

**题目**：给定整数数组 nums，找到和最大的连续子数组，返回其和。

**思路**：动态规划，dp[i] 表示以 nums[i] 结尾的最大子数组和。如果前一个状态为负，不如从当前重新开始。

```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        dp = nums[0]
        result = nums[0]
        for i in range(1, len(nums)):
            dp = max(dp + nums[i], nums[i])
            result = max(result, dp)
        return result
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：Kadane 算法的精髓——`dp = max(dp + nums[i], nums[i])`，即"带着前缀走"还是"从零开始"的抉择。

---

## LC56. 合并区间

**题目**：将所有重叠区间合并。

**思路**：先按区间起点排序，然后依次合并——当前区间的起点小于等于上一个区间的终点时，合并（取更大的终点）。

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        if not intervals:
            return []
        intervals.sort(key=lambda x: x[0])
        result = [intervals[0]]
        for start, end in intervals[1:]:
            if start <= result[-1][1]:
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])
        return result
```

**复杂度**：时间 O(n log n)（排序），空间 O(log n)（排序栈空间）

**关键点**：排序后，所有可能重叠的区间都变成相邻的了，只需线性扫描。

---

## LC238. 除自身以外数组的乘积

**题目**：给定数组 nums，返回数组 answer，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。不能用除法。

**思路**：两次遍历——第一次从左到右记录每个位置左侧所有元素的乘积，第二次从右到左乘上右侧所有元素的乘积。

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        answer = [1] * n
        # 左侧乘积
        left = 1
        for i in range(n):
            answer[i] = left
            left *= nums[i]
        # 右侧乘积
        right = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= right
            right *= nums[i]
        return answer
```

**复杂度**：时间 O(n)，空间 O(1)（输出数组不算额外空间）

**关键点**：前缀积 + 后缀积的思想，两次线性遍历代替了一次 O(n^2) 的暴力计算。空间优化到 O(1) 的关键是复用输出数组。

---

## LC189. 轮转数组

**题目**：将数组向右轮转 k 步。

**思路**：三次翻转法。翻转整个数组，再分别翻转前 k 个和剩余部分。注意 k 需取模。

```python
class Solution:
    def rotate(self, nums: list[int], k: int) -> None:
        n = len(nums)
        k %= n
        def reverse(i, j):
            while i < j:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
                j -= 1
        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)
```

**复杂度**：时间 O(n)，空间 O(1)

**关键点**：三次翻转 = 环状替换的优雅实现。`[1,2,3,4,5]` → 翻转全部 → `[5,4,3,2,1]` → 翻转前 k=2 → `[4,5,3,2,1]` → 翻转后 n-k=3 → `[4,5,1,2,3]`。

---

## 总结

| 题目 | 核心技巧 | 一句话总结 |
|------|---------|-----------|
| LC53 | 动态规划 | 负前缀不如重新开始 |
| LC56 | 排序 + 贪心 | 排序后重叠变相邻 |
| LC238 | 前缀积 + 后缀积 | 两次遍历代替暴力乘法 |
| LC189 | 三次翻转 | 翻转是原地操作之王 |

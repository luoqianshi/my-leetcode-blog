---
title: "09. 二分查找"
description: 二分查找不只是有序数组查找，更是一种将搜索空间减半的思维模式，覆盖标准二分、边界查找、旋转数组、矩阵搜索。
level: intermediate
count: 4
prev: /review/08-array-advanced
next: /review/10-string-techniques
---

# 二分查找

> 难度：⭐⭐⭐ | 核心思想：在有序区间上，通过不断折半缩小搜索范围，在 O(log n) 时间内定位目标。难点在于边界的处理。

## LC35. 搜索插入位置

**题目**：给定排序数组和一个目标值，返回目标值应插入的位置。如果目标已存在，返回其索引。

**思路**：标准二分，最终 left 就是第一个大于等于 target 的位置。

```python
class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left
```

**复杂度**：时间 O(log n)，空间 O(1)

**关键点**：`right = len(nums)` 而非 `len(nums) - 1`，用左闭右开区间 `[left, right)`，这样 left 自然就是插入位置。

---

## LC34. 在排序数组中查找元素的第一个和最后一个位置

**题目**：给定升序数组 nums 和目标值，返回目标值在数组中的起始和结束位置。

**思路**：两次二分——第一次找左边界（第一个 ≥ target 的位置），第二次找右边界（最后一个 ≤ target 的位置，即第一个 > target 的位置再减一）。

```python
class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        def lower_bound():
            left, right = 0, len(nums)
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid
            return left

        def upper_bound():
            left, right = 0, len(nums)
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] <= target:
                    left = mid + 1
                else:
                    right = mid
            return left

        lo = lower_bound()
        hi = upper_bound() - 1
        if lo <= hi:
            return [lo, hi]
        return [-1, -1]
```

**复杂度**：时间 O(log n)，空间 O(1)

**关键点**：lower_bound 和 upper_bound 是二分的两个基本变体。lower_bound 找 `第一个 ≥ target`，upper_bound 找 `第一个 > target`。两者差一运算符。

---

## LC33. 搜索旋转排序数组

**题目**：数组在某个未知的枢轴点被旋转，搜索给定的目标值。

**思路**：旋转数组仍然满足"一半有序"的性质。每次判断 mid 落在有序的哪一半，再确定 target 在哪一半。

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            # 左半有序
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            # 右半有序
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1
```

**复杂度**：时间 O(log n)，空间 O(1)

**关键点**：虽然整体无序，但旋转后的数组总是"一半有序、一半无序"的。先判断哪半有序，再判断 target 是否在有序的那半。

---

## LC74. 搜索二维矩阵

**题目**：每行从左到右升序，每行第一个数大于上一行最后一个数。搜索目标值。

**思路**：把二维矩阵"展平"看成一维有序数组，二分查找。`mid` 对应矩阵中 `(mid // n, mid % n)` 的位置。

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1
        while left <= right:
            mid = left + (right - left) // 2
            val = matrix[mid // n][mid % n]
            if val == target:
                return True
            elif val < target:
                left = mid + 1
            else:
                right = mid - 1
        return False
```

**复杂度**：时间 O(log(mn))，空间 O(1)

**关键点**：二维坐标映射——一维下标 `mid` 对应 `(mid // n, mid % n)`。这是降维思想在二分中的应用。

---

## 总结

| 题目 | 二分类型 | 核心技巧 |
|------|---------|---------|
| LC35 | 标准二分 | 左闭右开，left 即插入位 |
| LC34 | 边界二分 | lower_bound + upper_bound 两个变体 |
| LC33 | 旋转数组 | 判断哪半有序，缩小范围 |
| LC74 | 二维二分 | 降维映射，一维坐标转二维 |

二分查找的万能模板：

```python
left, right = 0, len(nums)  # 左闭右开
while left < right:
    mid = left + (right - left) // 2
    if condition(mid):
        right = mid      # 往左缩
    else:
        left = mid + 1   # 往右缩
# left == right，就是答案
```

---
title: "03. 双指针入门"
description: 双指针通过两个指针协同遍历，将 O(n²) 降为 O(n)，覆盖快慢指针、对向指针、排序后双指针三种模式。
level: beginner
count: 3
prev: /review/02-hash-table
next: /review/04-stack
---

# 双指针入门

双指针是算法面试中性价比最高的技巧之一——代码简洁、适用面广、空间复杂度通常为 O(1)。其核心思想是在数组或链表上设置两个指针，通过指针的移动来缩小搜索空间或实现特定操作。

本模块精选三道经典双指针题目：移动零展示"快慢指针"的数组原地操作模式，盛最多水的容器展示"两端收缩"的对向指针模式，三数之和展示"排序 + 双指针"的组合技巧。这三道题覆盖了双指针最常见的三种使用范式，掌握后可以应对大量变种题目。

**双指针核心模式速查**：

| 模式 | 指针方向 | 典型场景 | 移动策略 |
|------|----------|----------|----------|
| 快慢指针 | 同向 | 原地修改数组 | 快指针探索，慢指针标记位置 |
| 对向指针 | 相向 | 搜索配对/极值 | 根据条件移动左或右指针 |
| 滑动窗口 | 同向（窗口） | 子数组/子串问题 | 右指针扩展，左指针收缩 |

---

### 283. 移动零 | 简单
`标签: 数组, 双指针`

**题目描述**：给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。请注意，必须在不复制数组的情况下原地对数组进行操作。

**示例**：
```
输入：nums = [0, 1, 0, 3, 12]
输出：[1, 3, 12, 0, 0]

输入：nums = [0]
输出：[0]
```

**思路分析**：这道题是快慢指针的经典入门题。维护两个指针：慢指针 slow 指向"下一个非零元素应该放置的位置"，快指针 fast 遍历整个数组。当 fast 遇到非零元素时，将其与 slow 位置的元素交换，然后 slow 前进一步。这样，slow 始终指向已处理区域的末尾（即最后一个非零元素的下一个位置）。遍历结束后，slow 之后的所有元素自然都是 0。

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != 0:
                nums[slow], nums[fast] = nums[fast], nums[slow]
                slow += 1
```

**复杂度**：时间 O(n)，空间 O(1)

---

### 11. 盛最多水的容器 | 中等
`标签: 贪心, 数组, 双指针`

**题目描述**：给定一个长度为 n 的整数数组 height。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。

**示例**：
```
输入：height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**思路分析**：容器盛水量 = min(左高, 右高) × 宽度。使用对向双指针，左指针从最左端开始，右指针从最右端开始，每次计算当前盛水量并更新最大值。关键决策：移动哪端的指针？贪心策略是移动较短的那端。原因：盛水量由短板决定，宽度在不断缩小，如果移动长板端，由于高度只可能变小或不变，盛水量不可能增大；而移动短板端，虽然宽度减小，但高度可能增大，盛水量才有机会增加。这个贪心策略的正确性可以严格证明。

```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        max_water = 0
        while left < right:
            width = right - left
            h = min(height[left], height[right])
            max_water = max(max_water, width * h)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_water
```

**复杂度**：时间 O(n)，空间 O(1)

---

### 15. 三数之和 | 中等
`标签: 数组, 双指针, 排序`

**题目描述**：给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k，同时还满足 nums[i] + nums[j] + nums[k] == 0。请返回所有和为 0 且不重复的三元组。

**示例**：
```
输入：nums = [-1, 0, 1, 2, -1, -4]
输出：[[-1, -1, 2], [-1, 0, 1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0
注意：[[-1, 0, 1], [-1, 0, 1]] 这个三元组不合法，因为它们重复了。
```

**思路分析**：三数之和可以转化为「固定一个数 + 两数之和」。首先对数组排序（O(n log n)），然后遍历每个元素作为"第一个数"，在其后面的子数组中使用双指针查找两数之和等于 -nums[i] 的对。去重是这道题的关键：(1) 当 nums[i] 与前一个相同时跳过；(2) 找到一组解后，左右指针分别跳过所有重复值。这种排序 + 双指针的组合思路是解决 k 数之和问题的通用模板。

```python
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = []
        n = len(nums)
        for i in range(n - 2):
            # 去重：跳过相同的第一个数
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            # 优化：最小和已经大于0，后续不可能有解
            if nums[i] + nums[i + 1] + nums[i + 2] > 0:
                break
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    # 去重：跳过相同的第二、第三个数
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1
        return result
```

**复杂度**：时间 O(n²)，空间 O(1)（忽略排序的递归栈）

<template>
  <div class="filter-bar">
    <div class="filter-group">
      <span class="filter-label">难度</span>
      <select class="filter-select" v-model="selectedDifficulty" @change="emitFilters">
        <option value="All">全部</option>
        <option value="Easy">🟢 简单</option>
        <option value="Medium">🟠 中等</option>
        <option value="Hard">🔴 困难</option>
      </select>
    </div>

    <div class="filter-group">
      <span class="filter-label">标签</span>
      <select class="filter-select" v-model="selectedTag" @change="emitFilters">
        <option value="All">全部</option>
        <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>

    <button
      class="star-filter-btn"
      :class="{ active: starredOnly }"
      @click="toggleStarFilter"
    >
      ⭐ 仅收藏
    </button>

    <input
      type="text"
      class="filter-search"
      placeholder="搜索题号、标题或关键词..."
      v-model="searchQuery"
      @input="emitFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  allTags: string[]
}>()

const emit = defineEmits<{
  (e: 'filter', filters: {
    difficulty: string
    tag: string
    starredOnly: boolean
    search: string
  }): void
}>()

const selectedDifficulty = ref('All')
const selectedTag = ref('All')
const starredOnly = ref(false)
const searchQuery = ref('')

function toggleStarFilter() {
  starredOnly.value = !starredOnly.value
  emitFilters()
}

function emitFilters() {
  emit('filter', {
    difficulty: selectedDifficulty.value,
    tag: selectedTag.value,
    starredOnly: starredOnly.value,
    search: searchQuery.value.trim().toLowerCase()
  })
}
</script>

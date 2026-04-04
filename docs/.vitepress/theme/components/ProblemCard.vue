<template>
  <a :href="link" class="problem-card animate-fade-in-up" :style="{ animationDelay: `${index * 40}ms` }">
    <button
      class="star-btn"
      :class="{ starred }"
      @click.prevent="toggleStar"
      :title="starred ? '取消收藏' : '收藏此题'"
    >
      {{ starred ? '⭐' : '☆' }}
    </button>

    <div class="problem-card-header">
      <span class="problem-card-number">#{{ String(number).padStart(3, '0') }}</span>
      <span class="badge" :class="difficultyClass">{{ difficultyLabel }}</span>
    </div>

    <div class="problem-card-title">{{ title }}</div>
    <div class="problem-card-summary">{{ summary }}</div>

    <div class="problem-card-tags">
      <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  number: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  summary: string
  link: string
  starred: boolean
  index: number
}>()

const emit = defineEmits<{
  (e: 'toggle-star', number: number): void
}>()

const difficultyClass = computed(() => {
  const map: Record<string, string> = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard'
  }
  return map[props.difficulty] || ''
})

const difficultyLabel = computed(() => {
  const map: Record<string, string> = {
    Easy: '简单',
    Medium: '中等',
    Hard: '困难'
  }
  return map[props.difficulty] || props.difficulty
})

const starred = ref(props.starred)

function toggleStar() {
  starred.value = !starred.value
  emit('toggle-star', props.number)
}
</script>

<template>
  <a :href="withBase(link)" class="review-card animate-fade-in-up" :style="{ animationDelay: `${index * 40}ms` }">
    <div class="review-card-header">
      <span class="review-card-badge" :class="levelClass">{{ id }}</span>
      <span class="review-card-count">{{ count }} 题</span>
    </div>

    <div class="review-card-title">{{ title }}</div>
    <div class="review-card-desc">{{ description }}</div>

    <div class="review-card-problems">
      <a
        v-for="p in problemLinks"
        :key="p.number"
        :href="withBase(p.link)"
        class="review-problem-link"
        @click.stop
      >#{{ p.number }}</a>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  id: string
  title: string
  level: 'beginner' | 'intermediate' | 'advanced'
  count: number
  description: string
  link: string
  problemLinks: { number: number; link: string }[]
  index: number
}>()

const levelClass = computed(() => {
  const map: Record<string, string> = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced'
  }
  return map[props.level] || ''
})
</script>

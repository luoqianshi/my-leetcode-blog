<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="def.viewBox || '0 0 24 24'"
    :fill="def.filled ? 'currentColor' : 'none'"
    :stroke="def.filled ? 'none' : 'currentColor'"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="lc-icon"
    v-html="def.body"
  ></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from './icons'

const props = withDefaults(defineProps<{
  name: IconName
  size?: number | string
}>(), {
  size: 18
})

const def = computed(() => icons[props.name] ?? icons['circle-dot'])
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <a v-if="frontmatter.number" class="demo-jump" href="#图解演示">查看算法图解 ↓</a>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'

const { isDark, frontmatter } = useData()

function applyFavicon(dark: boolean) {
  const link = document.querySelector<HTMLLinkElement>('link#favicon')
  if (link) link.href = withBase(dark ? '/logo.svg' : '/logo_light.svg')
}

onMounted(() => {
  applyFavicon(isDark.value)
  watch(isDark, applyFavicon)
})
</script>

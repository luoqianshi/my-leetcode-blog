<template>
  <DefaultTheme.Layout />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'

const { isDark } = useData()

function applyFavicon(dark: boolean) {
  const link = document.querySelector<HTMLLinkElement>('link#favicon')
  if (link) link.href = withBase(dark ? '/logo.svg' : '/logo_light.svg')
}

onMounted(() => {
  applyFavicon(isDark.value)
  watch(isDark, applyFavicon)
})
</script>

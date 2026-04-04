<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <div class="theme-toggle-bar">
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
          aria-label="切换明暗模式"
        >
          <span v-if="isDark" class="icon">☀️</span>
          <span v-else class="icon">🌙</span>
        </button>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { isDark } = useData()

function toggleTheme() {
  const html = document.documentElement
  const current = html.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved)
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
</script>

<style scoped>
.theme-toggle-bar {
  position: fixed;
  top: 12px;
  right: 20px;
  z-index: 999;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.theme-toggle-btn:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.icon {
  font-size: 18px;
  line-height: 1;
}
</style>

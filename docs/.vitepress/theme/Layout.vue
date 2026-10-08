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
          <span class="theme-icon" :class="{ 'icon-enter': isDark }">
            <LcIcon :name="isDark ? 'sun' : 'moon'" :size="17" />
          </span>
        </button>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import LcIcon from './components/icons/LcIcon.vue'

const { isDark } = useData()

// 与 VitePress 原生机制对齐：html.dark class + 约定存储键
const STORAGE_KEY = 'vitepress-theme-appearance'

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

function toggleTheme() {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved === 'dark')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme(true)
  }
})

// 外部变化（如系统偏好回退）时保持同步
watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark)
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
  width: 36px;
  height: 36px;
  border: 1px solid var(--lc-border);
  border-radius: 999px;
  background: var(--lc-bg);
  color: var(--lc-ink);
  cursor: pointer;
  transition: border-color 0.2s var(--lc-ease), box-shadow 0.2s var(--lc-ease),
    transform 0.2s var(--lc-ease);
  box-shadow: var(--lc-shadow-sm);
}

.theme-toggle-btn:hover {
  border-color: var(--lc-border-strong);
  box-shadow: var(--lc-shadow-md);
  transform: translateY(-1px);
}

.theme-toggle-btn:active {
  transform: scale(0.94);
}

.theme-icon {
  display: inline-flex;
  animation: iconIn 0.3s var(--lc-ease);
}

@keyframes iconIn {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.6);
  }
  to {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-icon {
    animation: none;
  }

  .theme-toggle-btn {
    transition: none;
  }
}
</style>

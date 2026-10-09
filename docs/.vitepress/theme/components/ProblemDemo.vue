<template>
  <ClientOnly>
    <figure class="problem-demo">
      <div
        ref="hostRef"
        class="problem-demo-host"
        :class="{ 'problem-demo-host--sized': height > 0 }"
        :style="height ? { height: `${height}px` } : undefined"
      >
        <iframe
          v-if="activated && status !== 'error'"
          ref="frameRef"
          :src="src"
          :title="`${title} — 算法图解演示`"
          class="problem-demo-frame"
          loading="lazy"
          @load="onFrameLoad"
        ></iframe>
        <div v-else class="problem-demo-placeholder">
          <span>{{ placeholderText }}</span>
        </div>
      </div>
      <figcaption class="problem-demo-cap">
        <a class="problem-demo-open" :href="src" target="_blank" rel="noopener noreferrer">在新标签页打开 ↗</a>
      </figcaption>
    </figure>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'

const props = withDefaults(defineProps<{ slug: string; title?: string }>(), {
  title: '算法图解演示'
})

const { isDark } = useData()

/** load 之后这么久还没收到 ready，就判定 demo 缺失或脚本报错 */
const READY_TIMEOUT = 3000
/** 高度钳制：下限防塌陷，上限防上报失控把页面撑爆 */
const MIN_HEIGHT = 200
const MAX_HEIGHT = 1400

// 🔴 src 绝不能依赖 isDark，iframe 上也不能加随主题变化的 :key ——
//    否则主题一切换 Vue 就重建 iframe，动画进度全部归零。主题只走 postMessage。
// 🔴 必须是显式 index.html：CI 的 clean-URL 重写按 basename 过滤，会跳过这种布局，
//    而 Vite dev server 的 public 中间件只按文件路径白名单命中，尾斜杠目录形式在本地会 404。
const src = computed(() => withBase(`/demos/${props.slug}/index.html`))

const status = ref<'pending' | 'ok' | 'error'>('pending')
const activated = ref(false)
const height = ref(0)
const hostRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLIFrameElement | null>(null)

let io: IntersectionObserver | null = null
let readyTimer: ReturnType<typeof setTimeout> | undefined
let targetOrigin = '*'

const placeholderText = computed(() =>
  status.value === 'error'
    ? '图解演示加载失败，可点下方链接在新标签页打开。'
    : '图解演示加载中…'
)

function postTheme() {
  const win = frameRef.value?.contentWindow
  if (!win) return
  try {
    win.postMessage({ type: 'lc-demo:theme', theme: isDark.value ? 'dark' : 'light' }, targetOrigin)
  } catch {
    /* iframe 还没就绪，等它发 ready 时再补发 */
  }
}

function onMessage(e: MessageEvent) {
  if (e.source !== frameRef.value?.contentWindow) return // 只认自己这一个 iframe
  const d = e.data
  if (!d || typeof d.type !== 'string') return
  if (d.type === 'lc-demo:ready') {
    targetOrigin = e.origin || '*'
    clearTimeout(readyTimer)
    status.value = 'ok'
    postTheme()
  } else if (d.type === 'lc-demo:height' && typeof d.height === 'number') {
    height.value = Math.min(Math.max(Math.round(d.height), MIN_HEIGHT), MAX_HEIGHT)
  }
}

function onFrameLoad() {
  clearTimeout(readyTimer)
  readyTimer = setTimeout(() => {
    if (status.value === 'pending') status.value = 'error'
  }, READY_TIMEOUT)
  postTheme()
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  watch(isDark, postTheme)

  if (typeof IntersectionObserver === 'undefined' || !hostRef.value) {
    activated.value = true
    return
  }
  // 一次性激活：提前 300px 开始加载，滚到跟前时已经好了
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        activated.value = true
        io?.disconnect()
        io = null
      }
    },
    { rootMargin: '300px 0px' }
  )
  io.observe(hostRef.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  io?.disconnect()
  clearTimeout(readyTimer)
})
</script>

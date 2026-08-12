import { ref, reactive, onBeforeUnmount } from 'vue'

/* ============================================
   useScrollReveal — 统一可重播 Scroll Reveal
   滞后观察器 + 兄弟相对 reset：
   - 进入：ratio >= enterThreshold → 播放（armed=false）
   - 重置：active 且 ratio 离开 enter 区 且「下一个 section 已进入视口」
     （焦点已转移）→ 重新 armed，可重播
   为什么不按「完全离屏」reset：短内容页面上 section 可能永远无法完全
   离开视口（如 390x844 下 projects 最多滚到剩 17%）。兄弟相对规则在任何
   内容高度下都可达——你总能滚到「下一个 section 真正进入」。
   - cooldown 挡 enter：避免 resize/地址栏伸缩导致的快速重播
   - 只写 class 'in-view' + reactive state[key]，动画交给 CSS transition-delay
   - scrollDir（up/down）写 root.dataset.scrollDir，CSS 据此给 --enter-y
   ============================================ */

export function useScrollReveal(options = {}) {
  const {
    enterThreshold = 0.28,
    leaveOffset = 0.04,     // reset 需要 ratio < enterThreshold - leaveOffset
    cooldown = 500,
  } = options

  const leaveThreshold = Math.max(0, enterThreshold - leaveOffset)

  const state = reactive({})        // key -> bool（供组件 :active 绑定）
  const scrollDir = ref('down')

  const store = new Map()           // el -> { key, armed, active, lastPlayedAt, lastRatio, resetBy }
  let scrollRoot = null             // null = viewport 滚动（移动端）
  let io = null
  let lastY = 0
  let raf = 0
  let started = false

  const thresholds = [0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.28, 0.4, 0.6, 0.8, 1]
  if (!thresholds.includes(enterThreshold)) thresholds.push(enterThreshold)
  if (!thresholds.includes(leaveThreshold)) thresholds.push(leaveThreshold)
  thresholds.sort((a, b) => a - b)

  function addInView(el, key) {
    el.classList.add('in-view')
    el.classList.remove('is-leaving')
    if (key) state[key] = true
  }
  function removeInView(el, key) {
    el.classList.add('is-leaving')
    el.classList.remove('in-view')
    if (key) state[key] = false
  }

  function makeIO() {
    if (!('IntersectionObserver' in window)) return null
    return new IntersectionObserver((entries) => {
      // 先统一更新所有 ratio，再评估状态（resetBy 需要读到兄弟的最新值）
      entries.forEach((entry) => {
        const rec = store.get(entry.target)
        if (rec) rec.lastRatio = entry.intersectionRatio
      })
      const now = Date.now()
      entries.forEach((entry) => {
        const rec = store.get(entry.target)
        if (!rec) return
        const ratio = rec.lastRatio

        // 进入 → 播放（cooldown 内不重播）
        if (ratio >= enterThreshold && rec.armed && (now - rec.lastPlayedAt) >= cooldown) {
          rec.armed = false
          rec.active = true
          rec.lastPlayedAt = now
          addInView(entry.target, rec.key)
        }
        // 重置：仍在展示中 + 已离开 enter 区 + （无兄弟 或 兄弟已进入视口 → 焦点转移）
        else if (rec.active && ratio < leaveThreshold) {
          const sibling = rec.resetBy ? store.get(rec.resetBy) : null
          const siblingEntered = !rec.resetBy || (sibling && sibling.lastRatio >= enterThreshold)
          if (siblingEntered) {
            rec.armed = true
            rec.active = false
            removeInView(entry.target, rec.key)
          }
        }
      })
    }, { root: scrollRoot, threshold: thresholds })
  }

  function handleScroll() {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const y = scrollRoot
        ? scrollRoot.scrollTop
        : (window.scrollY || document.documentElement.scrollTop || 0)
      scrollDir.value = y > lastY ? 'down' : 'up'
      lastY = y
      const rootEl = scrollRoot || document.documentElement
      rootEl.dataset.scrollDir = scrollDir.value
    })
  }

  function start(root) {
    if (started) return
    started = true
    scrollRoot = root || null
    if (scrollRoot) lastY = scrollRoot.scrollTop
    else lastY = window.scrollY || 0
    ;(scrollRoot || window).addEventListener('scroll', handleScroll, { passive: true })
    io = makeIO()
  }

  function register(el, key, opts = {}) {
    store.set(el, {
      key,
      armed: true,
      active: false,
      lastPlayedAt: 0,
      lastRatio: 0,
      resetBy: opts.resetBy || null,
    })
    if (key) state[key] = false
    if (io) io.observe(el)
    return el
  }

  function unregister(el) {
    if (store.has(el)) {
      if (io) io.unobserve(el)
      store.delete(el)
    }
  }

  function stop() {
    if (io) io.disconnect()
    io = null
    ;(scrollRoot || window).removeEventListener('scroll', handleScroll)
    cancelAnimationFrame(raf)
    raf = 0
    started = false
  }

  onBeforeUnmount(stop)

  return { state, scrollDir, register, unregister, start, stop }
}

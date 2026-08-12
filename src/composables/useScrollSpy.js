import { ref, onBeforeUnmount } from 'vue'

/* ============================================
   useScrollSpy — 滚动驱动的导航高亮
   策略：取「顶部越过 offset 线的最后一个 section」为 active
   （标准 scrollspy）。不用「最可见面积」——紧凑布局下 projects 在
   页面顶部会 peek（~50% 可见），最可见策略会错误高亮，而 offset 策略
   在顶部时无 section 越过线 → 保持 'top'。
   - rAF 节流 + resize 校正
   - setActive(id)：供导航点击时乐观更新（立即反馈，滚动中由 spy 校正）
   ============================================ */

export function useScrollSpy(sectionIds = ['top', 'projects', 'skills'], offset = 140) {
  const active = ref('top')
  const ids = sectionIds.filter(id => id !== 'top')

  let scrollRoot = null
  let raf = 0
  let started = false

  function update() {
    let current = 'top'
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const r = el.getBoundingClientRect()
      // 顶部越过 offset 线且仍可见 → 取最后一个满足的
      if (r.top <= offset && r.bottom > 0) current = id
    })
    // 滚到内容底部仍无 section 越过线（短内容下最后一节 top 到不了 offset）→ 强制最后一项
    const root = scrollRoot || document.documentElement
    // 守卫 scrollHeight>clientHeight：加载时 layout 为 display:none，两者都是 0，
    // 会误判 atBottom 并锁死 active
    const atBottom = root.scrollHeight > root.clientHeight
      && (root.scrollHeight - root.scrollTop - root.clientHeight) < 8
    if (atBottom && ids.length) current = ids[ids.length - 1]
    if (active.value !== current) active.value = current
  }

  function handleScroll() {
    if (raf) return
    raf = requestAnimationFrame(() => { raf = 0; update() })
  }

  function start(root) {
    if (started) return
    started = true
    scrollRoot = root || null
    ;(scrollRoot || window).addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    update()
  }

  function stop() {
    started = false
    ;(scrollRoot || window).removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    cancelAnimationFrame(raf)
    raf = 0
  }

  function setActive(id) {
    if (active.value !== id) active.value = id
  }

  onBeforeUnmount(stop)

  return { active, setActive, update, start, stop }
}

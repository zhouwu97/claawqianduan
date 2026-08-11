import { ref, onBeforeUnmount } from 'vue'
import { getFormattedTime, getFormattedDate } from '../utils/common.js'

/**
 * 时钟：每秒刷新格式化时间与日期
 */
export function useClock() {
  const formattedTime = ref('')
  const formattedDate = ref('')
  const formattedDateShort = ref('')
  let timer = null

  function update() {
    const d = new Date()
    formattedTime.value = getFormattedTime(d)
    formattedDate.value = getFormattedDate(d)
    const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
    formattedDateShort.value = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · ${weekday}`
  }

  function start() {
    update()
    timer = setInterval(update, 1000)
  }

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { formattedTime, formattedDate, formattedDateShort, start }
}

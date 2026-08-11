import { ref } from 'vue'
import { getCookie } from '../utils/cookieUtils.js'

/**
 * 壁纸：按设备(PC/mobile)与 cookie 覆盖选择图片/视频壁纸
 * 图片 -> 设置 --leleo-background-image-url 并返回 url 供 loader 预载
 * 视频 -> 设置 videosrc
 */
export function useWallpaper() {
  const videosrc = ref('')

  function selectBackground(cfg, isXs) {
    const root = document.documentElement
    let imageurl = ''
    const leleodatabackground = getCookie('leleodatabackground')

    const apply = (data) => {
      if (data.type === 'pic') {
        root.style.setProperty('--leleo-background-image-url', `url('${data.datainfo.url}')`)
        imageurl = data.datainfo.url
      } else {
        videosrc.value = data.datainfo.url
      }
    }

    if (leleodatabackground) {
      if (isXs) apply(leleodatabackground.mobile)
      else apply(leleodatabackground.pc)
    } else {
      if (isXs) apply(cfg.background.mobile)
      else apply(cfg.background.pc)
    }
    return imageurl
  }

  return { videosrc, selectBackground }
}

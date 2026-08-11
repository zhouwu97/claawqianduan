import config from '../config.js'
import { setMeta, dataConsole } from '../utils/common.js'
import { getCookie } from '../utils/cookieUtils.js'

/**
 * 站点配置：加载 config / VITE_CONFIG 覆盖 / meta / 主题 CSS 变量
 */
export function useSiteConfig() {
  function loadConfig() {
    if (import.meta.env.VITE_CONFIG) {
      return JSON.parse(import.meta.env.VITE_CONFIG)
    }
    return config
  }

  function applyMeta(cfg) {
    dataConsole()
    setMeta(cfg.metaData.title, cfg.metaData.description, cfg.metaData.keywords, cfg.metaData.icon)
  }

  function applyThemeVars(cfg) {
    const root = document.documentElement
    const leleodata = getCookie('leleodata')
    if (leleodata) {
      root.style.setProperty('--leleo-welcomtitle-color', leleodata.color.welcometitlecolor)
      root.style.setProperty('--leleo-vcard-color', leleodata.color.themecolor)
      root.style.setProperty('--leleo-brightness', `${leleodata.brightness}%`)
      root.style.setProperty('--leleo-blur', `${leleodata.blur}px`)
    } else {
      root.style.setProperty('--leleo-welcomtitle-color', cfg.color.welcometitlecolor)
      root.style.setProperty('--leleo-vcard-color', cfg.color.themecolor)
      root.style.setProperty('--leleo-brightness', `${cfg.brightness}%`)
      root.style.setProperty('--leleo-blur', `${cfg.blur}px`)
    }
  }

  return { loadConfig, applyMeta, applyThemeVars }
}

import { ref, computed } from 'vue'

const searchEngines = [
  { title: 'Bing', value: 'bing' },
  { title: 'Google', value: 'google' },
  { title: '百度', value: 'baidu' },
  { title: 'Yandex', value: 'yandex' },
  { title: 'DuckDuckGo', value: 'duckduckgo' },
]

const engineUrls = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  yandex: 'https://yandex.com/search/?text=',
  duckduckgo: 'https://duckduckgo.com/?q=',
}

function isLikelyUrl(input) {
  const str = input.trim()
  if (/^(https?|ftp):\/\//i.test(str)) return true
  const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i
  const localPattern = /^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i
  return domainPattern.test(str) || localPattern.test(str)
}

/**
 * 搜索：引擎切换 + URL 直接打开
 */
export function useSearch() {
  const searchQuery = ref('')
  const selectedEngine = ref({ title: 'Bing', value: 'bing' })

  const isUrl = computed(() => isLikelyUrl(searchQuery.value))

  function performSearch() {
    const query = searchQuery.value.trim()
    if (!query) return
    if (isLikelyUrl(query)) {
      let url = query
      if (!/^[a-z]+:\/\//i.test(url)) {
        // 域名默认 https；localhost/IP 用 http
        url = /^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/i.test(url) ? 'http://' + url : 'https://' + url
      }
      window.open(url, '_blank')
    } else {
      window.open(engineUrls[selectedEngine.value.value] + encodeURIComponent(query), '_blank')
    }
  }

  return { searchQuery, selectedEngine, searchEngines, isUrl, performSearch }
}

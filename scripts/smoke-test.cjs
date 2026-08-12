/* CDP-driven smoke test for V4.2.1 Motion Replay */
const { spawn } = require('child_process')
const http = require('http')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5174/'
const PORT = 9222
const PROFILE = 'C:/Users/haha/AppData/Local/Temp/cdp-profile-' + Date.now()

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch (e) { reject(e) } })
    }).on('error', reject)
  })
}

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--window-size=1440,900',
    'about:blank',
  ], { stdio: 'ignore' })

  // wait for debugger endpoint
  let targets = null
  for (let i = 0; i < 50; i++) {
    try { targets = await getJson(`http://localhost:${PORT}/json`); if (targets.length) break } catch (e) {}
    await sleep(200)
  }
  if (!targets || !targets.length) { console.error('FAIL: no CDP target'); chrome.kill(); process.exit(1) }
  const page = targets.find(t => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

  let id = 0
  const pending = new Map()
  const errors = []
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push('EXCEPTION: ' + JSON.stringify(msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text))
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const text = (msg.params.args || []).map(a => a.value ?? a.description ?? '').join(' ')
      if (!/Failed to load resource/.test(text) && !/ERR_/.test(text)) errors.push('CONSOLE: ' + text)
    }
  }

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const mid = ++id
      pending.set(mid, resolve)
      ws.send(JSON.stringify({ id: mid, method, params }))
    })
  }

  async function evaluate(expression) {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (r.error) return { __error: r.error.message }
    if (r.result?.exceptionDetails) return { __exception: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text }
    return r.result?.result?.value
  }

  const results = []
  function check(name, pass, extra = '') {
    results.push({ name, pass, extra })
    console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (extra ? '  [' + extra + ']' : ''))
  }

  await send('Runtime.enable')
  await send('Page.enable')
  await send('Page.navigate', { url: URL })
  await sleep(2500) // loader + intro settle

  // wait for layout visible
  for (let i = 0; i < 20; i++) {
    const vis = await evaluate(`!!document.querySelector('.layout') && getComputedStyle(document.querySelector('.layout')).display !== 'none'`)
    if (vis === true) break
    await sleep(300)
  }

  // ---- initial state at top ----
  check('layout visible', (await evaluate(`getComputedStyle(document.querySelector('.layout')).display !== 'none'`)) === true)
  check('scene-number 02 exists', (await evaluate(`document.querySelector('#projects .scene-number')?.textContent.trim() === '02'`)) === true)
  check('scene-number 03 exists', (await evaluate(`document.querySelector('#skills .scene-number')?.textContent.trim() === '03'`)) === true)
  check('kicker rendered', (await evaluate(`document.querySelector('.kicker')?.textContent.includes('CURRENTLY BUILDING')`)) === true)
  check('showcase present', (await evaluate(`!!document.querySelector('.showcase')`)) === true)
  check('rail nav indicator present', (await evaluate(`!!document.querySelector('.nav-indicator')`)) === true)
  check('mobile dock present in DOM', (await evaluate(`!!document.querySelector('.bottom-dock')`)) === true)
  check('mobile top present in DOM', (await evaluate(`!!document.querySelector('.mobile-top')`)) === true)
  check('scene-sweep present', (await evaluate(`!!document.querySelector('.scene-sweep')`)) === true)
  check('skills NOT in-view at top', (await evaluate(`!document.querySelector('#skills')?.classList.contains('in-view')`)) === true)
  check('nav active = 首页 at top', (await evaluate(`document.querySelector('.nav-btn.active span')?.textContent.trim()`)) === '首页')

  // ---- scroll to projects ----
  await evaluate(`document.querySelector('.main-area').scrollTop = 600; true`)
  await sleep(700)
  check('projects in-view after scroll', (await evaluate(`document.querySelector('#projects')?.classList.contains('in-view')`)) === true)
  check('projects-v3 in-view', (await evaluate(`document.querySelector('.projects-v3')?.classList.contains('in-view')`)) === true)
  check('showcase in-view', (await evaluate(`document.querySelector('.showcase')?.classList.contains('in-view')`)) === true)
  const activeNavText = await evaluate(`document.querySelector('.nav-btn.active span')?.textContent.trim() || document.querySelector('.nav-btn.active')?.textContent.trim()`)
  check('spy drives nav active = 项目与收藏', activeNavText === '项目与收藏')

  // ---- scroll to skills ----
  await evaluate(`document.querySelector('.main-area').scrollTop = 1600; true`)
  await sleep(900)
  check('skills in-view', (await evaluate(`document.querySelector('#skills')?.classList.contains('in-view')`)) === true)
  check('skills bar scaled (--v set)', (await evaluate(`document.querySelector('.bar i')?.style.getPropertyValue('--v')`)) === '0.85')
  // 紧凑布局下 projects 在底部仍部分可见（<reset 阈值则保持 in-view，hysteresis 正确行为）
  const bottomVis = await evaluate(`(() => {
    const m = document.querySelector('.main-area'); m.scrollTop = m.scrollHeight; return null;
  })(); (document.querySelector('#projects')?.getBoundingClientRect().bottom || 0)`)
  await sleep(600)
  check('hysteresis: co-visible sections stay revealed (no flicker)', (await evaluate(`document.querySelector('#projects')?.classList.contains('in-view')`)) === true)
  console.log('  [info] projects bottom offset at bottom:', bottomVis, '(if >0, still peeking → keep in-view is correct)')

  // ---- scroll back to projects (replay) ----
  await evaluate(`document.querySelector('.main-area').scrollTop = 600; true`)
  await sleep(700)
  check('projects re-in-view after scroll', (await evaluate(`document.querySelector('#projects')?.classList.contains('in-view')`)) === true)

  // ---- hero return ----
  await evaluate(`document.querySelector('.main-area').scrollTop = 0; true`)
  await sleep(400)
  const heroReturn = await evaluate(`document.querySelector('.hero')?.classList.contains('hero-return')`)
  check('hero-return triggered on way back to top', heroReturn === true)

  // ---- nav click → scene sweep + scroll (desktop) ----
  await evaluate(`[...document.querySelectorAll('.nav-btn')].find(b => (b.textContent||'').includes('项目与收藏')).click(); true`)
  await sleep(300)
  check('nav click triggers scene-sweep', (await evaluate(`document.querySelector('.scene-sweep')?.classList.contains('play')`)) === true)
  await sleep(1000)
  check('nav click scrolled toward projects', (await evaluate(`Math.abs(document.querySelector('#projects').getBoundingClientRect().top) < 400`)) === true)

  // ---- reduced motion ----
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await send('Page.navigate', { url: URL })
  await sleep(2500)
  await evaluate(`document.querySelector('.main-area').scrollTop = 600; true`)
  await sleep(700)
  const rmShowcase = await evaluate(`getComputedStyle(document.querySelector('.showcase')).opacity`)
  check('reduced-motion: showcase visible (opacity 1)', rmShowcase === '1')
  const rmTransform = await evaluate(`getComputedStyle(document.querySelector('.showcase')).transform`)
  check('reduced-motion: showcase no transform', rmTransform === 'none')
  const rmScene = await evaluate(`getComputedStyle(document.querySelector('.scene-number')).opacity`)
  check('reduced-motion: scene-number visible', rmScene === '1')
  const rmBar = await evaluate(`getComputedStyle(document.querySelector('.bar i')).transform`)
  check('reduced-motion: bar no scale', rmBar === 'none')

  // ---- mobile ----
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Emulation.setEmulatedMedia', { features: [] }) // clear reduced-motion
  await send('Page.navigate', { url: URL })
  await sleep(2500)
  const dockVis = await evaluate(`getComputedStyle(document.querySelector('.bottom-dock')).display`)
  check('mobile: bottom-dock visible', dockVis === 'grid')
  const mobileTopVis = await evaluate(`getComputedStyle(document.querySelector('.mobile-top')).display`)
  check('mobile: top capsule visible', mobileTopVis === 'flex')
  const railVis = await evaluate(`getComputedStyle(document.querySelector('.rail')).display`)
  check('mobile: rail hidden', railVis === 'none')
  // mobile body scroll
  const bodyScrollable = await evaluate(`document.documentElement.scrollHeight > innerHeight`)
  check('mobile: body scrollable', bodyScrollable === true)

  // ---- mobile replay: full exit → reset → return → replay ----
  // 模拟 Dock「近况」导航：滚到 skills 顶部（projects 完全离开视口）
  // 用 scrollTop 直接赋值（即时，绕过 html{scroll-behavior:smooth}）
  await evaluate(`document.documentElement.scrollTop = document.getElementById('skills').getBoundingClientRect().top + document.documentElement.scrollTop - 76; true`)
  await sleep(1100)
  check('mobile: projects reset after full exit', (await evaluate(`!document.getElementById('projects')?.classList.contains('in-view')`)) === true)
  check('mobile: dock active = 近况', (await evaluate(`document.querySelector('.dock-indicator')?.style.getPropertyValue('--dock-active')`)) === '2')

  await evaluate(`document.documentElement.scrollTop = document.getElementById('projects').getBoundingClientRect().top + document.documentElement.scrollTop - 76; true`)
  await sleep(800)
  check('mobile: projects re-in-view (replay)', (await evaluate(`document.getElementById('projects')?.classList.contains('in-view')`)) === true)
  check('mobile: dock active = 项目', (await evaluate(`document.querySelector('.dock-indicator')?.style.getPropertyValue('--dock-active')`)) === '1')

  // ---- mobile: more sheet open/close ----
  await evaluate(`[...document.querySelectorAll('.dock-item')].at(-1).click(); true`)
  await sleep(300)
  check('mobile: more sheet opens', (await evaluate(`document.querySelector('.more-sheet')?.classList.contains('open')`)) === true)
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); true`)
  await sleep(300)
  check('mobile: Esc closes more sheet', (await evaluate(`!document.querySelector('.more-sheet')?.classList.contains('open')`)) === true)
  await evaluate(`[...document.querySelectorAll('.dock-item')].at(-1).click(); true`)
  await sleep(250)
  await evaluate(`document.querySelector('.sheet-backdrop').click(); true`)
  await sleep(300)
  check('mobile: backdrop closes more sheet', (await evaluate(`!document.querySelector('.more-sheet')?.classList.contains('open')`)) === true)

  console.log('\n=== JS ERRORS ===')
  if (errors.length) errors.forEach(e => console.log('  ' + e))
  else console.log('  none')

  const failed = results.filter(r => !r.pass)
  console.log(`\n=== RESULT: ${results.length - failed.length}/${results.length} passed ===`)
  ws.close()
  chrome.kill()
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => { console.error('TEST CRASH:', e); process.exit(2) })

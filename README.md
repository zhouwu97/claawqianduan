# 纯合子的个人主页

基于 Vue 3 + Vite 的个人主页，采用已确认的 HTML 设计：响应式侧栏、动画时钟、应用截图切换、项目与收藏、仓库技术栈、自我介绍、壁纸和音乐设置。

## 本地运行与部署

```bash
npm ci
npm run dev
npm run build
```

将 `dist` 发布到 Cloudflare Pages 或其他静态托管。Cloudflare Pages 保持构建命令 `npm run build`、输出目录 `dist`。页面不再等待壁纸、项目图片或音乐接口返回后才展示。

图片位于 `public/img/optimized/`，按需加载并独立缓存。主页不再导入 Vuetify、MDI 字体、Chart.js、Driver.js 或 TypeIt；保留 Vue/Vite 构建方式。

## 音乐

- 默认使用共享 Meting 接口，并提供初始歌单和浏览器缓存。首屏不请求歌单、音频、封面或歌词。
- 点击播放才加载音频；打开音乐面板时在后台更新歌单。
- 原站接口 `music.zhouwu.ccwu.cc` 当前返回 HTTP 530。选用原站接口时，请求失败会尝试共享接口；恢复原站服务仍需要修复其部署。
- 可以在音乐设置中连接自己的完整 Meting 歌单接口，或选择本地音频。文件只在当前浏览器播放，不上传。
- 正确处理绝对/相对资源地址、播放拒绝、缓冲超时、快速切歌和切换来源，实际音频事件决定播放状态。
- 第三方歌单可用不代表每首歌曲都可用；遇到版权、地区或临时失效的链接，页面会显示错误并允许换歌或本地播放。

## 配置与源码

- `src/config.js`：名称、简介、标签与默认音乐歌单。`VITE_CONFIG` JSON 可覆盖这些字段，未提供的字段保留默认值。
- `src/layouts/HomeShell.vue`：主页布局、项目链接、技术栈对应仓库、弹窗。
- `src/homeApp.js`：外观、壁纸、搜索、标签、动画和导航。
- `src/music/player.js`：可独立测试的播放器与请求逻辑。
- `src/music/ui.js`：音乐面板、封面、歌词和进度控件。
- `src/styles/home.css`：桌面与手机样式、动画及减少动态效果支持。

技术栈展示来自公开仓库的语言与依赖：Flutter/Dart、Go/Gin、Python、Vue/Vite、React/Next.js 和 TypeScript。每项链接到对应项目，不使用推测的熟悉度分数。

## 验证

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run export:html
```

单元测试验证超时、故障回退、异步竞态和播放状态。浏览器测试使用可解码的 WAV 音频验证真实媒体播放，避免第三方接口波动导致测试不稳定。

`npm run export:html` 生成内嵌图片、样式和脚本的 `dist/chunhezi_home.html`，可直接下载或打开。在线音乐仍需网络连接。

原主页内容参考 [zhouwu97/claawqianduan](https://github.com/zhouwu97/claawqianduan)，原项目灵感来自 [leleo886](https://github.com/leleo886)。

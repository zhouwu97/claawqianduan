# 周周的个人主页

一个基于 Vue3 + Vite + Vuetify 构建的二次元风格个人主页。

## 功能特性

- 🎀 二次元可爱风配色
- 全屏背景壁纸（支持 PC/移动端自适应）
- 头像展示 + 音乐播放器
- 标签云（点击复制）
- Chart.js 技能雷达图
- TypeIt 打字机效果
- SVG 转盘时钟组件
- 项目卡片网格展示
- 多搜索引擎切换（Bing/Google/百度/Yandex/DuckDuckGo）
- 设置弹窗（个性化颜色/亮度/模糊、壁纸选择、音乐播放器）
- 首次引导 tour（driver.js）

## 技术栈

- Vue 3.5
- Vite 5.4
- Vuetify 3.7
- Chart.js + vue-chartjs
- TypeIt（打字机效果）
- Driver.js（引导 tour）

## 部署说明

### 一、域名申请

本项目域名申请于 **dnshe**（https://www.dnshe.com/）

1. 访问 dnshe 网站并注册账号
2. 搜索你想要的域名并申请
3. 完成域名购买或申请流程

### 二、域名托管

本项目托管于 **Cloudflare**（https://www.cloudflare.com/zh-cn/）

1. 将 dnshe 申请的域名接入 Cloudflare
2. 在 Cloudflare 控制台管理 DNS 解析
3. 配置页面规则和 SSL 证书
4. Cloudflare 提供免费 CDN 加速和 SSL 保护

### 三、项目部署

#### 方法一：本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 方法二：构建生产版本

```bash
# 构建项目
npm run build
```

构建完成后，`dist` 目录包含所有静态文件，可上传至任何静态托管服务。

#### 方法三：使用 Cloudflare Pages

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 设置构建命令：`npm run build`
4. 设置输出目录：`dist`

## 配置说明

### 头像设置

将喜欢的头像图片放置于 `public/img/avatar.jpg`

### 壁纸配置

在 `src/config.js` 中的 `wallpaper.pic`（PC 端）和 `picMobile`（移动端）数组中添加更多壁纸 URL。

### 字体补全（如需）

将 `public/fonts/` 目录下的 `faken.ttf` 和 `Digital-Play-Italic-St-1.ttf` 字体文件补齐。

### 音乐 API

本项目使用 Meting API（如 `api.i-meto.com`），如该服务已停用，请更换为其他音乐源。

## 项目结构

```
├── public/
│   ├── img/          # 图片资源
│   └── css/          # 样式文件
├── src/
│   ├── components/    # Vue 组件
│   ├── utils/        # 工具函数
│   ├── App.vue       # 根组件
│   ├── main.js       # 入口文件
│   └── config.js     # 配置文件
├── index.html        # HTML 入口
├── package.json      # 项目配置
└── vite.config.js    # Vite 配置
```

## 许可证

MIT License
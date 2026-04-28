# 周周的个人主页

一个基于 Vue3 + Vite + Vuetify 构建的二次元风格个人主页。
  帮我点下star，谢谢喵~

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

## 演示地址

[在线演示](https://zhouwu.ccwu.cc)

## 技术栈

- Vue 3.5
- Vite 5.4
- Vuetify 3.7
- Chart.js + vue-chartjs
- TypeIt（打字机效果）
- Driver.js（引导 tour）

## 部署说明

### 一、域名申请

本项目域名申请于 [dnshe](https://www.dnshe.com/)

1. 访问 dnshe 网站并注册账号
2. 搜索你想要的域名并申请
3. 完成域名购买或申请流程

### 二、域名托管

本项目托管于 [Cloudflare](https://www.cloudflare.com/zh-cn/)

1. 将 dnshe 申请的域名接入 Cloudflare
2. 在 Cloudflare 控制台管理 DNS 解析
3. 配置页面规则和 SSL 证书
4. Cloudflare 提供免费 CDN 加速和 SSL 保护

### 三、项目部署

#### 方法一：本地运行

1. 克隆仓库：

```bash
git clone https://github.com/zhouwu97/claawqianduan.git
```

2. 进入项目目录：

```bash
cd claawqianduan
```

3. 安装依赖：

```bash
npm install
```

4. 启动开发服务器：

```bash
npm run dev
```

#### 方法二：构建生产版本

```bash
# 构建项目
npm run build
```

构建完成后，`dist` 目录包含所有静态文件，可上传至任何静态托管服务。

#### 方法三：Cloudflare Pages 在线部署

> 无需服务器，对站长友好（需要有 Cloudflare 以及 Github 账号）

1. Fork 本项目到自己的账号下

2. 登录 Cloudflare 并点击左侧栏目中"计算(Workers)"底下的"Workers 和 Pages"

3. 点击右上角"创建"，选择"Pages"，点击"导入现有 Git 存储库"右侧的"开始使用"

4. 点击"连接 Github"，并登录你的 Github 账号

5. 选择项目存储库（如果你没有更名那应该是"claawqianduan"）并开始设置，在接下来的页面中框架预设选择`Vue`（如果不选择，你的网站会访问为空白），点击保存并部署

此时，项目已经部署完成，可以直接点击上方链接预览

如果需要绑定域名，可以点击"添加自定义域"、"设置自定义域"并填入目标域，点击继续

> 你的域名托管在 Cloudflare，直接点击"激活域"就可以完成

> 你的域名没有托管在 Cloudflare，根据指引添加 CNAME 记录即可

## 修改配置

### 方法1. 修改配置文件

自定义数据文件为项目 src 目录下面的 `config.js`，然后就是代码的拉取、修改上传。如果部署方式为 Cloudflare Pages，直接在 Github 修改后 Commit 即可自动部署

### 方法2. 在线修改环境变量（Cloudflare）

> (1). 到你的 Pages 项目，点击"设置"，找到"变量和机密"点击右侧"添加"

> (2). 要求填入"变量名称"为`VITE_CONFIG`，"值"根据 config.js 中的配置内容进行 JSON 格式化后填入

> (3). 点击"部署"，找到左侧带绿条的那个点击右侧三个点"重试部署"。等待部署完成即可

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

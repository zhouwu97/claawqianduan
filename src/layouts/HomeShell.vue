<template>
  <div class="scroll-progress" aria-hidden="true"></div>
  <svg class="sr-only" aria-hidden="true">
    <defs>
      <symbol id="i-home" viewBox="0 0 24 24">
        <path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7" />
      </symbol>
      <symbol id="i-grid" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </symbol>
      <symbol id="i-layers" viewBox="0 0 24 24">
        <path d="m3 7 9-5 9 5-9 5zM3 12l9 5 9-5M3 17l9 5 9-5" />
      </symbol>
      <symbol id="i-github" viewBox="0 0 24 24">
        <path
          d="M9 21v-3.8c-4 1.2-4-2-6-2.5M15 21v-3.8c0-1-.2-1.5-.6-2 3.3-.4 6.6-1.6 6.6-6.5A5 5 0 0 0 19.6 5c.2-.9.2-2-.2-3 0 0-1.4-.3-4.2 1.5a15 15 0 0 0-6.4 0C6 1.7 4.6 2 4.6 2c-.4 1-.4 2.1-.2 3A5 5 0 0 0 3 8.7c0 4.9 3.3 6.1 6.6 6.5-.4.5-.6 1-.6 2"
        />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m3 7 9 6 9-6" />
      </symbol>
      <symbol id="i-code" viewBox="0 0 24 24">
        <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />
      </symbol>
      <symbol id="i-music" viewBox="0 0 24 24">
        <path d="M10 18V5l10-2v13M10 7l10-2" />
        <ellipse cx="6.5" cy="18" rx="3.5" ry="3" />
        <ellipse cx="16.5" cy="16" rx="3.5" ry="3" />
      </symbol>
      <symbol id="i-bookmark" viewBox="0 0 24 24">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </symbol>
      <symbol id="i-search" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </symbol>
      <symbol id="i-settings" viewBox="0 0 24 24">
        <path
          d="m9.5 3-.6 2.4-2 .9-2.3-.7L2 10l1.8 1.7v2.2L2 15.6l2.6 4.4 2.3-.7 2 .9.6 2.4h5l.6-2.4 2-.9 2.3.7 2.6-4.4-1.8-1.7v-2.2L22 10l-2.6-4.4-2.3.7-2-.9-.6-2.4z"
          transform="translate(0 -1) scale(1 .95)"
        />
        <circle cx="12" cy="12" r="3" />
      </symbol>
      <symbol id="i-image" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8" r="1.5" />
        <path d="m3 17 5-5 4 4 4-6 5 7" />
      </symbol>
      <symbol id="i-info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </symbol>
      <symbol id="i-eye" viewBox="0 0 24 24">
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </symbol>
      <symbol id="i-pin" viewBox="0 0 24 24">
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z" />
        <circle cx="12" cy="10" r="2" />
      </symbol>
      <symbol id="i-play" viewBox="0 0 24 24">
        <path d="m8 4 12 8-12 8z" />
      </symbol>
      <symbol id="i-pause" viewBox="0 0 24 24">
        <path d="M8 4v16M16 4v16" stroke-width="3" />
      </symbol>
      <symbol id="i-next" viewBox="0 0 24 24">
        <path d="m5 5 10 7L5 19zM19 5v14" />
      </symbol>
      <symbol id="i-prev" viewBox="0 0 24 24">
        <path d="m19 5-10 7 10 7zM5 5v14" />
      </symbol>
      <symbol id="i-more" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </symbol>
      <symbol id="i-external" viewBox="0 0 24 24">
        <path
          d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"
        />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path d="m6 6 12 12M18 6 6 18" />
      </symbol>
      <symbol id="i-school" viewBox="0 0 24 24">
        <path d="m2 8 10-5 10 5-10 5zM6 10v7s6 5 12 0v-7M22 8v8" />
      </symbol>
    </defs>
  </svg>
  <a class="skip" href="#main">跳到主要内容</a>
  <div class="wallpaper" aria-hidden="true"></div>
  <video
    id="videoBg"
    playsinline
    autoplay
    loop
    muted
    hidden
    aria-hidden="true"
  ></video>
  <div class="wallpaper-shade" aria-hidden="true"></div>
  <aside class="rail" aria-label="个人资料与导航">
    <a href="#home" class="identity"
      ><img class="avatar" data-asset="avatar" :alt="site.name + '的头像'" />
      <div>
        <strong>{{ site.name }}<span class="dot">.</span></strong
        ><small>Student · Shenyang</small>
      </div></a
    >
    <nav class="navigation" aria-label="主导航">
      <a class="nav-link active" href="#home" data-nav="home"
        ><svg><use href="#i-home" /></svg>首页</a
      >
      <a class="nav-link" href="#projects" data-nav="projects"
        ><svg><use href="#i-grid" /></svg>项目与收藏</a
      >
      <a class="nav-link" href="#now" data-nav="now"
        ><svg><use href="#i-layers" /></svg>技能与近况</a
      >
      <a
        class="nav-link"
        href="https://github.com/zhouwu97"
        target="_blank"
        rel="noopener noreferrer"
        ><svg><use href="#i-github" /></svg>GitHub</a
      >
    </nav>
    <p class="rail-label">A little about me</p>
    <div class="tag-list" id="railTags"></div>
    <div class="rail-bottom">
      <div class="music-mini">
        <div class="music-caption">
          <button data-open="music">MY PLAYLIST</button>
          <div class="equalizer" aria-hidden="true"><i></i><i></i><i></i></div>
        </div>
        <div class="music-track" data-song-title>给生活一点背景音乐</div>
        <div class="music-author" data-song-author>点击播放，听听我的歌单</div>
        <div class="music-controls">
          <button data-music="prev" aria-label="上一首">
            <svg><use href="#i-prev" /></svg></button
          ><button class="play-btn" data-music="play" aria-label="播放音乐">
            <svg><use href="#i-play" /></svg></button
          ><button data-music="next" aria-label="下一首">
            <svg><use href="#i-next" /></svg></button
          ><button data-open="music" aria-label="打开歌单">
            <svg><use href="#i-music" /></svg>
          </button>
        </div>
      </div>
      <div class="socials">
        <a
          class="icon-btn"
          href="https://github.com/zhouwu97"
          aria-label="{{ site.name }}的 GitHub"
          target="_blank"
          rel="noopener noreferrer"
          ><svg><use href="#i-github" /></svg></a
        ><a
          class="icon-btn"
          href="mailto:wu22402@gmail.com"
          aria-label="给{{ site.name }}发邮件"
          ><svg><use href="#i-mail" /></svg></a
        ><a
          class="icon-btn"
          href="https://www.luogu.com.cn/user/1993718"
          aria-label="{{ site.name }}的洛谷"
          target="_blank"
          rel="noopener noreferrer"
          ><svg><use href="#i-code" /></svg></a
        ><button class="icon-btn" data-open="appearance" aria-label="外观设置">
          <svg><use href="#i-settings" /></svg></button
        ><button
          class="icon-btn"
          data-open="about"
          :aria-label="'关于' + site.name"
        >
          <svg><use href="#i-info" /></svg>
        </button>
      </div>
      <div class="rail-tools">
        <button data-clear>
          <svg
            style="
              width: 15px;
              height: 15px;
              vertical-align: -3px;
              margin-right: 4px;
            "
          >
            <use href="#i-eye" /></svg
          >只看壁纸</button
        ><span>·</span><button data-open="wallpaper">换个背景</button>
      </div>
    </div>
  </aside>
  <header class="mobile-header">
    <a href="#home" class="identity"
      ><img class="avatar" data-asset="avatar" alt="" />
      <div>
        <strong>{{ site.name }}<span class="dot">.</span></strong
        ><small>Student · Shenyang</small>
      </div></a
    >
    <div class="mobile-header-actions">
      <button class="icon-btn" data-open="music" aria-label="打开音乐">
        <svg><use href="#i-music" /></svg></button
      ><button class="icon-btn" data-open="more" aria-label="更多功能">
        <svg><use href="#i-more" /></svg>
      </button>
    </div>
  </header>
  <main class="content" id="main">
    <div class="topbar">
      <div>
        <span class="section-name">{{ site.name }}的小世界</span>
        <span style="margin: 0 10px; color: #655d70">/</span> PERSONAL HOMEPAGE
      </div>
      <div class="topbar-right">
        <span>欢迎，随便看看。</span
        ><button
          class="icon-btn"
          data-open="appearance"
          aria-label="个性化设置"
        >
          <svg><use href="#i-settings" /></svg>
        </button>
      </div>
    </div>
    <section class="hero" id="home">
      <div>
        <div class="eyebrow">Hello, nice to meet you</div>
        <h1>
          Hi, I'm <span class="name">{{ site.name }}</span
          ><span style="color: var(--accent)">.</span>
        </h1>
        <p class="hero-copy">
          {{ site.hero.intro }}<br />{{ site.hero.description }}
        </p>
        <div class="hero-meta">
          <svg><use href="#i-pin" /></svg>沈阳理工大学<span class="divider"
            >/</span
          ><span class="interests">普通学生 · 二次元</span>
        </div>
      </div>

    </section>
    <p class="quote">
      <span id="rotatingQuote">生活不止眼前的代码，还有远方的番剧和奶茶。</span
      ><span class="typing-caret" aria-hidden="true"></span>
    </p>
    <form class="search" id="searchForm" role="search">
      <label class="sr-only" for="engine">搜索引擎</label
      ><select id="engine">
        <option value="bing">Bing</option>
        <option value="google">Google</option>
        <option value="baidu">百度</option>
        <option value="yandex">Yandex</option>
        <option value="duckduckgo">DuckDuckGo</option></select
      ><label class="sr-only" for="searchInput">搜索关键词或网址</label
      ><input
        id="searchInput"
        type="text"
        placeholder="搜索，或者去一个网址…"
        autocomplete="off"
      /><span class="search-hint" aria-hidden="true">/</span
      ><button type="submit" aria-label="搜索或打开网址">
        <svg><use href="#i-search" /></svg>
      </button>
    </form>
    <aside class="home-companion" aria-label="时钟与大肥鱼助手">
      <div class="clock">
        <svg class="clock-orbit" viewBox="0 0 180 180" aria-hidden="true">
          <circle class="orbit-one" cx="90" cy="90" r="74" />
          <circle class="orbit-two" cx="90" cy="90" r="61" />
          <path d="M90 10v10M90 160v10M10 90h10M160 90h10" />
          <g class="orbit-star">
            <path d="M90 11l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          </g>
        </svg>
        <div class="clock-time" id="clockTime">--:--</div>
        <div class="clock-date" id="clockDate"></div>
        <div class="clock-status">大概率还没睡</div>
      </div>
      <section class="assistant-card" aria-labelledby="assistantTitle">
        <header class="assistant-header"><div><span class="assistant-eyebrow">YOUR LITTLE COMPANION</span><h2 id="assistantTitle">大肥鱼 <span>AI 助手</span></h2></div><span class="assistant-online" title="桌宠陪伴中"></span></header>
        <p class="assistant-description">给认真生活的你，一点摸鱼的陪伴。</p>
        <div id="petHost"></div>
        <div class="assistant-footnote"><span>鲸鲸娘</span><span>今天也请多多关照</span></div>
      </section>
      <a class="pet-project-link" href="https://github.com/zhouwu97/ds-pet" target="_blank" rel="noopener noreferrer">
        <svg aria-hidden="true"><use href="#i-github" /></svg>
        <span><strong>想要大肥鱼更完善，来提交吧</strong><small>ds-pet · Codex / DSH / Web</small></span>
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
    <section class="section" id="projects">
      <div class="section-heading">
        <div class="section-title">
          <span class="number">01</span>
          <h2>正在做的项目</h2>
        </div>
        <span class="section-subtitle">把想法变成真正能用的东西</span>
      </div>
      <article class="featured">
        <div class="project-info">
          <div class="project-kicker">
            FEATURED PROJECT <span>持续维护</span>
          </div>
          <h3>沈理校园 <small>SYLUlive</small></h3>
          <p>
            课表、成绩、学业、食堂、社区与竞赛。<br />把校园里的高频需求，放进一个
            App。
          </p>
          <div class="stack">
            <span>Flutter</span><span>Go</span><span>PostgreSQL</span>
          </div>
          <a
            class="button"
            href="https://github.com/zhouwu97/SYLUlive"
            target="_blank"
            rel="noopener noreferrer"
            ><svg><use href="#i-github" /></svg>查看项目源码</a
          ><a
            class="project-site-link"
            href="https://sylulive.online/"
            target="_blank"
            rel="noopener noreferrer"
            >项目官网</a
          >
        </div>
        <div class="project-visual">
          <div class="preview-glow" aria-hidden="true"></div>
          <div class="phone-preview">
            <img
              id="projectPreview"
              data-asset="campus"
              alt="沈理校园应用首页截图"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="preview-tabs" role="group" aria-label="项目界面预览">
            <button data-preview="campus" aria-pressed="true">首页</button
            ><button data-preview="schedule" aria-pressed="false">课表</button
            ><button data-preview="community" aria-pressed="false">社区</button
            ><button
              class="preview-expand"
              data-open="gallery"
              aria-label="放大应用截图"
            >
              <svg><use href="#i-external" /></svg>
            </button>
          </div>
        </div>
      </article>
      <article class="small-project">
        <div class="small-project-mark">
          <svg><use href="#i-home" /></svg>
        </div>
        <div>
          <span class="small-project-kicker">PERSONAL SPACE</span>
          <h3>这个小世界</h3>
          <p>
            放下项目，放进兴趣。一个可以听歌、换壁纸、收藏好网站的个人主页。
          </p>
          <div class="small-project-tags">
            Vue 3 · Vite · 轻量交互 · 个性化设置
          </div>
        </div>
        <a
          class="button secondary"
          href="https://github.com/zhouwu97/claawqianduan"
          target="_blank"
          rel="noopener noreferrer"
          >查看参考源码</a
        >
      </article>
    </section>
    <section class="section" id="favorites">
      <div class="section-heading">
        <div class="section-title">
          <span class="number">02</span>
          <h2>常去的地方</h2>
        </div>
        <span class="section-subtitle">算法、音乐和一些宝藏</span>
      </div>
      <div class="favorites">
        <a
          class="favorite"
          href="https://www.luogu.com.cn/user/1993718"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="favorite-icon"
            ><svg><use href="#i-code" /></svg
          ></span>
          <div><strong>洛谷</strong><small>算法练习与刷题记录</small></div>
          <svg class="last-icon"><use href="#i-external" /></svg></a
        ><a
          class="favorite"
          href="https://music.163.com/m/playlist?id=12440761642&creatorId=4940956665"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="favorite-icon"
            ><svg><use href="#i-music" /></svg
          ></span>
          <div>
            <strong>歌单分享</strong><small>给日常一点好听的声音</small>
          </div>
          <svg class="last-icon"><use href="#i-external" /></svg></a
        ><button class="favorite" data-open="treasure">
          <span class="favorite-icon"
            ><svg><use href="#i-bookmark" /></svg
          ></span>
          <div><strong>宝藏网站</strong><small>实用工具与资源收藏</small></div>
          <svg class="last-icon"><use href="#i-grid" /></svg>
        </button>
      </div>
    </section>
    <section class="section" id="now">
      <div class="section-heading">
        <div class="section-title">
          <span class="number">03</span>
          <h2>技能与近况</h2>
        </div>
        <span class="section-subtitle">持续学习，慢慢打磨</span>
      </div>
      <div class="utility-grid">
        <div class="panel">
          <div class="panel-heading">
            <h3>常用技术栈</h3>
            <span>MY TOOLKIT</span>
          </div>
          <div class="skills" id="skillsList">
            <a
              class="stack-entry"
              href="https://github.com/zhouwu97/SYLUlive/tree/main/client"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 Flutter / Dart 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">Flutter / Dart</span
                ><span class="stack-project">沈理校园 · 移动客户端</span></span
              ><span class="stack-kind">应用</span></a
            ><a
              class="stack-entry"
              href="https://github.com/zhouwu97/key-cabinet/tree/main/server"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 Go / Gin 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">Go / Gin</span
                ><span class="stack-project"
                  >沈理校园 · 钥匙借还 · 购物平台</span
                ></span
              ><span class="stack-kind">后端</span></a
            ><a
              class="stack-entry"
              href="https://github.com/zhouwu97/shumozizi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 Python 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">Python</span
                ><span class="stack-project"
                  >建模工具 · 校园 MCP 服务</span
                ></span
              ><span class="stack-kind">工具</span></a
            ><a
              class="stack-entry"
              href="https://github.com/zhouwu97/claawqianduan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 Vue 3 / Vite 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">Vue 3 / Vite</span
                ><span class="stack-project">个人主页 · 轻量交互</span></span
              ><span class="stack-kind">主页</span></a
            ><a
              class="stack-entry"
              href="https://github.com/zhouwu97/beiyoujiang"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 React / Next.js 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">React / Next.js</span
                ><span class="stack-project">beiyoujiang · 网页项目</span></span
              ><span class="stack-kind">网页</span></a
            ><a
              class="stack-entry"
              href="https://github.com/zhouwu97/key-cabinet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看 TypeScript 对应项目"
              ><span class="stack-main"
                ><span class="stack-name">TypeScript</span
                ><span class="stack-project">钥匙借还 · 微信小程序</span></span
              ><span class="stack-kind">小程序</span></a
            >
          </div>
          <p class="skill-note">项目里用过的技术，还在慢慢学。</p>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <h3>最近在做</h3>
            <span>NOW</span>
          </div>
          <a
            class="activity"
            href="https://github.com/zhouwu97/SYLUlive"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="activity-icon"
              ><svg><use href="#i-school" /></svg
            ></span>
            <div>
              <strong>沈理校园 SYLUlive</strong
              ><small>校园应用 · Flutter + Go</small>
            </div>
            <span class="badge">开发中</span></a
          ><a
            class="activity"
            href="https://www.luogu.com.cn/user/1993718"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="activity-icon"
              ><svg><use href="#i-code" /></svg
            ></span>
            <div>
              <strong>算法练习</strong><small>NowCoder · AtCoder · Luogu</small>
            </div>
            <span class="badge">日常</span></a
          >
          <p class="skill-note">写代码，也留一点时间给生活。</p>
        </div>
      </div>
    </section>
    <section class="section personal-section" id="life">
      <div class="section-heading">
        <div class="section-title">
          <span class="number">04</span>
          <h2>关于我</h2>
        </div>
        <span class="section-subtitle">一点简单的自我介绍</span>
      </div>
      <div class="life-grid">
        <div class="life-intro panel">
          <div class="life-identity">
            <img
              class="avatar"
              data-asset="avatar"
              :alt="site.name + '的头像'"
              loading="lazy"
            />
            <div>
              <h3>{{ site.name }}<span>.</span></h3>
              <p>沈阳 · 沈阳理工大学</p>
            </div>
          </div>
          <p class="life-copy">
            普通学生一枚。<br />时不时写点简单算法题，偶尔折腾点小东西。<br />大社恐，平时听听歌、看看番。
          </p>
          <div class="tag-list" id="lifeTags"></div>
        </div>
        <div class="life-channels">
          <button class="life-channel" data-open="music">
            <span class="channel-number">01</span
            ><svg><use href="#i-music" /></svg>
            <div>
              <strong>戴上耳机</strong
              ><small>一边写代码，一边听喜欢的歌。</small>
            </div>
            <span class="channel-action">听听歌单</span></button
          ><button class="life-channel" data-open="wallpaper">
            <span class="channel-number">02</span
            ><svg><use href="#i-image" /></svg>
            <div>
              <strong>换个心情</strong
              ><small>二次元壁纸，和一点自己的颜色。</small>
            </div>
            <span class="channel-action">换张壁纸</span></button
          ><a
            class="life-channel"
            href="https://www.luogu.com.cn/user/1993718"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="channel-number">03</span
            ><svg><use href="#i-code" /></svg>
            <div>
              <strong>每天一点小进步</strong
              ><small>把想到的解法，变成通过的代码。</small>
            </div>
            <span class="channel-action">去刷题</span></a
          >
        </div>
      </div>
    </section>
    <section class="section" id="toolbox">
      <div class="section-heading">
        <div class="section-title">
          <span class="number">05</span>
          <h2>随手打开的工具</h2>
        </div>
        <button class="text-link" data-open="treasure">全部收藏</button>
      </div>
      <div class="toolbox-grid">
        <a
          href="https://smallpdf.com/cn/pdf-to-jpg"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-tile"
          ><span class="tool-symbol">PDF</span><strong>SmallPDF</strong
          ><small>转换、压缩与编辑</small></a
        ><a
          href="https://leetcode.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-tile"
          ><span class="tool-symbol">{ }</span><strong>LeetCode</strong
          ><small>算法与面试练习</small></a
        ><a
          href="https://www.luogu.com.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-tile"
          ><span class="tool-symbol">&lt;/&gt;</span><strong>洛谷</strong
          ><small>竞赛题目与题解</small></a
        ><a
          href="https://github.com/zhouwu97"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-tile"
          ><span class="tool-symbol"
            ><svg><use href="#i-github" /></svg></span
          ><strong>GitHub</strong><small>项目源码与更新</small></a
        >
      </div>
    </section>
    <footer class="footer">
      <span
        >© <span id="year"></span> {{ site.name }} ·
        <a
          href="https://zhouwu.ccwu.cc/"
          target="_blank"
          rel="noopener noreferrer"
          >zhouwu.ccwu.cc</a
        ></span
      ><span>写代码，也写点生活 <em>✦</em></span>
    </footer>
  </main>
  <nav class="mobile-dock" aria-label="手机导航">
    <a class="active" href="#home" data-nav="home"
      ><svg><use href="#i-home" /></svg>首页</a
    ><a href="#projects" data-nav="projects"
      ><svg><use href="#i-grid" /></svg>项目</a
    ><a href="#now" data-nav="now"
      ><svg><use href="#i-layers" /></svg>近况</a
    ><button data-open="more">
      <svg><use href="#i-more" /></svg>更多
    </button>
  </nav>
  <button class="return-button" id="returnButton" hidden>
    <svg><use href="#i-home" /></svg>返回主页
  </button>
  <div class="toast" id="toast" role="status" hidden></div>
  <audio id="audio" preload="none"></audio>
  <dialog id="settingsDialog" aria-labelledby="settingsTitle">
    <div class="dialog-head">
      <h2 id="settingsTitle">让主页更像你</h2>
      <button class="icon-btn" data-close aria-label="关闭设置">
        <svg><use href="#i-close" /></svg>
      </button>
    </div>
    <div class="dialog-tabs" role="tablist" aria-label="设置分类">
      <button
        id="tab-appearance"
        role="tab"
        aria-controls="pane-appearance"
        aria-selected="true"
        data-tab="appearance"
      >
        外观</button
      ><button
        id="tab-wallpaper"
        role="tab"
        aria-controls="pane-wallpaper"
        aria-selected="false"
        data-tab="wallpaper"
      >
        壁纸</button
      ><button
        id="tab-music"
        role="tab"
        aria-controls="pane-music"
        aria-selected="false"
        data-tab="music"
      >
        音乐
      </button>
    </div>
    <div
      class="dialog-body"
      id="pane-appearance"
      role="tabpanel"
      aria-labelledby="tab-appearance"
    >
      <div class="field">
        <span class="field-title">点缀色</span>
        <div class="color-options">
          <button
            class="color-swatch"
            style="--swatch: #ff89b5"
            data-color="#ff89b5"
            aria-label="樱花粉"
            aria-pressed="true"
          ></button
          ><button
            class="color-swatch"
            style="--swatch: #c1a3ff"
            data-color="#c1a3ff"
            aria-label="浅紫色"
            aria-pressed="false"
          ></button
          ><button
            class="color-swatch"
            style="--swatch: #92c9e8"
            data-color="#92c9e8"
            aria-label="天空蓝"
            aria-pressed="false"
          ></button
          ><button
            class="color-swatch"
            style="--swatch: #9cd5b8"
            data-color="#9cd5b8"
            aria-label="薄荷绿"
            aria-pressed="false"
          ></button
          ><label class="sr-only" for="customColor">自定义点缀色</label
          ><input type="color" id="customColor" value="#ff89b5" />
        </div>
      </div>
      <div class="field">
        <label for="brightness"
          >壁纸亮度 <output id="brightnessValue">68%</output></label
        ><input
          class="range"
          id="brightness"
          type="range"
          min="20"
          max="100"
          value="68"
        /><small>只调整背景亮度，文字始终保持清晰。</small>
      </div>
      <div class="field">
        <label for="blur">背景模糊 <output id="blurValue">0px</output></label
        ><input
          class="range"
          id="blur"
          type="range"
          min="0"
          max="16"
          value="0"
        />
      </div>
      <p class="dialog-copy">修改会即时显示，并保存在当前浏览器。</p>
    </div>
    <div
      class="dialog-body"
      id="pane-wallpaper"
      role="tabpanel"
      aria-labelledby="tab-wallpaper"
      hidden
    >
      <div class="field">
        <span class="field-title">选择背景</span>
        <div class="wallpaper-options">
          <button
            class="wallpaper-option"
            data-wall="original"
            aria-pressed="true"
          >
            <img data-asset="pc" alt="默认二次元壁纸" /><span
              >默认壁纸</span
            ></button
          ><button
            class="wallpaper-option"
            data-wall="illustration"
            aria-pressed="false"
          >
            <img data-asset="illustration" alt="Ciallo 插画" /><span
              >Ciallo 插画</span
            ></button
          ><button
            class="wallpaper-option"
            data-wall="plain"
            aria-pressed="false"
            style="background: linear-gradient(135deg, #281e33, #141219)"
          >
            <span>安静纯色</span>
          </button>
        </div>
      </div>
      <div class="field">
        <label for="wallpaperFile">使用自己的图片</label
        ><input
          class="file-input"
          type="file"
          id="wallpaperFile"
          accept="image/*"
        /><small>图片只保存在当前浏览器，不会上传。</small>
      </div>
      <div class="field">
        <label for="videoUrl">动态壁纸地址（MP4 / WebM）</label
        ><input
          class="text-input"
          id="videoUrl"
          type="url"
          placeholder="https://…"
        />
        <div class="inline-buttons" style="margin-top: 10px">
          <button class="button secondary" id="applyVideo">应用动态壁纸</button
          ><button class="button secondary" data-clear>只看壁纸</button>
        </div>
        <small>动态壁纸需要联网；开启后可用默认壁纸恢复。</small>
      </div>
    </div>
    <div
      class="dialog-body"
      id="pane-music"
      role="tabpanel"
      aria-labelledby="tab-music"
      hidden
    >
      <div class="song-now">
        <div class="album-cover" id="albumCover">
          <svg><use href="#i-music" /></svg>
        </div>
        <div>
          <h3 data-song-title>给生活一点背景音乐</h3>
          <p data-song-author>点击播放，听听我的歌单</p>
        </div>
      </div>
      <div class="music-full-controls">
        <button class="icon-btn" data-music="prev" aria-label="上一首">
          <svg><use href="#i-prev" /></svg></button
        ><button
          class="icon-btn play-btn"
          data-music="play"
          aria-label="播放音乐"
        >
          <svg><use href="#i-play" /></svg></button
        ><button class="icon-btn" data-music="next" aria-label="下一首">
          <svg><use href="#i-next" /></svg></button
        ><span class="music-status" id="musicStatus">等待播放</span
        ><button class="text-link" id="retryMusic" style="margin-left: auto">
          刷新歌单
        </button>
      </div>
      <div class="seek-row">
        <span id="currentTime">0:00</span
        ><label class="sr-only" for="seek">播放进度</label
        ><input
          class="range"
          type="range"
          id="seek"
          min="0"
          max="100"
          value="0"
        /><span id="duration">0:00</span>
      </div>
      <div class="field" style="margin: 12px 0">
        <label for="volume" style="font-size: 12px; color: var(--faint)"
          >音量 <output id="volumeValue">65%</output></label
        ><input
          class="range"
          id="volume"
          type="range"
          min="0"
          max="100"
          value="65"
        />
      </div>
      <p class="lyric" id="lyric">音乐不会自动播放。</p>
      <div class="music-message" id="musicMessage" hidden></div>
      <div class="music-connection">
        <span id="musicSourceLabel">歌单已就绪</span
        ><span id="connectionLatency"></span>
      </div>
      <div class="song-list" id="songList"></div>
      <details class="music-options">
        <summary>音乐来源与本地播放</summary>
        <div class="field">
          <label for="musicSource">在线歌单来源</label
          ><select class="text-input" id="musicSource">
            <option value="shared">共享接口</option>
            <option value="original">原站接口</option>
            <option value="custom">自己的 Meting 接口</option>
          </select>
        </div>
        <div class="field" id="customApiField" hidden>
          <label for="customMusicApi">完整歌单接口地址</label
          ><input
            class="text-input"
            type="url"
            id="customMusicApi"
            placeholder="https://…?server=netease&amp;type=playlist&amp;id=…"
          /><button
            class="button secondary"
            id="applyMusicApi"
            style="margin-top: 10px"
          >
            连接接口
          </button>
        </div>
        <div class="field">
          <label for="localMusic">播放本地音乐</label
          ><input
            class="file-input"
            id="localMusic"
            type="file"
            accept="audio/*"
            multiple
          /><small>文件只在本机播放，不会上传。刷新页面后需要重新选择。</small>
        </div>
      </details>
      <a
        class="playlist-link"
        href="https://music.163.com/playlist?id=2028178887"
        target="_blank"
        rel="noopener noreferrer"
        >在网易云打开播放器歌单</a
      >
    </div>
    <div class="dialog-actions">
      <button class="button secondary" id="resetPreferences">恢复默认</button
      ><button class="button" data-close>完成</button>
    </div>
  </dialog>
  <dialog id="treasureDialog" aria-labelledby="treasureTitle">
    <div class="dialog-head">
      <h2 id="treasureTitle">宝藏网站</h2>
      <button class="icon-btn" data-close aria-label="关闭收藏">
        <svg><use href="#i-close" /></svg>
      </button>
    </div>
    <div class="dialog-body">
      <p class="dialog-copy" style="margin-top: 0">
        一些常用工具，和互联网上的好地方。
      </p>
      <div class="resource-grid" id="resourceList"></div>
    </div>
  </dialog>
  <dialog id="aboutDialog" aria-labelledby="aboutTitle">
    <div class="dialog-head">
      <h2 id="aboutTitle">关于{{ site.name }}</h2>
      <button class="icon-btn" data-close aria-label="关闭关于">
        <svg><use href="#i-close" /></svg>
      </button>
    </div>
    <div class="dialog-body">
      <div class="about-profile">
        <img class="avatar" data-asset="avatar" :alt="site.name + '的头像'" />
        <div>
          <h3>{{ site.name }}<span style="color: var(--accent)">.</span></h3>
          <p>沈阳理工大学 · 普通学生</p>
        </div>
      </div>
      <p style="color: var(--muted); font-size: 15px">
        普通学生一枚，时不时写点简单算法题，偶尔折腾点小东西。大社恐，平时听听歌、看看番。
      </p>
      <div class="tag-list about-tags" id="aboutTags"></div>
      <p class="dialog-copy" style="margin-top: 22px">
        生活不止眼前的代码，还有远方的番剧和奶茶。
      </p>
      <div class="more-socials">
        <a
          href="https://github.com/zhouwu97"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        ><a href="mailto:wu22402@gmail.com">wu22402@gmail.com</a
        ><a
          href="https://www.luogu.com.cn/user/1993718"
          target="_blank"
          rel="noopener noreferrer"
          >洛谷</a
        >
      </div>
      <p class="dialog-copy" style="margin-top: 22px">
        主页基于
        <a
          href="https://github.com/zhouwu97/claawqianduan"
          target="_blank"
          rel="noopener noreferrer"
          style="color: var(--accent)"
          >zhouwu97/claawqianduan</a
        >
        的内容与素材制作。原项目灵感来源：<a
          href="https://github.com/leleo886"
          target="_blank"
          rel="noopener noreferrer"
          >leleo886</a
        >。
      </p>
    </div>
  </dialog>
  <dialog id="moreDialog" aria-labelledby="moreTitle">
    <div class="dialog-head">
      <h2 id="moreTitle">更多小功能</h2>
      <button class="icon-btn" data-close aria-label="关闭更多">
        <svg><use href="#i-close" /></svg>
      </button>
    </div>
    <div class="dialog-body">
      <div class="more-grid">
        <button data-open="music">
          <svg><use href="#i-music" /></svg>音乐与歌单</button
        ><button data-open="appearance">
          <svg><use href="#i-settings" /></svg>外观设置</button
        ><button data-open="wallpaper">
          <svg><use href="#i-image" /></svg>更换壁纸</button
        ><button data-open="treasure">
          <svg><use href="#i-bookmark" /></svg>宝藏网站</button
        ><button data-open="about">
          <svg><use href="#i-info" /></svg>关于我</button
        ><button data-clear>
          <svg><use href="#i-eye" /></svg>只看壁纸
        </button>
      </div>
      <div class="more-socials">
        <a
          href="https://github.com/zhouwu97"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        ><a href="mailto:wu22402@gmail.com">邮件</a
        ><a
          href="https://www.luogu.com.cn/user/1993718"
          target="_blank"
          rel="noopener noreferrer"
          >洛谷</a
        ><a
          href="https://zhouwu.ccwu.cc/"
          target="_blank"
          rel="noopener noreferrer"
          >原主页</a
        >
      </div>
    </div>
  </dialog>
  <dialog id="galleryDialog" aria-labelledby="galleryTitle">
    <div class="dialog-head">
      <h2 id="galleryTitle">沈理校园 · 首页</h2>
      <button class="icon-btn" data-close aria-label="关闭界面预览">
        <svg><use href="#i-close" /></svg>
      </button>
    </div>
    <div class="dialog-body gallery-body">
      <img
        id="galleryImage"
        data-asset="campus"
        alt="沈理校园应用首页完整截图"
        loading="lazy"
      />
    </div>
  </dialog>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { initHomepage } from "../homeApp.js";
import { site } from "../config.js";
let dispose;
onMounted(() => {
  dispose = initHomepage();
});
onBeforeUnmount(() => {
  dispose?.();
});
</script>

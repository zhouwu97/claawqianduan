import { PET_STATES, petFrame, petDirection, petPosition, petBubble } from './motion.js';

/** Dependency-free, isolated desktop pet. Source artwork © 2026 zhouwu97, MIT. */
export function registerJingjingPet() {
  if (customElements.get('jingjing-pet')) return;
  customElements.define('jingjing-pet', class extends HTMLElement {
    connectedCallback() {
      if (this.dispose) return;
      const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>
        :host{display:block;position:relative;color:var(--pet-text,#eceaf6);font:13px/1.5 "Segoe UI","Microsoft YaHei",sans-serif;--pet-accent:#a9bfff;--pet-line:#ffffff20;--pet-surface:#ffffff08;contain:layout style}
        *{box-sizing:border-box}button,input{font:inherit}button{color:inherit;cursor:pointer}button:focus-visible,summary:focus-visible{outline:2px solid var(--pet-accent);outline-offset:3px}button:disabled{opacity:.45;cursor:wait}[hidden]{display:none!important}
        .stage{height:260px;position:relative;overflow:hidden;border-radius:16px;background:radial-gradient(ellipse at 50% 76%,#869aff16,transparent 64%)}
        .ground{position:absolute;bottom:24px;left:22%;width:56%;height:14px;border-radius:50%;background:#899ee91c;filter:blur(5px);pointer-events:none}
        .actor{position:absolute;inset:0;pointer-events:none}.nest{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--pet-muted,#a5a4b7);font-size:12px}.nest svg{width:42px;height:42px;fill:none;stroke:var(--pet-accent);stroke-width:1.3;opacity:.65}.nest p{margin:0}.nest button{padding:6px 14px;background:var(--pet-surface);border:1px solid var(--pet-line);border-radius:9px}
        .body{position:absolute;pointer-events:auto;touch-action:none;user-select:none;cursor:grab;border:0;background:transparent;padding:0;border-radius:30px}
        .body:active{cursor:grabbing}.sprite{display:block;width:192px;height:208px;transform-origin:top left;background-repeat:no-repeat;background-size:1536px 2288px;clip-path:polygon(0 38px,103px 38px,103px 0,100% 0,100% 100%,0 100%);pointer-events:none}
        .bubble{position:absolute;top:8px;left:8px;max-width:calc(100% - 28px);width:max-content;overflow-wrap:anywhere;padding:8px 17px;border:2px solid #859bd4;border-radius:50% / 45%;background:#edf2ff;color:#344577;font-weight:650;font-size:12px;text-align:center;pointer-events:none;z-index:2;box-shadow:0 3px 14px #10102118}
        .bubble:after{content:'';position:absolute;width:7px;height:7px;border:2px solid #859bd4;border-radius:50%;background:#edf2ff;bottom:-12px;left:var(--bubble-tail,55%)}
        .hint{font-size:11px;color:var(--pet-muted,#a5a4b7);text-align:center;margin:0 0 16px}.controls{display:flex;justify-content:center;gap:7px;flex-wrap:wrap}
        .controls button,.return,.reset{border:1px solid var(--pet-line);background:var(--pet-surface);border-radius:9px;padding:7px 12px;transition:background .16s,transform .16s}
        button:hover{background:#9bacdf20}.body:hover{background:transparent}.controls button:active{transform:translateY(1px)}
        .tools{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:15px 0 0;color:var(--pet-muted,#a5a4b7);font-size:11px}.tools button{border:0;background:none;padding:3px 0}.tools button:hover{color:var(--pet-accent)}
        details{margin-top:12px;border-top:1px solid var(--pet-line);padding-top:10px;color:var(--pet-muted,#a5a4b7);font-size:12px}summary{cursor:pointer;width:fit-content}label{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}input[type=range]{width:135px;accent-color:var(--pet-accent)}.reset{margin-top:12px;font-size:12px}
        :host-context(.clear-mode){display:none!important}:host([floating]) .ground{display:none}
        :host(.jingjing-roamer){position:fixed;z-index:30;display:block;padding:0;border:0;background:transparent;box-shadow:none;pointer-events:none;contain:layout style}.roaming-surface{position:relative;width:100%;height:100%;pointer-events:none}
        @media(max-width:600px){.stage{height:240px}.controls{gap:6px}.controls button{padding:6px 10px}}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      </style>
      <div class="stage"><div class="ground"></div><div class="nest" hidden><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 22 24 8l16 14v18H8zM19 40V26h10v14"/></svg><p>大肥鱼出去玩啦</p><button class="recall">叫她回窝</button><small>也可以双击人物回窝</small></div><div class="actor"><div class="bubble" role="status" aria-live="polite">哦鲸鲸…</div><button class="body" aria-label="大肥鱼：点击打招呼，方向键移动，拖动换位置" title="戳戳我 · 拖动我"><span class="sprite"></span></button></div></div>
      <p class="hint">戳戳打招呼 · 悬停跳跃 · 拖动陪你走</p>
      <div class="controls" aria-label="桌宠互动"><button data-action="waving">招招手</button><button data-action="jumping">投喂</button><button class="sleep" aria-pressed="false">休息</button></div>
      <div class="tools"><button class="float">放出来 ↗</button><span class="state">陪伴中</span><button class="home">回到原位</button></div>
      <details><summary>桌宠偏好</summary><label>角色大小 <input class="size" aria-label="角色大小" type="range" min="128" max="224" value="192" /></label><label>鼠标视线跟随 <input class="follow" type="checkbox" checked /></label><button class="reset">恢复默认偏好</button></details>`;
      const $ = s => root.querySelector(s);
      const abort = new AbortController();
      const on = (target, event, fn, options = {}) => target.addEventListener(event, fn, { ...options, signal: abort.signal });
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const stage = $('.stage'), actor = $('.actor'), body = $('.body'), sprite = $('.sprite'), bubble = $('.bubble');
      let size = 192, sleeping = false, follow = true, position = null;
      let dragging = null, suppressClick = false, hover = false, gaze = null, visible = true;
      let activity = 'idle', transient = null, actionUntil = 0, bubbleUntil = 0, frameId = 0;
      let current = '', start = performance.now(), lastPaint = '', disposed = false;
      const storageKey = this.getAttribute('storage-key');
      let portal = null, travel = null, trip = 0;
      const scene = () => portal ?? stage;
      if (storageKey) {
        try {
          const saved = JSON.parse(localStorage.getItem(storageKey));
          if (saved && typeof saved === 'object') {
            if (Number.isFinite(saved.size)) size = Math.max(128, Math.min(224, saved.size));
            follow = saved.follow !== false;
          }
        } catch {}
      }
      const save = () => { if (storageKey) try { localStorage.setItem(storageKey, JSON.stringify({ size, follow })); } catch {} };
      const positionBubble = () => {
        const point = petBubble({ x: body.offsetLeft, y: body.offsetTop, width: body.offsetWidth, height: body.offsetHeight }, bubble.offsetWidth, bubble.offsetHeight, scene().clientWidth, scene().clientHeight);
        bubble.style.left = point.x + 'px'; bubble.style.top = point.y + 'px';
        bubble.style.setProperty('--bubble-tail', point.tailX + 'px');
      };
      const say = (text, duration = 2600) => { bubble.textContent = text; bubbleUntil = performance.now() + duration; positionBubble(); };
      const play = (name, text) => {
        if (!PET_STATES[name]) return;
        sleeping = false; $('.sleep').textContent = '休息'; $('.sleep').setAttribute('aria-pressed', 'false');
        transient = name; actionUntil = performance.now() + 1500;
        if (text) say(text);
      };
      const layout = () => {
        const width = Math.min(size, scene().clientWidth);
        const height = width * 208 / 192;
        body.style.width = width + 'px'; body.style.height = height + 'px';
        sprite.style.transform = `scale(${width / 192})`;
        const point = petPosition(position?.x ?? (scene().clientWidth - width) / 2, position?.y ?? scene().clientHeight - height - 14, scene().clientWidth, scene().clientHeight, width, height, 36);
        body.style.left = point.x + 'px'; body.style.top = point.y + 'px';
        if (position) position = point;
        positionBubble();
      };
      $('.size').value = size; $('.follow').checked = follow;
      const image = new Image();
      body.disabled = true;
      image.onload = () => {
        if (disposed) return;
        if (image.naturalWidth !== 1536 || image.naturalHeight !== 2288) { say('素材尺寸不正确，需要 v2 精灵图', Infinity); return; }
        sprite.style.backgroundImage = `url("${image.src}")`;
        this.dataset.asset = 'ready'; body.disabled = false;
      };
      image.onerror = () => { if (!disposed) { this.dataset.asset = 'failed'; say('素材没加载成功，刷新后再试试', Infinity); } };
      image.src = this.getAttribute('src') || '';
      const animate = now => {
        frameId = 0;
        if (disposed || document.hidden || (!visible && !portal) || this.closest('.clear-mode')) return;
        const action = dragging?.moved ? (dragging.dx < 0 ? 'running-left' : 'running-right') : sleeping ? 'sleep' : now < actionUntil ? transient : hover ? 'jumping' : activity;
        if (action !== current) { current = action; start = now; this.dataset.state = action; }
        let cell = action === 'sleep' ? { row: 0, column: 3 } : petFrame(action, now - start, motion.matches);
        if (action === 'idle' && follow && !motion.matches && gaze) cell = gaze;
        const key = cell.row + ':' + cell.column;
        if (key !== lastPaint) { sprite.style.backgroundPosition = `${-192 * cell.column}px ${-208 * cell.row}px`; lastPaint = key; }
        if (bubbleUntil && now >= bubbleUntil) { bubble.textContent = sleeping ? '休息一下，等你回来…' : '哦鲸鲸…'; bubbleUntil = 0; positionBubble(); }
        const label = portal ? '外出中' : sleeping ? '休息中' : activity === 'idle' ? '陪伴中' : ({ running: '工作中', failed: '遇到问题', waiting: '等你回来', review: '检查中' }[activity] ?? '陪伴中');
        if ($('.state').textContent !== label) $('.state').textContent = label;
        frameId = requestAnimationFrame(animate);
      };
      const resume = () => { if (!frameId && !disposed && !document.hidden && (visible || portal)) frameId = requestAnimationFrame(animate); };
      const cancelDrag = () => { if (dragging && body.hasPointerCapture(dragging.id)) body.releasePointerCapture(dragging.id); dragging = null; hover = false; gaze = null; };
      on(body, 'pointerenter', e => { if (e.pointerType !== 'touch') hover = true; });
      on(body, 'pointerleave', () => { hover = false; });
      on(document, 'pointermove', e => {
        if ((!visible && !portal) || !follow || dragging || e.pointerType === 'touch') return;
        const r = body.getBoundingClientRect(); gaze = petDirection(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height * .4);
      }, { passive: true });
      on(document, 'pointerout', e => { if (!e.relatedTarget) gaze = null; });
      on(body, 'pointerdown', e => {
        if (e.button !== 0 || dragging) return;
        if (portal) stopTravel();
        const box = portal ? portal.getBoundingClientRect() : body.getBoundingClientRect();
        dragging = { id: e.pointerId, x: e.clientX, y: e.clientY, left: box.left, top: box.top, dx: 0, lastX: e.clientX, moved: false };
        suppressClick = false; body.setPointerCapture(e.pointerId);
      });
      on(body, 'pointermove', e => {
        if (!dragging || dragging.id !== e.pointerId) return;
        const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
        if (Math.hypot(dx, dy) > 5) dragging.moved = true;
        dragging.dx = e.clientX - dragging.lastX; dragging.lastX = e.clientX;
        if (!dragging.moved) return;
        if (portal) {
          const point = petPosition(dragging.left + dx, dragging.top + dy, innerWidth, innerHeight, portal.offsetWidth, portal.offsetHeight);
          portal.style.left = point.x + 'px'; portal.style.top = point.y + 'px';
        } else {
          const r = stage.getBoundingClientRect();
          position = { x: dragging.left + dx - r.left, y: dragging.top + dy - r.top }; layout();
        }
      });
      on(body, 'pointerup', e => { if (dragging?.id === e.pointerId) { suppressClick = dragging.moved; cancelDrag(); } });
      on(body, 'pointercancel', () => { suppressClick = true; cancelDrag(); });
      on(body, 'lostpointercapture', () => { if (dragging) { suppressClick = true; dragging = null; hover = false; } });
      on(body, 'click', () => { if (suppressClick) { suppressClick = false; return; } play('waving', '嗨，今天也要开心呀！'); });
      on(body, 'keydown', e => {
        const steps = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
        if (!steps[e.key]) return;
        e.preventDefault(); const [dx, dy] = steps[e.key];
        if (portal) { stopTravel(); const box = portal.getBoundingClientRect(); const point = petPosition(box.x + dx, box.y + dy, innerWidth, innerHeight, box.width, box.height); portal.style.left = point.x + 'px'; portal.style.top = point.y + 'px'; }
        else { position = { x: parseFloat(body.style.left) + dx, y: parseFloat(body.style.top) + dy }; layout(); }
      });
      root.querySelectorAll('[data-action]').forEach(button => on(button, 'click', () => play(button.dataset.action, button.dataset.action === 'jumping' ? '啊呜，谢谢你的投喂！' : '在呢在呢，陪你一起摸鱼～')));
      on($('.sleep'), 'click', () => {
        sleeping = !sleeping; hover = false; gaze = null; actionUntil = 0;
        $('.sleep').textContent = sleeping ? '唤醒' : '休息'; $('.sleep').setAttribute('aria-pressed', String(sleeping));
        say(sleeping ? '休息一下，等你回来…' : '睡醒啦，又是元气满满的一天！');
      });
      const fitPortal = () => {
        if (!portal) return;
        portal.style.width = Math.min(Math.max(size + 64, 240), innerWidth - 16) + 'px';
        portal.style.height = Math.min(size * 208 / 192 + 64, innerHeight - 16) + 'px';
      };
      const stopTravel = () => {
        trip++;
        if (!travel || !portal) return;
        const box = portal.getBoundingClientRect();
        travel.cancel(); travel = null;
        portal.style.left = box.x + 'px'; portal.style.top = box.y + 'px';
      };
      const travelTo = (point, instant, done) => {
        const box = portal.getBoundingClientRect(), dx = box.x - point.x, dy = box.y - point.y;
        portal.style.left = point.x + 'px'; portal.style.top = point.y + 'px';
        if (instant || motion.matches || document.hidden) { done(); return; }
        const token = ++trip;
        travel = portal.animate([
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: `translate(${dx * .45}px, ${dy * .45 - 18}px)`, offset: .55 },
          { transform: 'translate(0, 0)' },
        ], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        travel.finished.then(() => { if (token !== trip || disposed) return; travel = null; done(); }).catch(() => {});
      };
      const goHome = (instant = false) => {
        if (!portal) { position = null; layout(); return; }
        stopTravel(); cancelDrag();
        const home = stage.getBoundingClientRect();
        const width = Math.min(size, stage.clientWidth), height = width * 208 / 192;
        const point = petPosition((stage.clientWidth - width) / 2, stage.clientHeight - height - 14, stage.clientWidth, stage.clientHeight, width, height, 36);
        const destination = { x: home.x + point.x - body.offsetLeft, y: home.y + point.y - body.offsetTop };
        play(destination.x < portal.getBoundingClientRect().x ? 'running-left' : 'running-right', '回小窝咯～');
        // If the home is off screen, return immediately instead of racing across a long page.
        travelTo(destination, instant || home.bottom < 0 || home.top > innerHeight, () => {
          const focusedPet = portal.shadowRoot.activeElement === body;
          stage.append(actor); portal.remove(); portal = null; this.removeAttribute('floating');
          $('.nest').hidden = true; $('.float').textContent = '放出来 ↗';
          body.title = '戳戳我 · 拖动我'; position = null; layout();
          play('waving', '到家啦，还是窝里舒服');
          if (focusedPet) $('.float').focus();
        });
      };
      const goOut = (instant = false) => {
        if (portal) { goHome(instant); return; }
        cancelDrag();
        const origin = body.getBoundingClientRect();
        portal = document.createElement('div'); portal.className = 'jingjing-roamer';
        const floatingRoot = portal.attachShadow({ mode: 'open' });
        floatingRoot.append(root.querySelector('style').cloneNode(true));
        const surface = document.createElement('div'); surface.className = 'roaming-surface';
        floatingRoot.append(surface); surface.append(actor); document.body.append(portal);
        // Keep all controls in the original component, with only the actor in the transparent portal.
        this.setAttribute('floating', ''); $('.nest').hidden = false; $('.float').textContent = '回到窝里 ↙';
        body.title = '拖动陪你走 · 双击或右键回窝';
        fitPortal(); position = null; layout();
        const start = { x: origin.x - body.offsetLeft, y: origin.y - body.offsetTop };
        portal.style.left = start.x + 'px'; portal.style.top = start.y + 'px';
        const target = petPosition(stage.getBoundingClientRect().left - portal.offsetWidth - 24, start.y + 40, innerWidth, innerHeight, portal.offsetWidth, portal.offsetHeight);
        play('jumping', '出去逛逛，双击我就回窝');
        travelTo(target, instant, () => { play('waving', '我出来啦，拖着我一起走吧'); });
        resume();
      };
      on($('.home'), 'click', event => goHome(event.detail === 0));
      on($('.recall'), 'click', event => goHome(event.detail === 0));
      on($('.float'), 'click', event => goOut(event.detail === 0));
      on(body, 'dblclick', () => { if (portal) goHome(); });
      on(body, 'contextmenu', event => { if (portal) { event.preventDefault(); goHome(); } });
      on(body, 'keydown', event => { if (event.key === 'Escape' && portal) { event.preventDefault(); goHome(true); } });
      on($('.size'), 'input', e => { size = Number(e.target.value); stopTravel(); fitPortal(); position = null; layout(); save(); });
      on($('.follow'), 'change', e => { follow = e.target.checked; gaze = null; save(); });
      on($('.reset'), 'click', () => { size = 192; follow = true; $('.size').value = size; $('.follow').checked = true; goHome(true); layout(); save(); });
      const resize = new ResizeObserver(layout); resize.observe(stage);
      const bubbleResize = new ResizeObserver(positionBubble); bubbleResize.observe(bubble);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible && !portal) cancelAnimationFrame(frameId), frameId = 0; else resume(); }); intersection.observe(this);
      on(window, 'resize', () => { stopTravel(); fitPortal(); layout(); if (portal) { const r = portal.getBoundingClientRect(); const p = petPosition(r.x, r.y, innerWidth, innerHeight, r.width, r.height); portal.style.left = p.x + 'px'; portal.style.top = p.y + 'px'; } });
      on(window, 'blur', cancelDrag);
      on(document, 'visibilitychange', () => { cancelDrag(); if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; } else resume(); });
      const classes = new MutationObserver(resume); classes.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      this.play = play;
      this.setActivity = name => { if (!PET_STATES[name]) throw new Error('Unknown pet activity'); activity = name; gaze = null; };
      this.dispose = () => { disposed = true; cancelDrag(); abort.abort(); cancelAnimationFrame(frameId); resize.disconnect(); bubbleResize.disconnect(); intersection.disconnect(); classes.disconnect(); image.onload = image.onerror = null; stopTravel(); portal?.remove(); this.dispose = null; };
      layout(); resume();
    }
    disconnectedCallback() { this.dispose?.(); }
  });
}

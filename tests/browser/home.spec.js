import path from "node:path";
import { test, expect } from "@playwright/test";

// A decodable PCM fixture verifies real HTMLMediaElement playback without third-party flakiness.
function wav(seconds = 8) {
  const samples = seconds * 8000,
    buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(8000, 24);
  buffer.writeUInt32LE(16000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++)
    buffer.writeInt16LE(
      Math.round(Math.sin((i / 8000) * 440 * Math.PI * 2) * 1000),
      44 + i * 2,
    );
  return buffer;
}
async function mockMusic(page) {
  const requests = [];
  await page.route("https://api.injahow.cn/meting/**", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url.searchParams.get("type"));
    if (url.searchParams.get("type") === "url")
      return route.fulfill({
        contentType: "audio/wav",
        body: wav(),
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    if (url.searchParams.get("type") === "playlist")
      return route.fulfill({
        json: [],
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    if (url.searchParams.get("type") === "lrc")
      return route.fulfill({
        body: "[00:00.00]第一句\n[00:01.50]第二句",
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    return route.abort();
  });
  return requests;
}

test("desktop: immediate content, lazy audio, pause/resume, one-step next, settings and previews", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const requests = await mockMusic(page);
  await page.setViewportSize({ width: 1440, height: 980 });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("纯合子");
  await expect(page.locator(".hero-copy")).toContainText("普通学生");
  await expect(page.locator("#skillsList .stack-entry")).toHaveCount(6);
  expect(requests).toEqual([]);
  await expect(page.locator("#audio")).toHaveAttribute("preload", "none");
  await page.locator('.rail [data-music="play"]').click();
  await expect(page.locator("#musicStatus")).toHaveText("播放中");
  await expect
    .poll(() => page.locator("#audio").evaluate((audio) => audio.currentTime))
    .toBeGreaterThan(0);
  await page.locator('.rail [data-music="play"]').click();
  await expect(page.locator("#musicStatus")).toHaveText("已暂停");
  await page.locator('.rail [data-music="play"]').click();
  await expect(page.locator("#musicStatus")).toHaveText("播放中");
  await page.locator('.rail [data-music="next"]').click();
  await expect(page.locator("#songList .selected .song-num")).toHaveText("02");
  await page.locator('.rail [data-open="music"]').first().click();
  await expect(page.locator("#settingsDialog")).toBeVisible();
  await expect(page.locator("#pane-music")).toBeVisible();
  await expect(page.locator("#songList .song-item")).toHaveCount(28);
  await page.locator("#seek").fill("40");
  await expect
    .poll(() => page.locator("#audio").evaluate((audio) => audio.currentTime))
    .toBeGreaterThan(2);
  await page.keyboard.press("Escape");
  await page.locator('[data-preview="schedule"]').click();
  await expect(page.locator("#projectPreview")).toHaveAttribute(
    "src",
    "/img/optimized/schedule.webp",
  );
  await page.locator('.rail [data-open="appearance"]').click();
  await page.locator('[data-color="#c1a3ff"]').click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--accent"),
      ),
    )
    .toBe("#c1a3ff");
  await page.keyboard.press("Escape");
  await page.locator('.rail [data-music="play"]').click();
  expect(errors).toEqual([]);
  for (const section of await page.locator(".section").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/revealed/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: "docs/screenshots/chunhezi-desktop.png",
    fullPage: true,
  });
});

test("mobile: no horizontal overflow, music error recovers through a local file, modal closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://api.injahow.cn/meting/**", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("纯合子");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator('[data-open="more"]').first().click();
  await page.getByRole("button", { name: "音乐与歌单" }).click();
  await expect(page.locator("#settingsDialog")).toBeVisible();
  await page.locator('#pane-music [data-music="play"]').click();
  await expect(page.locator("#musicMessage")).toContainText(/不可用|无法播放/);
  await page.locator(".music-options summary").click();
  await page.locator("#localMusic").setInputFiles({
    name: "本地测试.wav",
    mimeType: "audio/wav",
    buffer: wav(),
  });
  await expect(page.locator("#musicStatus")).toHaveText("播放中");
  await expect(page.locator("#musicSourceLabel")).toContainText("本地音乐");
  await expect
    .poll(() => page.locator("#audio").evaluate((audio) => audio.currentTime))
    .toBeGreaterThan(0);
  await page.locator('#pane-music [data-music="play"]').click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#settingsDialog")).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await expect(page.locator("h1")).toContainText("纯合子");
  await page.screenshot({
    path: "docs/screenshots/chunhezi-mobile.png",
    fullPage: true,
  });
});

test("standalone HTML runs without Vue or a local server", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await mockMusic(page);
  await page.goto("file://" + path.resolve("dist/chunhezi_home.html"));
  await expect(page.locator("h1")).toContainText("纯合子");
  await expect(page.locator(".hero-copy")).toContainText("普通学生");
  await expect(page.locator("#skillsList .stack-entry")).toHaveCount(6);
  await expect(page.locator(".avatar").first()).toHaveAttribute(
    "src",
    /^data:image\/webp;base64,/,
  );
  await page.locator(".rail [data-music=play]").click();
  await expect(page.locator("#musicStatus")).toHaveText("播放中");
  expect(errors).toEqual([]);
});

import { test, expect } from '@playwright/test';

test('desktop pet uses the right column and can roam outside the glass card', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  const pet = page.locator('jingjing-pet');
  await expect(pet).toHaveAttribute('data-asset', 'ready');
  const projects = await page.locator('#projects').boundingBox();
  const clock = await page.locator('.clock').boundingBox();
  expect(clock.x).toBeGreaterThan(projects.x + projects.width);
  await pet.getByRole('button', { name: '放出来 ↗' }).click();
  const roamer = page.locator('body > .jingjing-roamer');
  await expect(roamer).toHaveCount(1);
  await expect.poll(() => roamer.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(roamer).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(roamer.locator('button')).toHaveCount(1);
  await expect(pet.locator('.controls')).toBeVisible();
  await expect(pet.getByRole('button', { name: '叫她回窝' })).toBeVisible();
  await expect(page.locator('.pet-project-link')).toHaveAttribute('href', 'https://github.com/zhouwu97/ds-pet');
  const sprite = roamer.locator('.body'), box = await sprite.boundingBox();
  await page.mouse.move(box.x + 96, box.y + 100); await page.mouse.down();
  await page.mouse.move(650, 400, { steps: 10 }); await page.mouse.up();
  expect((await roamer.boundingBox()).x).toBeLessThan(900);
  await page.locator('.rail [data-clear]').click();
  await expect(roamer).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(roamer).toBeVisible();
  await pet.getByRole('button', { name: '回到原位' }).click();
  await expect(roamer).toHaveCount(0);
  await expect(pet.locator('.body')).toBeVisible();
  await pet.getByRole('button', { name: '休息', exact: true }).click();
  await expect(pet).toHaveAttribute('data-state', 'sleep');
  await pet.getByRole('button', { name: '唤醒', exact: true }).click();
  await page.locator('#projectPreview').evaluate(img => img.decode());
  await expect(page.locator('.phone-preview')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'docs/screenshots/companion-desktop.png' });
  expect(errors).toEqual([]);
});

test('responsive layouts keep the pet and content within the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const width of [2560, 1440, 1280, 1024, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const card = await page.locator('.assistant-card').boundingBox();
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'docs/screenshots/companion-mobile.png', fullPage: true });
});

const {test,expect}=require('@playwright/test');

test('le serious game initialise une ambiance sonore contrôlable',async({page})=>{
  await page.goto('/game.html?seed=AUDIO');
  const button=page.locator('#soundToggle');
  await expect(button).toContainText('SON D’AMBIANCE');
  await page.locator('#play').click();
  await expect.poll(()=>page.evaluate(()=>!!window.__MELI_TEST__?.sound.ctx)).toBeTruthy();
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','false');
  expect(await page.evaluate(()=>localStorage.getItem('meli.sound'))).toBe('off');
});

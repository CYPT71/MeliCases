const {test,expect}=require('@playwright/test');
test('la vue en coupe ouvre le logement et restaure les plafonds en exploration',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/game.html?seed=OVERVIEW');
  await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__?.overview)).toBe(true);
  await expect(page.locator('body')).toHaveClass(/overview-mode/);
  await expect(page.locator('#overviewToggle')).toBeVisible();
  await page.click('#play');
  await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__.overview)).toBe(false);
  await page.keyboard.press('KeyV');
  await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__.overview)).toBe(true);
  expect(errors).toEqual([]);
});

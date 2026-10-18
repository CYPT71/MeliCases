const {test,expect}=require('@playwright/test');

test.describe('appartement jouable',()=>{
  test('le runtime charge le mobilier et les collisions',async({page})=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/game.html?seed=FUNCTIONAL-ROOMS');
    await expect(page.locator('#play')).toBeVisible();
    const s=await page.evaluate(()=>window.__MELI_TEST__);
    expect(s.furniture).toBeGreaterThanOrEqual(15);
    expect(s.colliders).toBeGreaterThan(15);
    expect(s.hitboxes).toBe(5);
    expect(errors).toEqual([]);
  });

  test('le joueur se déplace réellement au clavier',async({page})=>{
    await page.goto('/game.html?seed=FUNCTIONAL-MOVE');
    await page.click('#play');
    const before=await page.evaluate(()=>window.__MELI_TEST__.position);
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(450);
    await page.keyboard.up('KeyW');
    const after=await page.evaluate(()=>window.__MELI_TEST__.position);
    const distance=Math.hypot(after.x-before.x,after.z-before.z);
    expect(distance).toBeGreaterThan(.15);
  });

  test('les collisions empêchent de traverser le mobilier',async({page})=>{
    await page.goto('/game.html?seed=FUNCTIONAL-COLLISION');
    const result=await page.evaluate(()=>window.__MELI_TEST__.collisionProbe());
    expect(result.blocked).toBeTruthy();
    expect(result.colliders).toBeGreaterThan(15);
  });

  test('le mode course déplace plus vite que la marche',async({page})=>{
    await page.goto('/game.html?seed=FUNCTIONAL-RUN');
    await page.click('#play');
    const measure=async run=>{
      await page.evaluate(()=>window.__MELI_TEST__.teleport(.4,5.7));
      const before=await page.evaluate(()=>window.__MELI_TEST__.position);
      if(run)await page.keyboard.down('ShiftLeft');
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(180);
      await page.keyboard.up('KeyW');
      if(run)await page.keyboard.up('ShiftLeft');
      const after=await page.evaluate(()=>window.__MELI_TEST__.position);
      return Math.hypot(after.x-before.x,after.z-before.z);
    };
    const walk=await measure(false),run=await measure(true);
    expect(walk).toBeGreaterThan(.15);
    expect(run).toBeGreaterThan(walk*1.25);
  });
});
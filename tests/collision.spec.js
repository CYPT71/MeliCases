const{test,expect}=require('@playwright/test');test('le joueur dispose de collisions solides',async({page})=>{await page.goto('/game.html?seed=COLLISION-01');await expect(page.locator('#play')).toBeVisible();const s=await page.evaluate(()=>window.__MELI_TEST__);expect(s.colliders).toBeGreaterThan(10)});test('une seed explicite est reproductible',async({page})=>{await page.goto('/game.html?seed=FORMATEUR-42');const a=await page.evaluate(()=>window.__MELI_TEST__.seed);await page.reload();const b=await page.evaluate(()=>window.__MELI_TEST__.seed);expect(a).toBe('FORMATEUR-42');expect(b).toBe(a)});

test('le déplacement de secours ne traverse ni les murs ni les limites du logement',async({page})=>{
  await page.goto('/game.html?seed=ANTI-GLITCH');
  const result=await page.evaluate(()=>{
    const game=window.__MELI_TEST__;
    const outsideAccepted=game.teleport(20,20);
    game.teleport(0,-6);
    game.lookAt(0,-8);
    for(let i=0;i<20;i++)game.walkFallback(.25);
    const afterWall=game.position;
    game.moveBy(30,0);
    return{outsideAccepted,afterWall,afterSweep:game.position};
  });
  expect(result.outsideAccepted).toBeFalsy();
  expect(result.afterWall.z).toBeGreaterThan(-6.5);
  expect(Math.abs(result.afterSweep.x)).toBeLessThanOrEqual(6.42);
});

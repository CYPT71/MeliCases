const {test,expect}=require('@playwright/test');

test('le plan 3D partage murs, ouvertures, portes et fenêtres',async({page})=>{
  await page.goto('/game.html?seed=ARCHITECTURE');
  const architecture=await page.evaluate(()=>window.__MELI_TEST__.architecture);
  expect(architecture.walls).toBeGreaterThanOrEqual(12);
  expect(architecture.openings).toBe(3);
  expect(architecture.doors).toBe(2);
  expect(architecture.windows).toBe(4);
  expect(architecture.textures).toBeGreaterThanOrEqual(15);
});

test('les ouvertures intérieures restent franchissables',async({page})=>{
  await page.goto('/game.html?seed=DOOR-CLEARANCE');
  const probes=await page.evaluate(()=>{
    const c=window.__MELI_TEST__;
    return [[-.8,-1.45],[1,-1.95],[0,5.35]].map(([x,z])=>({x,z,blocked:c.blockedAt(x,z)}));
  });
  expect(probes).toHaveLength(3);
  for(const probe of probes)expect(probe.blocked).toBeFalsy();
});

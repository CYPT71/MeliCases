const {test,expect}=require('@playwright/test');

test('le plan 3D partage murs, ouvertures, portes et fenêtres',async({page})=>{
  await page.goto('/game.html?seed=ARCHITECTURE');
  const architecture=await page.evaluate(()=>window.__MELI_TEST__.architecture);
  expect(architecture.walls).toBeGreaterThanOrEqual(12);
  expect(architecture.openings).toBe(3);
  expect(architecture.doors).toBe(2);
  expect(architecture.windows).toBe(4);
  expect(architecture.ceilings).toBe(1);
  expect(architecture.ceilingMaterial).toBe('MeshBasicMaterial');
  expect(architecture.subfloor).toBe(1);
  expect(architecture.ceilingLights).toBe(6);
  expect(architecture.exteriorScenes).toBe(2);
  expect(architecture.textures).toBeGreaterThanOrEqual(15);
});
test('les impostes ferment entièrement le vide au-dessus des portes',async({page})=>{
  await page.goto('/game.html?seed=OVERDOORS');
  for(const id of['frame_bedroom','frame_bathroom','opening_living_kitchen']){
    expect(await page.evaluate(name=>window.__MELI_TEST__.sceneHas(`${name}_overdoor`),id)).toBe(true);
    expect(await page.evaluate(name=>window.__MELI_TEST__.sceneHas(`${name}_threshold`),id)).toBe(true);
  }
  for(const id of['outer_north','bedroom_south','wet_hall_north','living_kitchen_north'])expect(await page.evaluate(name=>window.__MELI_TEST__.sceneHas(`${name}_ceiling_joint`),id)).toBe(true);
});

test('les fenêtres montrent des décors image et chaque zone dispose d’un plafond éclairé',async({page})=>{
  await page.goto('/game.html?seed=INTERIOR-COHERENCE');
  await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__?.loadedExteriorTextures),{timeout:15_000}).toBe(2);
  const result=await page.evaluate(()=>({
    ceilings:MELI_CEILINGS.length,
    lights:MELI_CEILING_LIGHTS.length,
    accents:MELI_ACCENT_WALLS.length,
    windowScenes:MELI_ARCHITECTURE.windows.map(item=>item.exterior),
    sceneObjects:['light_bedroom','light_bathroom','light_living','light_kitchen','window_bedroom_exterior','window_kitchen_exterior'].map(id=>window.__MELI_TEST__.sceneHas(id))
  }));
  expect(result.ceilings).toBe(1);
  expect(result.lights).toBe(6);
  expect(result.accents).toBeGreaterThanOrEqual(6);
  expect(result.windowScenes).toEqual(expect.arrayContaining(['courtyard','rooftops']));
  expect(result.sceneObjects.every(Boolean)).toBeTruthy();
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

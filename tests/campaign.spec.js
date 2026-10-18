const {test,expect}=require('@playwright/test');

test('le menu présente les trois niveaux et les trois missions du niveau 2',async({page})=>{
  await page.goto('/game.html?level=2&seed=PARCOURS');
  await expect(page.locator('.level-card')).toHaveCount(3);
  await expect(page.locator('[data-level="2"]')).toHaveClass(/active/);
  const campaign=await page.evaluate(()=>window.__MELI_TEST__.campaign);
  expect(campaign.id).toBe(2);
  expect(campaign.total).toBe(20);
  expect(campaign.missions.map(m=>m.id)).toEqual(['securite','eau','confort']);
});

test('le tutoriel limite le parcours à trois situations guidées',async({page})=>{
  await page.goto('/game.html?level=1&seed=TUTO');
  const campaign=await page.evaluate(()=>window.__MELI_TEST__.campaign);
  expect(campaign.id).toBe(1);
  expect(campaign.total).toBe(3);
  await expect(page.locator('#selectedLevel')).toContainText('pas à pas');
});

test('le niveau 3 génère six pannes reproductibles et exige une fiche incident',async({page})=>{
  await page.goto('/game.html?level=3&seed=LOGEMENT-A');
  const first=await page.evaluate(()=>window.__MELI_TEST__.campaign);
  expect(first.total).toBe(6);
  expect(first.requiresIncidentReport).toBe(true);
  expect(new Set(first.questions.map(q=>q.id)).size).toBe(6);
  await page.evaluate(()=>window.__MELI_TEST__.openIncidentReport());
  await expect(page.locator('#incident')).toHaveClass(/open/);
  await expect(page.locator('#incidentForm [required]')).toHaveCount(5);
  await page.reload();
  const again=await page.evaluate(()=>window.__MELI_TEST__.campaign.questions.map(q=>q.id));
  expect(again).toEqual(first.questions.map(q=>q.id));
  await page.goto('/game.html?level=3&seed=LOGEMENT-B');
  const other=await page.evaluate(()=>window.__MELI_TEST__.campaign.questions.map(q=>q.id));
  expect(other).not.toEqual(again);
});

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
  await page.click('#play');
  await expect(page.locator('#tutorialCoach')).toHaveClass(/open/);
  await expect(page.locator('#tutorialCount')).toHaveText('Tutoriel · 1/6');
  await page.click('#nextTutorial');
  await expect(page.locator('#tutorialCount')).toHaveText('Tutoriel · 2/6');
  await expect(page.locator('#nextTutorial')).toBeDisabled();
  await page.click('#skipTutorial');
  await expect(page.locator('#tutorialCoach')).not.toHaveClass(/open/);
});

test('le déplacement reste jouable sans verrouillage du pointeur et accepte Z',async({page})=>{
  await page.goto('/game.html?level=2&seed=ACCESSIBLE');
  await page.click('#play');
  await page.evaluate(()=>document.exitPointerLock?.());
  const before=await page.evaluate(()=>window.__MELI_TEST__.position);
  await page.keyboard.down('KeyZ');await page.waitForTimeout(350);await page.keyboard.up('KeyZ');
  const after=await page.evaluate(()=>window.__MELI_TEST__.position);
  expect(Math.hypot(after.x-before.x,after.z-before.z)).toBeGreaterThan(.2);
  await expect(page.locator('#interactButton')).toBeVisible();
});

test('le niveau 3 génère six pannes reproductibles et exige une fiche incident',async({page})=>{
  await page.goto('/game.html?level=3&seed=LOGEMENT-A');
  const first=await page.evaluate(()=>window.__MELI_TEST__.campaign);
  expect(first.total).toBe(6);
  expect(first.requiresIncidentReport).toBe(true);
  expect(new Set(first.questions.map(q=>q.id)).size).toBe(6);
  expect(first.questions.every(q=>q.fault?.action&&q.fault?.urgency)).toBe(true);
  expect(await page.evaluate(()=>window.__MELI_TEST__.physicalFaults)).toBe(6);
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

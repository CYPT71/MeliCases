const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>page.addInitScript(()=>{localStorage.setItem('meli.quality','eco');HTMLElement.prototype.requestPointerLock=()=>Promise.resolve();}));
test('le menu présente briefing, missions thématiques et finale',async({page})=>{
 await page.goto('/game.html?level=2&seed=PARCOURS');await expect(page.locator('.level-card')).toHaveCount(3);
 const campaign=await page.evaluate(()=>__MELI_TEST__.campaign);expect(campaign.total).toBe(20);expect(campaign.missions.map(m=>m.id)).toEqual(['securite','eau','climat']);
 expect(campaign.missions.map(m=>m.minutes)).toEqual([35,25,35]);
 await expect(page.locator('[data-level="3"]')).toContainText('Sans chronomètre');
 await expect(page.locator('#factTime')).toHaveText('Libre');
 await expect(page.locator('#missionChoices')).not.toContainText(/\d+ min/);
 await expect(page.locator('.campaign-box')).not.toContainText('Escape');
});
test('le briefing accompagne la prise en main avant cinq questions',async({page})=>{
 await page.goto('/game.html?level=1&seed=TUTO');expect(await page.evaluate(()=>__MELI_TEST__.campaign.total)).toBe(5);await page.click('#play');await expect(page.locator('#tutorialCoach')).toHaveClass(/open/);await page.click('#nextTutorial');await expect(page.locator('#nextTutorial')).toBeDisabled();await page.click('#skipTutorial');await expect(page.locator('#tutorialCoach')).not.toHaveClass(/open/);
});
test('le déplacement reste jouable sans capture et accepte Z',async({page})=>{
 await page.goto('/game.html?level=1&seed=ACCESSIBLE');await page.click('#play');await page.click('#skipTutorial');const before=await page.evaluate(()=>__MELI_TEST__.position);await page.keyboard.down('KeyZ');await page.waitForTimeout(350);await page.keyboard.up('KeyZ');const after=await page.evaluate(()=>__MELI_TEST__.position);expect(Math.hypot(after.x-before.x,after.z-before.z)).toBeGreaterThan(.2);
});
test('la finale commune propose cinq situations et une fiche complète',async({page})=>{
 await page.goto('/game.html?level=3&seed=LOGEMENT-A');const campaign=await page.evaluate(()=>__MELI_TEST__.campaign);expect(campaign.total).toBe(5);expect(campaign.requiresIncidentReport).toBe(true);expect(campaign.randomized).toBe(false);expect(campaign.questions.every(q=>q.observation&&q.information&&q.action)).toBe(true);await expect(page.locator('#play')).toBeDisabled();
});

const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{await page.addInitScript(()=>{localStorage.setItem('meli.quality','eco');HTMLElement.prototype.requestPointerLock=()=>Promise.resolve();});});
test('la finale propose une observation sans consigne de réparation ni aide automatique',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('meli.story.progress.v1',JSON.stringify({schema:1,completed:{1:true,securite:true,eau:true,climat:true},answers:{},draft:{}})));
 await page.goto('/game.html?level=3');await page.click('#play');await page.evaluate(()=>__MELI_TEST__.openFirstFault());await expect(page.locator('.safety-action')).toHaveCount(0);await expect(page.locator('#recordObservation')).toBeVisible();await expect(page.locator('#validateAnswer')).toHaveCount(0);
});
test('la fiche finale conserve le brouillon sans livrer de correction',async({page})=>{
 await page.addInitScript(()=>{if(!localStorage.getItem('meli.story.progress.v1'))localStorage.setItem('meli.story.progress.v1',JSON.stringify({schema:1,completed:{1:true,securite:true,eau:true,climat:true},answers:{},draft:{}}));});
 await page.goto('/game.html?level=3');await page.click('#play');await page.click('#reportButton');await page.locator('[name="301-fact"]').selectOption('other-1');await page.locator('[name="301-notes"]').fill('Un fait observé dans la cuisine.');await page.click('#closeReport');await page.reload();await page.click('#play');await page.click('#reportButton');await expect(page.locator('[name="301-fact"]')).toHaveValue('other-1');await expect(page.locator('[name="301-notes"]')).toHaveValue('Un fait observé dans la cuisine.');await expect(page.locator('#incidentErrors')).toBeEmpty();
});

const {test,expect}=require('@playwright/test');
test.use({viewport:{width:800,height:600}});
test.beforeEach(async({page})=>{await page.addInitScript(()=>{localStorage.setItem('meli.quality','eco');HTMLElement.prototype.requestPointerLock=()=>Promise.resolve();});});
const saved={schema:1,unlocked:1,completed:{1:true},answers:{},draft:{}};
async function setup(page,state=saved){await page.addInitScript(s=>{if(!localStorage.getItem('meli.story.progress.v1'))localStorage.setItem('meli.story.progress.v1',JSON.stringify(s));},state);}
async function openCase(page,id){await page.evaluate(id=>__MELI_TEST__.openCase(id),id);await expect(page.locator('#modal')).toHaveClass(/open/);}
test('le briefing comporte cinq questions non notées et débloque les missions même après des erreurs',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/game.html?level=1&seed=STORY');
 await expect(page.locator('[data-level="3"]')).toBeDisabled();await page.click('#play');await page.click('#skipTutorial');
 const questions=await page.evaluate(()=>__MELI_TEST__.campaign.questions);expect(questions).toHaveLength(5);
 for(const q of questions){await openCase(page,q.id);await page.locator(`[data-i="${(q.correct[0]+1)%q.choices.length}"]`).click();await page.click('#validateAnswer');await expect(page.locator('#fb')).toContainText('non noté');await page.click('#back');}
 await expect(page.locator('#completionTitle')).toHaveText('BRIEFING TERMINÉ');
 expect(await page.evaluate(()=>__MELI_TEST__.storyProgress.completed[1])).toBe(true);expect(errors).toEqual([]);
});
test('missions libres, fiche accompagnée, progression et décor conservé',async({page})=>{
 await setup(page);await page.goto('/game.html?level=2&seed=STORY');await page.locator('[data-mission="climat"]').click();await page.click('#play');
 expect(await page.evaluate(()=>__MELI_TEST__.furniture)).toBeGreaterThan(15);
 const q=await page.evaluate(()=>__MELI_TEST__.campaign.questions.find(q=>q.mission==='climat'));
 await openCase(page,q.id);await page.locator(`[data-i="${q.correct[0]}"]`).click();await page.click('#validateAnswer');await page.click('#practiceReport');
 await page.locator(`[name="${q.id}-fact"]`).selectOption('fact');await page.locator(`[name="${q.id}-information"]`).selectOption('information');await page.locator(`[name="${q.id}-action"]`).selectOption('other-1');await page.locator('#incidentForm [type="submit"]').click();
 await expect(page.locator('#incidentErrors')).toContainText('À revoir');await page.locator(`[name="${q.id}-action"]`).selectOption('action');await page.locator('#incidentForm [type="submit"]').click();await page.click('#continueAfterReport');
 await page.reload();expect(await page.evaluate(id=>__MELI_TEST__.observed.includes(id),q.id)).toBe(true);
 await expect(page.locator('#timer')).toHaveText('Sans chronomètre');await expect(page.locator('[data-level="3"]')).toBeDisabled();
});
test('accès direct à la finale verrouillé sans les trois missions',async({page})=>{await page.goto('/game.html?level=3');await expect(page.locator('#play')).toBeDisabled();});
test('finale : cinq situations inédites, aucune correction avant la fiche complète et bilan différé',async({page})=>{
 await setup(page,{...saved,completed:{1:true,securite:true,eau:true,climat:true,2:true}});await page.goto('/game.html?level=3&seed=FINAL');await page.click('#play');
 const questions=await page.evaluate(()=>__MELI_TEST__.campaign.questions);expect(questions).toHaveLength(5);
 for(const q of questions){await openCase(page,q.id);await expect(page.locator('#dialog .answer')).toHaveCount(0);await page.click('#recordObservation');}
 await expect(page.locator('#incident')).toHaveClass(/open/);
 for(const q of questions){await page.locator(`[name="${q.id}-fact"]`).selectOption('other-1');await page.locator(`[name="${q.id}-information"]`).selectOption('other-1');await page.locator(`[name="${q.id}-action"]`).selectOption('other-1');}
 await expect(page.locator('#incidentErrors')).toBeEmpty();await page.locator('#incidentForm [type="submit"]').click();
 await expect(page.locator('#completionTitle')).toHaveText('VOTRE BILAN');await expect(page.locator('#completionText')).toContainText('0%');await expect(page.locator('#finalReview section')).toHaveCount(5);
});

test('les trois missions terminées dans un ordre choisi débloquent réellement la finale',async({page})=>{
 test.setTimeout(120000);await setup(page);await page.goto('/game.html?level=2&seed=FULL-STORY');
 for(const mission of ['climat','eau','securite']){
  await page.locator(`[data-mission="${mission}"]`).click();await page.click('#play');
  const questions=await page.evaluate(m=>__MELI_TEST__.campaign.questions.filter(q=>q.mission===m),mission);
  for(const q of questions){
   await openCase(page,q.id);await page.locator(`[data-i="${q.correct[0]}"]`).click();await page.click('#validateAnswer');await page.click('#practiceReport');
   await page.locator(`[name="${q.id}-fact"]`).selectOption('fact');await page.locator(`[name="${q.id}-information"]`).selectOption('information');await page.locator(`[name="${q.id}-action"]`).selectOption('action');await page.locator('#incidentForm [type="submit"]').click();await page.click('#continueAfterReport');
  }
  await expect(page.locator('#completion')).toHaveClass(/open/);
  expect(await page.evaluate(id=>__MELI_TEST__.storyProgress.completed[id],mission)).toBe(true);
  if(mission!=='securite')await page.click('#nextLevel');
 }
 await page.click('#nextLevel');await expect(page).toHaveURL(/level=3/);await expect(page.locator('#play')).toBeEnabled();
});

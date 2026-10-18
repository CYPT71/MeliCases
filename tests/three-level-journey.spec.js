const {test,expect}=require('@playwright/test');

test.use({viewport:{width:1100,height:760},reducedMotion:'reduce'});
test('un apprenant peut jouer toutes les actions des trois niveaux jusqu’au bilan',async({page})=>{
  test.setTimeout(300000);
  await page.addInitScript(()=>{
    if(!sessionStorage.getItem('meli.journey.started')){
      localStorage.clear();
      sessionStorage.setItem('meli.journey.started','1');
    }
    localStorage.setItem('meli.quality','eco');
    HTMLElement.prototype.requestPointerLock=()=>Promise.resolve();
  });
  const openCase=async id=>{
    await page.evaluate(caseId=>__MELI_TEST__.openCase(caseId),id);
    await expect(page.locator('#modal')).toHaveClass(/open/);
  };
  const choose=async indexes=>{
    for(const index of indexes)await page.locator(`[data-i="${index}"]`).click({force:true});
    await page.locator('#validateAnswer').click({force:true});
  };
  const completePractice=async q=>{
    await page.click('#practiceReport');
    await page.locator(`[name="${q.id}-fact"]`).selectOption('fact');
    await page.locator(`[name="${q.id}-information"]`).selectOption('information');
    await page.locator(`[name="${q.id}-action"]`).selectOption('action');
    await page.locator(`[name="${q.id}-notes"]`).fill('Constat localisé, information vérifiée et transmission au bon interlocuteur.');
    await page.locator('#incidentForm [type="submit"]').click();
    await page.click('#continueAfterReport');
  };

  // Niveau 1 : menus, commandes, déplacement, vue globale et cinq décisions.
  await page.goto('/game.html?level=1&seed=COMPLETE-JOURNEY');
  await page.click('#startOptions');await expect(page.locator('#options')).toHaveClass(/open/);await page.click('#closeOptions');
  await page.click('#play');await page.click('#skipTutorial');
  const before=await page.evaluate(()=>__MELI_TEST__.position);
  await page.keyboard.down('KeyZ');await page.waitForTimeout(250);await page.keyboard.up('KeyZ');
  const after=await page.evaluate(()=>__MELI_TEST__.position);
  expect(Math.hypot(after.x-before.x,after.z-before.z)).toBeGreaterThan(.1);
  await page.keyboard.press('KeyV');await expect.poll(()=>page.evaluate(()=>__MELI_TEST__.overview)).toBe(true);
  await page.keyboard.press('KeyV');await expect.poll(()=>page.evaluate(()=>__MELI_TEST__.overview)).toBe(false);
  const briefing=await page.evaluate(()=>__MELI_TEST__.campaign.questions);
  for(const q of briefing){
    await openCase(q.id);
    await choose([(q.correct[0]+1)%q.choices.length]);
    await expect(page.locator('#fb')).toContainText('non noté');
    await page.click('#back');
  }
  await expect(page.locator('#completionTitle')).toHaveText('BRIEFING TERMINÉ');
  await page.click('#nextLevel');await expect(page).toHaveURL(/level=2/);

  // Niveau 2 : les trois missions dans un ordre libre, erreur, correction et fiche.
  for(const [index,mission] of ['eau','climat','securite'].entries()){
    await page.locator(`[data-mission="${mission}"]`).click();await page.click('#play');
    const questions=await page.evaluate(name=>__MELI_TEST__.campaign.questions.filter(q=>q.mission===name),mission);
    for(const [questionIndex,q] of questions.entries()){
      await openCase(q.id);
      if(index===0&&questionIndex===0){
        const wrong=[...q.choices.keys()].find(choice=>!q.correct.includes(choice));
        await choose([wrong]);await expect(page.locator('#fb')).toHaveClass(/bad/);await page.click('#retry');
      }
      await choose(q.correct);await expect(page.locator('#fb')).toHaveClass(/ok/);await completePractice(q);
    }
    await expect(page.locator('#completion')).toHaveClass(/open/);
    if(index<2)await page.click('#nextLevel');
  }
  await page.click('#nextLevel');await expect(page).toHaveURL(/level=3/);

  // Niveau 3 : observation autonome de toutes les pannes puis fiche complète.
  await page.click('#play');
  const finalCases=await page.evaluate(()=>__MELI_TEST__.campaign.questions);
  for(const q of finalCases){await openCase(q.id);await page.click('#recordObservation');}
  await expect(page.locator('#incident')).toHaveClass(/open/);
  for(const q of finalCases){
    await page.locator(`[name="${q.id}-fact"]`).selectOption('fact');
    await page.locator(`[name="${q.id}-information"]`).selectOption('information');
    await page.locator(`[name="${q.id}-action"]`).selectOption('action');
    await page.locator(`[name="${q.id}-notes"]`).fill('Situation observée et signalée sans intervention technique.');
  }
  await page.locator('#incidentForm [type="submit"]').click();
  await expect(page.locator('#completionTitle')).toHaveText('VOTRE BILAN');
  await expect(page.locator('#completionText')).toContainText('100%');
  await expect(page.locator('#finalReview section')).toHaveCount(5);
  expect(await page.evaluate(()=>__MELI_TEST__.storyProgress.completed[3])).toBe(true);
});

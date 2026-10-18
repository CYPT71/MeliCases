const {test,expect}=require('@playwright/test');
test.describe('serious game métier',()=>{
  test.beforeEach(async({page})=>{await page.goto('/serious.html');await page.click('#startMission')});
  test('présente une mission contextualisée et vingt situations',async({page})=>{
    await expect(page.getByText('Mandat n° ML-204')).not.toBeVisible();
    await expect(page.locator('.question')).toBeVisible();
    expect(await page.evaluate(()=>MELI_QUIZ_BANK.length)).toBe(20);
    expect(await page.evaluate(()=>Object.keys(MELI_FEEDBACK).length)).toBe(20);
  });
  test('explique une réponse erronée et permet de réessayer',async({page})=>{
    const result=await page.evaluate(()=>{const q=MELI_QUIZ_BANK.find(x=>x.topic==='gaz');return q.correct.includes(1)?0:1});
    await page.locator(`[data-choice="${result}"]`).click();await page.click('#validate');
    await expect(page.locator('.feedback.bad')).toBeVisible();
    await expect(page.getByText('Réponse attendue')).toBeVisible();
    await expect(page.getByRole('button',{name:'Réessayer'})).toBeVisible();
  });
  test('explique aussi une bonne réponse',async({page})=>{
    const correct=await page.evaluate(()=>MELI_QUIZ_BANK.find(x=>x.topic==='gaz').correct);
    for(const i of correct)await page.locator(`[data-choice="${i}"]`).click();
    await page.click('#validate');
    await expect(page.locator('.feedback.ok')).toBeVisible();
    await expect(page.getByText('Référence métier')).toBeVisible();
  });
});

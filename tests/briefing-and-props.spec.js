import {test,expect} from '@playwright/test';

test('le briefing peut être passé sans créer de réponses ni de score',async({page})=>{
  await page.goto('/game.html?level=1&seed=SKIP');
  await expect(page.locator('#skipBriefing')).toBeVisible();
  await page.click('#skipBriefing');
  await expect(page).toHaveURL(/level=2/);
  const progress=await page.evaluate(()=>__MELI_TEST__.storyProgress);
  expect(progress.briefingSkipped).toBe(true);
  expect(progress.completed['1']).toBe(true);
  expect(progress.answers['1']).toBeUndefined();
  await expect(page.locator('[data-level="2"]')).toBeEnabled();
});

test('les accessoires détaillés sont des modèles glTF open source',async({page})=>{
  await page.goto('/game.html?level=1&seed=DETAIL');
  await expect.poll(()=>page.evaluate(()=>MELI_PROPS.filter(prop=>__MELI_TEST__.sceneHas(prop.id)).length),{timeout:20_000}).toBe(17);
  await expect.poll(()=>page.evaluate(()=>performance.getEntriesByType('resource').filter(entry=>/\/(chairDesk|laptop|lampRoundTable|books|trashcan|kitchenSink|kitchenStoveElectric|kitchenCoffeeMachine|kitchenMicrowave|stoolBar|loungeChair|speaker|sideTable|coatRackStanding|toaster)\.glb$/.test(new URL(entry.name).pathname)).length),{timeout:20_000}).toBe(15);
});

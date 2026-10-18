const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    window.__storylineVars={MeliLearnerName:'Camille',MeliDifficulty:'expert',MeliSeed:'SL-42',MeliSuspendData:''};
    window.__meliEvents=[];
    window.GetPlayer=()=>({SetVar:(name,value)=>window.__storylineVars[name]=value,GetVar:name=>window.__storylineVars[name]});
    ['ready','decision','progress','suspend','completed','state'].forEach(type=>window.addEventListener(`melicases:${type}`,event=>window.__meliEvents.push(event.detail)));
  });
});

test('synchronise lancement, décision, progression et reprise avec Storyline',async({page})=>{
  await page.goto('/serious.html');
  const launch=await page.evaluate(()=>({vars:window.__storylineVars,data:MeliCasesStoryline.getLaunchData(),connected:MeliCasesStoryline.isConnected()}));
  expect(launch.connected).toBeTruthy();
  expect(launch.data.learnerName).toBe('Camille');
  expect(launch.data.difficulty).toBe('expert');
  expect(launch.vars.MeliVersion).toBe('2.0.0');
  expect(launch.vars.MeliStatus).toBe('in-progress');
  await page.click('#startMission');
  const correct=await page.evaluate(()=>MELI_QUIZ_BANK.find(q=>q.topic==='gaz').correct);
  for(const index of correct)await page.locator(`[data-choice="${index}"]`).click();
  await page.getByRole('button',{name:'Certain',exact:true}).click();
  await page.click('#validate');
  const synced=await page.evaluate(()=>({vars:window.__storylineVars,events:window.__meliEvents.map(event=>event.type)}));
  expect(synced.vars.MeliLastResult).toBe('correct');
  expect(synced.vars.MeliProgress).toBe(5);
  expect(synced.vars.MeliXP).toBeGreaterThan(0);
  expect(synced.vars.MeliSuspendData).toContain('answered');
  expect(synced.events).toEqual(expect.arrayContaining(['ready','decision','progress','suspend']));
});

test('expose le résultat final et répond aux commandes postMessage',async({page})=>{
  await page.goto('/serious.html');
  await page.evaluate(()=>MeliCasesStoryline.completed('SL-42',{score:86,safety:92,xp:1420,passed:true,solved:20}));
  await page.evaluate(()=>postMessage({source:'storyline',type:'melicases:command',action:'request-state'},'*'));
  await expect.poll(()=>page.evaluate(()=>window.__meliEvents.some(event=>event.type==='state'))).toBeTruthy();
  const vars=await page.evaluate(()=>window.__storylineVars);
  expect(vars.MeliCompleted).toBeTruthy();
  expect(vars.MeliPassed).toBeTruthy();
  expect(vars.MeliScore).toBe(86);
  expect(vars.MeliProgress).toBe(100);
});

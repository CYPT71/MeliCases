const {test,expect}=require('@playwright/test');

test('une panne impose une mesure conservatoire avant le diagnostic',async({page})=>{
  await page.goto('/game.html?level=3&seed=ACTION-01');
  await page.evaluate(()=>window.__MELI_TEST__.openFirstFault());
  await expect(page.locator('.safety-action')).toHaveCount(3);
  await page.locator('.answer').first().click();
  await expect(page.locator('#validateAnswer')).toBeDisabled();
  await page.locator('.safety-action').first().click();
  await expect(page.locator('#validateAnswer')).toBeEnabled();
});

test('la fiche incident est évaluée contre les pannes réellement générées',async({page})=>{
  await page.goto('/game.html?level=3&seed=RAPPORT-01');
  const fault=await page.evaluate(()=>window.__MELI_TEST__.campaign.questions[0].fault);
  const roomNames={sdb:'Salle de bains',entree:'Entrée',wc:'WC',cuisine:'Cuisine',salon:'Salon',chambre:'Chambre'};
  await page.evaluate(()=>window.__MELI_TEST__.openIncidentReport());
  await page.selectOption('#incidentRoom',{label:roomNames[fault.room]});
  await page.selectOption('#incidentType',{label:fault.category});
  await page.fill('#incidentObservation','Une anomalie visible et persistante est constatée sur cet équipement du logement.');
  await page.selectOption('#incidentUrgency',{label:fault.urgency});
  await page.fill('#incidentAction','Aucune action adaptée');
  await page.click('#incidentForm button[type="submit"]');
  await expect(page.locator('#incidentErrors')).toContainText('Fiche à corriger');
  await page.fill('#incidentAction',fault.action);
  await page.click('#incidentForm button[type="submit"]');
  await expect(page.locator('#completion')).toHaveClass(/open/);
  const saved=await page.evaluate(seed=>JSON.parse(localStorage.getItem(`meli.incident.${seed}`)),'RAPPORT-01');
  expect(saved.assessment.score).toBe(100);
  expect(saved.assessment.matchedFault).toBe(fault.id);
});

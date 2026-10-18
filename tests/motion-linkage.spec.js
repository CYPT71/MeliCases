const {test,expect}=require('@playwright/test');
test.use({viewport:{width:1280,height:800}});
test.beforeEach(async({page})=>{await page.addInitScript(()=>{localStorage.setItem('meli.quality','eco');HTMLElement.prototype.requestPointerLock=()=>Promise.resolve();localStorage.setItem('meli.story.progress.v1',JSON.stringify({schema:1,completed:{1:true,securite:true,eau:true,climat:true},answers:{},draft:{}}));});});
test('chaque situation est reliée à un équipement de sa pièce, sans marqueurs superposés',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/game.html?level=2');
 const rows=await page.evaluate(()=>__MELI_TEST__.equipmentBindings.map(b=>({...b,expectedRoom:MeliEquipment.equipment[b.equipmentId].room,exists:__MELI_TEST__.sceneHas(MeliEquipment.equipment[b.equipmentId].object||'equipment_'+b.equipmentId)})));
 expect(rows).toHaveLength(20);for(const row of rows){expect(row.room).toBe(row.expectedRoom);expect(row.exists).toBe(true);expect(Math.hypot(...row.target.map((n,i)=>n-row.marker[i]))).toBeLessThan(.8);expect(row.linked).toBe(row.visible);}
 expect(new Set(rows.map(r=>r.marker.join(','))).size).toBe(20);expect(errors).toEqual([]);
});
test('un clic réel sur le radiateur ouvre son activité puis sa fiche',async({page})=>{
 await page.goto('/game.html?level=2');await page.locator('[data-mission="climat"]').click();await page.click('#play');await page.evaluate(()=>__MELI_TEST__.setOverview(true));
 await page.waitForTimeout(100);const point=await page.evaluate(()=>__MELI_TEST__.screenPoint(15,'equipment'));await page.mouse.click(point.x,point.y);
 await expect(page.locator('#dialog .equipment-context')).toContainText('Radiateur du séjour');
 await page.locator('.short-explanation summary').click();await expect(page.locator('[data-motion="heat"]')).toBeVisible();
 await page.locator('[data-motion-toggle]').click();await expect(page.locator('.motion-design')).toHaveClass(/motion-paused/);await page.locator('[data-motion-replay]').click();await expect(page.locator('.motion-design')).not.toHaveClass(/motion-paused/);
 const correct=await page.evaluate(()=>__MELI_TEST__.campaign.questions.find(q=>q.id===15).correct[0]);await page.locator(`[data-i="${correct}"]`).click();await page.click('#validateAnswer');await page.click('#practiceReport');await expect(page.locator('.report-case legend')).toHaveText('Séjour · Radiateur du séjour');
});
test('réduction des animations et absence d’aide animée en finale',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/game.html?level=2');await page.locator('[data-mission="climat"]').click();await page.click('#play');await page.evaluate(()=>__MELI_TEST__.openCase(16));await page.locator('.short-explanation summary').click();
 expect(await page.locator('.motion-flow').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await page.goto('/game.html?level=3');await page.click('#play');await page.evaluate(()=>__MELI_TEST__.openCase(301));await expect(page.locator('.motion-design')).toHaveCount(0);await expect(page.locator('#dialog h2')).toHaveText('Chaudière murale');
});
test('un mur placé devant une cible empêche l’interaction à travers la paroi',async({page})=>{
 await page.goto('/game.html');const result=await page.evaluate(async()=>{
  const T=await import('/assets/vendor/three/three.module.js');const scene=new T.Scene(),camera=new T.PerspectiveCamera();camera.position.set(0,0,0);camera.lookAt(0,0,-3);camera.updateMatrixWorld();
  const target=new T.Mesh(new T.BoxGeometry(.3,.3,.3),new T.MeshBasicMaterial());target.position.z=-2;scene.add(target);
  const wall=new T.Mesh(new T.BoxGeometry(2,2,.1),new T.MeshBasicMaterial());wall.position.z=-1;scene.add(wall);scene.updateMatrixWorld(true);
  const system=new MeliInteractionSystem(T,scene,camera,{occluders:[wall],distance:3});system.add(target,{id:'target'});scene.updateMatrixWorld(true);const blocked=system.focus()===null;wall.visible=false;return{blocked,visible:!!system.focus()};
 });expect(result).toEqual({blocked:true,visible:true});
});

const {test,expect}=require('@playwright/test');

test('les meubles principaux utilisent les GLB open source locaux',async({page})=>{
 await page.goto('/game.html?seed=OPEN-FURNITURE');
 await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__?.openSourceFurniture.length),{timeout:20_000}).toBe(22);
 for(const path of ['kenney/bed.glb','kenney/sofa.glb','kenney/wardrobe.glb','poly-google/bike.glb']){
  const response=await page.request.get(`/assets/models/opensource/${path}`);
  expect(response.ok(),path).toBeTruthy();
  expect((await response.body()).length,path).toBeGreaterThan(1_000);
 }
});

test('chaque élément de mobilier visible charge un modèle glTF',async({page})=>{
 await page.goto('/game.html?seed=ALL-GLTF');
 const total=await page.evaluate(()=>MELI_FURNITURE.length);
 await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__?.gltfFurniture.length),{timeout:20_000}).toBe(total);
});
